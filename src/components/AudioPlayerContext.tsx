import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useLibrary } from "./Playlist/LibraryList";

export interface ITrackPlaylistData {
  id: string;
  title: string;
  artist: string;
  album: string;
}

interface INowPlayingInfo {
  trackTitle: string;
  trackArtist: string;
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
  const { library, mutate } = useLibrary();

  const source = useRef<AudioBufferSourceNode | null>(null);
  const currentBuffer = useRef<AudioBuffer | null>(null);
  // const source = useMemo(() => new AudioBufferSourceNode(audioCtx), [audioCtx]);

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
      socket.emit("send-track-source", remaining[0]);
    }
    setQueue(remaining);
  }, [queue]);

  const manageQueueOnPrevious = useCallback(() => {
    currentBuffer.current = null;
    if (trackId) {
      const currentTrack = library?.filter(
        (track) => track.id === trackId.id,
      )[0];
      if (currentTrack) {
        const previousTrack = library[library.indexOf(currentTrack) - 1];
        const rewoundQueue = [previousTrack, ...queue.splice(0)];
        socket.emit("send-track-source", previousTrack);
        setQueue(rewoundQueue);
      }
    }
  }, [queue, library, trackId]);

  const playTrack = useCallback(() => {
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
  }, [audioCtx, prepareAudio, manageQueueOnEnded, trackId]);

  const stopTrack = () => {
    if (currentBuffer.current != null && audioCtx != null) {
      audioCtx.suspend();
    }
  };

  useEffect(() => {
    console.log("use effect: play track: ", queue);
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
    console.log("play previous track");
    console.log("queue length", queue.length);
    //TODO: handle errors, cleanup, separate functions
    if (!source.current) {
      return;
    }
    source.current.disconnect();
    if (queue.length === 1) {
      console.log("play previous track: queue length === 1");
      manageQueueOnEnded();
    } else {
      console.log("play previous track: queue length !== 1");
      manageQueueOnPrevious();
    }
  };

  useEffect(() => {
    console.log("use effect: on ended: ", queue);
    if (!source.current) {
      return;
    }
    source.current.onended = () => {
      console.log("on ended");
      manageQueueOnEnded();
    };
  }, [manageQueueOnEnded, queue]);

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
