import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://audio-centrum.azurewebsites.net/"
    : "http://localhost:8080";

export const axiosApi = axios.create({
  baseURL: API_URL,
});

export const socket = io(API_URL);

export interface ITrackPlaylistData {
  id: string;
  title: string;
  artist: string;
  album: string;
}

interface INowPlayingInfo {
  trackTitle: string;
  trackArtist: string;
  radioStation: boolean;
}
export interface IRadioStationData {
  id: string;
  title: string;
  url: string;
}

export interface IBroadcastData {
  id: string;
  title: string;
  author: string;
  room: string | null;
}

export interface IBroadcastRecordingData {
  id: string;
  title: string;
  author: string;
  url: string;
}

export interface ITrack {
  id: string;
  source: ArrayBuffer;
}

interface IAudioPlayerContext {
  playTrack: () => void;
  stopTrack: () => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  queue: ITrackPlaylistData[];
  setQueue: (queue: ITrackPlaylistData[]) => void;
  trackId: ITrack | null;
  setTrackId: (trackId: ITrack | null) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  source: AudioBufferSourceNode | null | MediaStreamAudioSourceNode;
  nowPlayingInfo: INowPlayingInfo | null;
  setNowPlayingInfo: (nowPlayingInfo: INowPlayingInfo | null) => void;
  playRadioStation: (name: string, url: string) => void;
  customStationURL: string | null;
  setCustomStationURL: (customStationURL: string) => void;
  showResumeQueue: boolean;
  switchFromRadioToQueue: () => void;
  isListeningToBroadcast: boolean;
  setIsListeningToBroadcast: (isListeningToBroadcast: boolean) => void;
  broadcastRoomId: string | null;
  setBroadcastRoomId: (broadcastRoomId: string) => void;
  playBroadcast: (title: string, author: string, broadcastURL: string) => void;
  joinBroadcastRoom: (broadcastRoomId: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  startRecording: () => void;
  stopRecording: () => void;
  broadcastSessionData: IBroadcastData | null;
  setBroadcastSessionData: (
    broadcastSessionData: IBroadcastData | null,
  ) => void;
  recordedAudioURL: string | null;
  setRecordedAudioURL: (recordedAudioURL: string | null) => void;
  broadcastAudioURL: string | null;
}

const AudioPlayerContext = createContext<IAudioPlayerContext | undefined>(
  undefined,
);

const AudioContextProvider = ({ children }: any) => {
  const [volume, setVolume] = useState(1);
  const [trackId, setTrackId] = useState<ITrack | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const currentBuffer = useRef<AudioBuffer | null>(null);
  const [queue, setQueue] = useState<ITrackPlaylistData[]>([]);
  const [nowPlayingInfo, setNowPlayingInfo] = useState<INowPlayingInfo | null>(
    null,
  );
  const [trackHistory, setTrackHistory] = useState<ITrackPlaylistData[]>([]);
  const [showResumeQueue, setShowResumeQueue] = useState<boolean>(false);
  const [radioStationURL, setRadioStationURL] = useState<string>();
  const radioStationAudio = useRef<HTMLAudioElement | null>(null);
  const [customStationURL, setCustomStationURL] = useState<string | null>(null);
  const [isListeningToBroadcast, setIsListeningToBroadcast] = useState(true);
  const [broadcastRoomId, setBroadcastRoomId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordedChunks = useRef<Blob[]>([]);
  const [recordingStream, setRecordingStream] = useState<MediaRecorder | null>(
    null,
  );
  const [broadcastAudioURL, setBroadcastAudioURL] = useState<string | null>(
    null,
  );
  const mediaStream = useRef<MediaStream | null>(null);
  const broadcastMediaSource = useRef<MediaSource | null>(null);
  const broadcastChunksQueue = useRef<Array<Blob>>([]);
  const blob = useRef<Blob | null>(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);
  const [broadcastSessionData, setBroadcastSessionData] =
    useState<IBroadcastData | null>(null);

  useEffect(() => {
    if (!window) {
      return;
    }
    broadcastMediaSource.current = new MediaSource();
    const newAudioCtx = new AudioContext();
    setAudioCtx(newAudioCtx);
    source.current = new AudioBufferSourceNode(newAudioCtx);
    console.log(uuidv4());
  }, []);

  const prepareAudio = useCallback(
    (audioSource: ArrayBuffer | null) => {
      if (!audioCtx) {
        return;
      }
      if (audioSource !== null) {
        audioCtx.decodeAudioData(
          audioSource.slice(0),
          (buffer) => {
            if (!source.current) {
              return;
            }
            console.log("buffer", buffer);
            if (source.current instanceof AudioBufferSourceNode) {
              currentBuffer.current = buffer;
              source.current.buffer = buffer;

              source.current.connect(audioCtx.destination);
              source.current.loop = false;
            }
          },
          (e) => {
            `Error with decoding audio data ${e}`;
          },
        );
      }
    },

    [audioCtx],
  );

  const manageQueueOnNextTrack = useCallback(() => {
    currentBuffer.current = null;
    const remaining = queue.slice(1);
    if (remaining.length === 0) {
      setIsPlaying(false);
      currentBuffer.current = null;
      source.current = null;
      setTrackId(null);
    } else {
      const finishedTrack = queue[0];
      setTrackHistory((prev) => [...prev, finishedTrack]);
      socket.emit("send-track-source", remaining[0]);
    }
    setQueue(remaining);
  }, [queue]);

  const manageQueueOnPreviousTrack = useCallback(() => {
    currentBuffer.current = null;
    if (trackHistory.length === 0) {
      setIsPlaying(false);
    } else {
      socket.emit("send-track-source", trackHistory[trackHistory.length - 1]);
      setQueue((prev) => [trackHistory[trackHistory.length - 1], ...prev]);
      setTrackHistory((prev) => prev.slice(0, prev.length - 1));
    }
  }, [trackHistory]);

  const playTrack = useCallback(() => {
    if (nowPlayingInfo?.radioStation) {
      if (radioStationAudio.current !== null) {
        radioStationAudio.current.play();
        setIsPlaying(true);
      } else {
        const audio = new Audio(radioStationURL);
        radioStationAudio.current = audio;
        radioStationAudio.current.play();
        setIsPlaying(true);
      }
      return;
    } else {
      radioStationAudio.current?.pause();
      radioStationAudio.current = null;
    }
    if (trackId === null || audioCtx === null) {
      return;
    }
    socket.emit("get-now-playing-info", trackId.id);
    source.current = new AudioBufferSourceNode(audioCtx);
    source.current.onended = () => {
      manageQueueOnNextTrack();
    };
    if (currentBuffer.current === null) {
      prepareAudio(trackId.source);
      source.current.start(0);
      setIsPlaying(true);
    } else {
      source.current.buffer = currentBuffer.current;
      setIsPlaying(true);
    }
    audioCtx.resume();
  }, [
    audioCtx,
    prepareAudio,
    manageQueueOnNextTrack,
    trackId,
    nowPlayingInfo,
    radioStationURL,
  ]);

  const stopTrack = () => {
    if (currentBuffer.current != null && audioCtx != null) {
      audioCtx.suspend();
    }
    if (nowPlayingInfo?.radioStation) {
      if (radioStationAudio.current) {
        radioStationAudio.current.pause();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    setNowPlayingInfo((prev) => {
      if (prev === null) {
        return null;
      }
      return {
        ...prev,
        radioStation: false,
      };
    });
    setShowResumeQueue(false);

    playTrack();
  }, [trackId]);

  const playNextTrack = () => {
    if (!source.current) {
      return;
    }
    source.current.disconnect();
    manageQueueOnNextTrack();
  };

  const playPreviousTrack = () => {
    if (!source.current) {
      return;
    }
    source.current.disconnect();
    manageQueueOnPreviousTrack();
  };

  useEffect(() => {
    if (!source.current) {
      return;
    }
    if (source.current instanceof AudioBufferSourceNode) {
      source.current.onended = () => {
        manageQueueOnNextTrack();
      };
    }
  }, [manageQueueOnNextTrack, queue]);

  function playRadioStation(name: string, url: string) {
    setNowPlayingInfo({
      trackTitle: name,
      trackArtist: "",
      radioStation: true,
    });
    setRadioStationURL(url);
    setShowResumeQueue(true);
  }

  useEffect(() => {
    if (nowPlayingInfo?.radioStation) {
      radioStationAudio.current = null;
      audioCtx?.suspend();
      source.current?.disconnect();
      currentBuffer.current = null;
      source.current = null;
      playTrack();
    }
  }, [nowPlayingInfo, audioCtx]);

  function switchFromRadioToQueue() {
    setNowPlayingInfo({
      trackTitle: queue[0]?.title,
      trackArtist: queue[0]?.artist,
      radioStation: false,
    });
    setShowResumeQueue(false);
  }

  useEffect(() => {
    if (showResumeQueue === false) {
      setIsPlaying(true);

      playTrack();
    }
  }, [showResumeQueue]);

  function playBroadcast(title: string, author: string) {
    setNowPlayingInfo({
      trackTitle: title,
      trackArtist: author,
      radioStation: false,
    });
    setIsListeningToBroadcast(true);
  }

  function joinBroadcastRoom(broadcastRoomId: string) {
    setIsListeningToBroadcast(true);
    if (broadcastRoomId !== null && broadcastMediaSource.current !== null) {
      setBroadcastAudioURL(
        window.URL.createObjectURL(broadcastMediaSource.current),
      );
      const userSocketId = socket.id;
      socket.emit("join-broadcast-room", broadcastRoomId, userSocketId);
    }
  }

  useEffect(() => {
    socket.on("listen-to-current-broadcast", (listeningStream: ArrayBuffer) => {
      console.log("listen 0to current broadcast");
      const blobik = new Blob([listeningStream], {
        type: "audio/webm; codecs=opus",
      });
      console.log("blobik ", blobik);

      const url = URL.createObjectURL(blobik);
      const audio = new Audio(url);
      audio.play();
    });
    return () => {
      socket.off("listen-to-current-broadcast");
    };
  }, [broadcastAudioURL, broadcastChunksQueue]);

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        mediaStream.current = stream;
        setRecordingStream(
          new MediaRecorder(stream, { mimeType: "audio/webm" }),
        );
      });
  }

  useEffect(() => {
    if (recordingStream) {
      recordingStream.onstop = (e) => {
        console.log("recording stopped", e);
      };
      recordingStream.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.current.push(e.data);
          const broadcastRoom = broadcastSessionData?.room;
          console.log("ondataavailable");
          socket.emit("started-broadcast", e.data, broadcastRoom);
          recordingStream.start();
          setTimeout(() => {
            if (recordingStream.state === "recording") {
              recordingStream.stop();
            }
          }, 1000);
        }
      };
      recordingStream.start();
      setTimeout(() => {
        if (recordingStream.state === "recording") {
          recordingStream.stop();
        }
      }, 1000);
      setIsRecording(true);
    }
  }, [recordingStream, broadcastSessionData]);

  function stopRecording() {
    if (recordingStream) {
      recordingStream.ondataavailable = null;
      recordingStream.stop();
      mediaStream.current?.getTracks().forEach((track) => {
        track.stop();
      });
    }
    blob.current = new Blob(recordedChunks.current, {
      type: "audio/webm",
    });

    setRecordedAudioURL(window.URL.createObjectURL(blob.current));
  }
  return (
    <AudioPlayerContext.Provider
      value={{
        playTrack,
        stopTrack,
        trackId,
        setTrackId,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        queue,
        setQueue,
        playNextTrack,
        playPreviousTrack,
        source: source.current,
        nowPlayingInfo,
        setNowPlayingInfo,
        playRadioStation,
        customStationURL,
        setCustomStationURL,
        showResumeQueue,
        switchFromRadioToQueue,
        isListeningToBroadcast,
        setIsListeningToBroadcast,
        broadcastRoomId,
        setBroadcastRoomId,
        playBroadcast,
        joinBroadcastRoom,
        isRecording,
        setIsRecording,
        startRecording,
        stopRecording,
        broadcastSessionData,
        setBroadcastSessionData,
        recordedAudioURL,
        setRecordedAudioURL,
        broadcastAudioURL,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayerContext must be used within AudioContextProvider",
    );
  }
  return context;
}

export { AudioContextProvider, AudioPlayerContext };
