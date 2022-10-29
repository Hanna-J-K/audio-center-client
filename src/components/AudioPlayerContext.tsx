import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Button, Autocomplete } from "@mantine/core";

interface IAudioPlayerContext {
  setAudioSource: (audio: ArrayBuffer) => void;
  setAudioUrl: (audio: string) => void;
  playTrackDisabled: boolean;
  setPlayTrackDisabled: (playTrackDisabled: boolean) => void;
  stopTrackDisabled: boolean;
  setStopTrackDisabled: (stopTrackDisabled: boolean) => void;
  playTrack: () => void;
  stopTrack: () => void;
}

const AudioPlayerContext = createContext<IAudioPlayerContext | undefined>(
  undefined,
);

interface IAudioPlayerProps {
  audioSource: ArrayBuffer;
  audioUrl: string;
}

const AudioContextProvider = ({ children }: any) => {
  const [playTrackDisabled, setPlayTrackDisabled] = useState<boolean>(false);
  const [stopTrackDisabled, setStopTrackDisabled] = useState<boolean>(true);
  const [audioSource, setAudioSource] = useState<ArrayBuffer>(
    new ArrayBuffer(0),
  );
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioCtx = useMemo(() => new AudioContext(), []);
  const source = useMemo(() => new AudioBufferSourceNode(audioCtx), [audioCtx]);
  const [value, setValue] = useState("");

  useEffect(() => {
    console.log("audioSource w kontekscie", audioSource);
  }, [audioSource]);

  const prepareAudio = useCallback(() => {
    const audioElement = document.querySelector("audio");

    let songLength;
    if (audioElement) {
      audioElement.src = audioUrl;
    }

    console.log("audioElement src", audioElement?.src);
    console.log("audioSource", audioSource);
    audioCtx.decodeAudioData(
      audioSource,
      (buffer) => {
        songLength = buffer.duration;
        source.buffer = buffer;

        source.connect(audioCtx.destination);
        source.loop = false;
      },
      (e) => {
        `Error with decoding audio data ${e}`;
      },
    );
  }, [audioSource, audioUrl, audioCtx, source]);

  const playTrack = () => {
    prepareAudio();
    source.start(0);
    setPlayTrackDisabled(true);
    setStopTrackDisabled(false);
  };

  const stopTrack = () => {
    source.stop(0);
    setPlayTrackDisabled(false);
    setStopTrackDisabled(true);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playTrackDisabled,
        setPlayTrackDisabled,
        stopTrackDisabled,
        setStopTrackDisabled,
        playTrack,
        stopTrack,
        setAudioSource,
        setAudioUrl,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return context;
}

export { AudioContextProvider, AudioPlayerContext };
