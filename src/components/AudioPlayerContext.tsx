import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";

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
  name: string;
  url: string;
}

interface IAudioPlayerContext {
  playTrack: () => void;
  stopTrack: () => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  queue: ITrackPlaylistData[];
  setQueue: (queue: ITrackPlaylistData[]) => void;
  trackId: ITrack | null;
  setTrackId: (trackId: ITrack | null) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  source: AudioBufferSourceNode | null;
  nowPlayingInfo: INowPlayingInfo | null;
  setNowPlayingInfo: (nowPlayingInfo: INowPlayingInfo | null) => void;
  playRadioStation: (name: string, url: string) => void;
}

const AudioPlayerContext = createContext<IAudioPlayerContext | undefined>(
  undefined,
);
export const socket = io("http://localhost:3000");

export interface ITrack {
  id: string;
  source: ArrayBuffer;
}

const AudioContextProvider = ({ children }: any) => {
  const [volume, setVolume] = useState(1);
  const [trackId, setTrackId] = useState<ITrack | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  // const audioCtx = useMemo(() => new AudioContext(), []);
  const [playing, setPlaying] = useState(false);
  const [queue, setQueue] = useState<ITrackPlaylistData[]>([]);
  const [nowPlayingInfo, setNowPlayingInfo] = useState<INowPlayingInfo | null>(
    null,
  );
  const [trackHistory, setTrackHistory] = useState<ITrackPlaylistData[]>([]);
  const [radioStationURL, setRadioStationURL] = useState<string>();
  const radioStationAudio = useRef<HTMLAudioElement | null>(null);

  const source = useRef<AudioBufferSourceNode | null>(null);
  const currentBuffer = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    if (!window) {
      return;
    }
    const newAudioCtx = new AudioContext();
    setAudioCtx(newAudioCtx);
    source.current = new AudioBufferSourceNode(newAudioCtx);
  }, []);

  const prepareAudio = useCallback(
    (audioSource: ArrayBuffer) => {
      if (!audioCtx) {
        return;
      }
      audioCtx.decodeAudioData(
        audioSource.slice(0),
        (buffer) => {
          if (!source.current) {
            return;
          }
          console.log("buffer", buffer);
          currentBuffer.current = buffer;
          source.current.buffer = buffer;

          source.current.connect(audioCtx.destination);
          source.current.loop = false;
        },
        (e) => {
          `Error with decoding audio data ${e}`;
        },
      );
    },
    [audioCtx],
  );

  const manageQueueOnEnded = useCallback(() => {
    currentBuffer.current = null;
    const remaining = queue.slice(1);
    if (remaining.length === 0) {
      setPlaying(false);
    } else {
      const finishedTrack = queue[0];
      setTrackHistory((prev) => [...prev, finishedTrack]);
      socket.emit("send-track-source", remaining[0]);
    }
    setQueue(remaining);
  }, [queue]);

  const manageQueueOnPrevious = useCallback(() => {
    currentBuffer.current = null;
    if (trackHistory.length === 0) {
      setPlaying(false);
    } else {
      socket.emit("send-track-source", trackHistory[trackHistory.length - 1]);
      setQueue((prev) => [trackHistory[trackHistory.length - 1], ...prev]);
      setTrackHistory((prev) => prev.slice(0, prev.length - 1));
    }
  }, [trackHistory]);

  const playTrack = useCallback(() => {
    console.log(radioStationAudio.current);
    if (nowPlayingInfo?.radioStation) {
      if (radioStationAudio.current !== null) {
        radioStationAudio.current.play();
        setPlaying(true);
      } else {
        const audio = new Audio(radioStationURL);
        radioStationAudio.current = audio;
        radioStationAudio.current.play();
        setPlaying(true);
      }
      return;
    }
    if (trackId === null || audioCtx === null) {
      return;
    }
    socket.emit("get-now-playing-info", trackId.id);
    source.current = new AudioBufferSourceNode(audioCtx);
    source.current.onended = () => {
      manageQueueOnEnded();
    };
    if (currentBuffer.current === null) {
      prepareAudio(trackId.source);
      source.current.start(0);
      setPlaying(true);
    } else {
      source.current.buffer = currentBuffer.current;
    }
    audioCtx.resume();
  }, [
    audioCtx,
    prepareAudio,
    manageQueueOnEnded,
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
      setPlaying(false);
    }
  };

  useEffect(() => {
    playTrack();
  }, [trackId]);

  const playNextTrack = () => {
    if (!source.current) {
      return;
    }
    source.current.disconnect();
    manageQueueOnEnded();
  };

  const playPreviousTrack = () => {
    if (!source.current) {
      return;
    }
    source.current.disconnect();
    manageQueueOnPrevious();
  };

  useEffect(() => {
    if (!source.current) {
      return;
    }
    source.current.onended = () => {
      manageQueueOnEnded();
    };
  }, [manageQueueOnEnded, queue]);

  function playRadioStation(name: string, url: string) {
    if (radioStationAudio.current?.src) {
      radioStationAudio.current.pause();
      radioStationAudio.current.src = "";
    }
    radioStationAudio.current = null;
    setNowPlayingInfo({
      trackTitle: name,
      trackArtist: "",
      radioStation: true,
    });
    setRadioStationURL(url);
    playTrack();
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        playTrack,
        stopTrack,
        trackId,
        setTrackId,
        playing,
        setPlaying,
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
