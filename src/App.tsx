import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";
import "./App.css";
import { ContextProvider } from "./Context";
import { AppShell, MantineProvider, ColorSchemeProvider } from "@mantine/core";
import MenuBar from "./components/MenuBar";
import type { ColorScheme } from "@mantine/core";
import { theme } from "./theme";

const socket = io("http://localhost:3000");

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const [audioSource, setAudioSource] = useState<ArrayBuffer>(
    new ArrayBuffer(0)
  );
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [trackList, setTrackList] = useState<string[]>([]);

  const chooseTrack = (selectedTrack: any) => {
    socket.emit("play_music", { filename: selectedTrack });
    console.log("track emited");
  };

  useEffect(() => {
    socket.on("send-track-list", (trackListData) => {
      setTrackList(trackListData);
    });

    socket.on("play-song", (trackArray: ArrayBuffer) => {
      setAudioSource(trackArray);
      const blob = new Blob([trackArray], { type: "audio/mpeg" });

      setAudioUrl(window.URL.createObjectURL(blob));
    });
  }, [socket, audioSource, audioUrl]);

  return (
    <ContextProvider>
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
          <AppShell navbar={<MenuBar />}>
            <div className="App"></div>
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </ContextProvider>
  );
}

export default App;
