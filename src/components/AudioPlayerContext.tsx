import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useLibrary } from "./Playlist/LibraryList";

interface IAudioPlayerContext {
  playTrack: () => void;
  stopTrack: () => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  queue: string[];
  setQueue: (queue: string[]) => void;
  trackId: ITrack | null;
  setTrackId: (trackId: ITrack | null) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  source: AudioBufferSourceNode;
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
  const audioCtx = useMemo(() => new AudioContext(), []);
  const [playing, setPlaying] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const { library, mutate } = useLibrary();

  // const source = useMemo(() => new AudioBufferSourceNode(audioCtx), [audioCtx]);
  const source = useRef(new AudioBufferSourceNode(audioCtx));
  const currentBuffer = useRef<AudioBuffer | null>(null);
  const gainNode = useMemo(() => new GainNode(audioCtx), [audioCtx]);

  useEffect(() => {
    gainNode.gain.value = volume;
  }, [volume, gainNode.gain]);

  const prepareAudio = useCallback(
    (audioSource: ArrayBuffer) => {
      audioCtx.decodeAudioData(
        audioSource.slice(0),
        (buffer) => {
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
        const previousTrackId = library[library.indexOf(currentTrack) - 1].id;
        const rewoundQueue = [previousTrackId, ...queue.splice(0)];
        socket.emit("send-track-source", previousTrackId);
        setQueue(rewoundQueue);
      }
    }
  }, [queue, library, trackId]);

  const playTrack = useCallback(() => {
    if (trackId === null) {
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
    if (currentBuffer.current != null) {
      audioCtx.suspend();
    }
  };

  useEffect(() => {
    playTrack();
  }, [trackId]);

  const playNextTrack = () => {
    source.current.disconnect();
    manageQueueOnEnded();
  };

  const playPreviousTrack = () => {
    //TODO: handle errors, cleanup, separate functions
    source.current.disconnect();
    if (queue.length === 1) {
      manageQueueOnEnded();
    } else {
      manageQueueOnPrevious();
    }
  };

  useEffect(() => {
    source.current.onended = () => {
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
