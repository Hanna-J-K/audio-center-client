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
    console.log(
      "ended: currentBuffer.current = null, queue length before slice: ",
      queue.length,
    );
    currentBuffer.current = null;
    const remaining = queue.slice(1);
    console.log("remaining length: ", remaining.length);
    if (remaining.length === 0) {
      console.log("ended, remaining length 0: setPlaying(false)");
      setPlaying(false);
    } else {
      console.log("ended, remaining length !==: setTrackId(remaining[0])");
      socket.emit("send-track-source", remaining[0]);
    }
    setQueue(remaining);
  }, [queue]);

  const playTrack = useCallback(() => {
    if (trackId === null) {
      return;
    }
    console.log("playTrack(): source.current = new AudioBufferSourceNode");
    source.current = new AudioBufferSourceNode(audioCtx);
    source.current.onended = () => {
      manageQueueOnEnded();
    };
    if (currentBuffer.current === null) {
      console.log(
        "playTrack(), currentBuffer.current === null: prepareAudio(), source.current.start(0), setPlaying(true)",
      );
      prepareAudio(trackId.source);
      source.current.start(0);
      setPlaying(true);
    } else {
      console.log(
        "playTrack(), currentBuffer.current !== null: source.current.buffer = currentBuffer.current)",
      );
      source.current.buffer = currentBuffer.current;
    }
    console.log("ostatnia instrukcja playTrack(): audioCtx.resume()");
    audioCtx.resume();
  }, [audioCtx, prepareAudio, manageQueueOnEnded, trackId]);

  const stopTrack = () => {
    if (currentBuffer.current != null) {
      console.log(
        "stopTrack(), currentBuffer.current != null: audioctx.suspend()",
      );
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
    console.log("to do playlisty");
  };

  useEffect(() => {
    console.log("osiwieję i kacper też");
    source.current.onended = () => {
      console.log("w środku onended");
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
