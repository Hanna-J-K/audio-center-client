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

interface IAudioPlayerContext {
  setAudioSource: (audio: ArrayBuffer) => void;
  playTrack: () => void;
  stopTrack: () => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  queue: string[];
  setQueue: (queue: string[]) => void;
  trackId: string;
  setTrackId: (id: string) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  source: AudioBufferSourceNode;
}

const AudioPlayerContext = createContext<IAudioPlayerContext | undefined>(
  undefined,
);
export const socket = io("http://localhost:3000");

const AudioContextProvider = ({ children }: any) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [audioSource, setAudioSource] = useState<ArrayBuffer>(
    new ArrayBuffer(0),
  );
  const [volume, setVolume] = useState(1);
  const [trackId, setTrackId] = useState<string>("");
  const audioCtx = useMemo(() => new AudioContext(), []);
  const [playing, setPlaying] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  // const source = useMemo(() => new AudioBufferSourceNode(audioCtx), [audioCtx]);
  const source = useRef(new AudioBufferSourceNode(audioCtx));
  const currentBuffer = useRef<AudioBuffer | null>(null);
  const gainNode = useMemo(() => new GainNode(audioCtx), [audioCtx]);

  useEffect(() => {
    currentBuffer.current = null;
    setPlaying(false);
    audioCtx.resume();
    return () => {
      source.current.disconnect();
    };
  }, [audioSource, audioCtx]);

  useEffect(() => {
    gainNode.gain.value = volume;
  }, [volume, gainNode.gain]);

  const prepareAudio = useCallback(() => {
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
  }, [audioSource, audioCtx]);

  const playTrack = useCallback(() => {
    source.current = new AudioBufferSourceNode(audioCtx);
    source.current.onended = () => {
      console.log("ended");
      currentBuffer.current = null;
      setPlaying(false);
    };
    if (currentBuffer.current === null) {
      console.log("currentBuffer.current === null");
      prepareAudio();
      source.current.start(0);
    } else {
      console.log("currentBuffer.current = currenbuffercurentl");
      source.current.buffer = currentBuffer.current;
    }

    audioCtx.resume();
  }, [audioCtx, source, prepareAudio]);

  const stopTrack = () => {
    if (hasStarted) {
      audioCtx.suspend();
    }
  };

  const playNextTrack = () => {
    if (queue.length < 2) {
      setTrackId(queue[0]);
    } else if (queue.indexOf(trackId) === queue.length - 1) {
      setTrackId(queue[0]);
    } else {
      setTrackId(queue[queue.indexOf(trackId) - 1]);
    }
    playTrack();
  };

  const playPreviousTrack = () => {
    if (queue.length < 2) {
      setTrackId(queue[0]);
    } else if (queue.indexOf(trackId) === 0) {
      setTrackId(queue[queue.length - 1]);
    } else {
      setTrackId(queue[queue.indexOf(trackId) - 1]);
    }
    playTrack();
  };

  useEffect(() => {
    if (currentBuffer.current != null || queue.length === 0) {
      return;
    }

    console.log("wywolalem sie");
    setTrackId(queue[0]);
    setQueue(queue.slice(1));
    playTrack();
  }, [queue, playTrack]);

  return (
    <AudioPlayerContext.Provider
      value={{
        playTrack,
        stopTrack,
        setAudioSource,
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
