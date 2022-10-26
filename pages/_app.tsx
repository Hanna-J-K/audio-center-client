import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";
import "../styles/App.css";
import "../styles/index.css";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { theme } from "../styles/theme";
import { AppProps } from "next/app";
import Layout from "../src/components/Layout";
import dynamic from "next/dynamic";

// const socket = io("http://localhost:3000");

function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const [audioSource, setAudioSource] = useState<ArrayBuffer>(
    new ArrayBuffer(0),
  );
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [trackList, setTrackList] = useState<string[]>([]);

  // const chooseTrack = (selectedTrack: any) => {
  //   socket.emit("play_music", { filename: selectedTrack });
  //   console.log("track emited");
  // };

  // useEffect(() => {
  //   socket.on("send-track-list", (trackListData) => {
  //     setTrackList(trackListData);
  //   });

  //   socket.on("play-song", (trackArray: ArrayBuffer) => {
  //     setAudioSource(trackArray);
  //     const blob = new Blob([trackArray], { type: "audio/mpeg" });

  //     setAudioUrl(window.URL.createObjectURL(blob));
  //   });
  // }, [socket, audioSource, audioUrl]);

  const DynamicContextProvider = dynamic(
    () => import("../src/Context").then((mod) => mod.ContextProvider),
    {
      ssr: false,
    },
  );

  return (
    <DynamicContextProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withCSSVariables
          withGlobalStyles
          withNormalizeCSS
          theme={{ ...theme, colorScheme }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </DynamicContextProvider>
  );
}

export default App;
