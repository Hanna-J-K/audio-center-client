import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";
import "./App.css";
import { ContextProvider } from "./Context";
import { AppShell, MantineProvider, ColorSchemeProvider } from "@mantine/core";
import MenuBar from "./components/MenuBar";
import type { ColorScheme } from "@mantine/core";
import { theme } from "./theme";
import { PlayerFooter } from "./components/PlayerFooter";
import { SearchBar } from "./components/SearchBar";
import { TrackList } from "./components/TrackList";

const socket = io("http://localhost:3000");

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const [audioSource, setAudioSource] = useState<ArrayBuffer>(
    new ArrayBuffer(0),
  );
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [trackList, setTrackList] = useState<string[]>([]);

  const chooseTrack = (selectedTrack: any) => {
    socket.emit("play_music", { filename: selectedTrack });
    console.log("track emited");
  };

  const trackListData = [
    { title: "Track 1", artist: "Artist 1", album: "Album 1" },
    { title: "Track 2", artist: "Artist 2", album: "Album 2" },
    { title: "Track 3", artist: "Artist 3", album: "Album 3" },
    { title: "Track 4", artist: "Artist 4", album: "Album 4" },
    { title: "Track 5", artist: "Artist 5", album: "Album 5" },
    { title: "Track 6", artist: "Artist 6", album: "Album 6" },
    { title: "Track 7", artist: "Artist 7", album: "Album 7" },
    { title: "Track 8", artist: "Artist 8", album: "Album 8" },
    { title: "Track 9", artist: "Artist 9", album: "Album 9" },
    { title: "Track 10", artist: "Artist 10", album: "Album 10" },
    { title: "Track 11", artist: "Artist 11", album: "Album 11" },
    { title: "Track 12", artist: "Artist 12", album: "Album 12" },
    { title: "Track 13", artist: "Artist 13", album: "Album 13" },
    { title: "Track 14", artist: "Artist 14", album: "Album 14" },
    { title: "Track 15", artist: "Artist 15", album: "Album 15" },
    { title: "Track 16", artist: "Artist 16", album: "Album 16" },
    { title: "Track 17", artist: "Artist 17", album: "Album 17" },
    { title: "Track 18", artist: "Artist 18", album: "Album 18" },
    { title: "Track 19", artist: "Artist 19", album: "Album 19" },
    { title: "Track 20", artist: "Artist 20", album: "Album 20" },
    { title: "Track 21", artist: "Artist 21", album: "Album 21" },
  ];

  const searchTrackData = [
    { title: "Cry For Me", artist: "Twice", album: "Cry For Me" },
    {
      title: "Dance The Night Away",
      artist: "Twice",
      album: "Dance The Night Away",
    },
    { title: "Feel Special", artist: "Twice", album: "Feel Special" },
    { title: "Fancy", artist: "Twice", album: "Fancy" },
    { title: "Heart Shaker", artist: "Twice", album: "Heart Shaker" },
    { title: "Likey", artist: "Twice", album: "Likey" },
    { title: "Like Ooh-Ahh", artist: "Twice", album: "Like Ooh-Ahh" },
    { title: "Signal", artist: "Twice", album: "Signal" },
    { title: "TT", artist: "Twice", album: "TT" },
    { title: "What Is Love", artist: "Twice", album: "What Is Love" },
    { title: "Yes Or Yes", artist: "Twice", album: "Yes Or Yes" },
    { title: "Cheer Up", artist: "Twice", album: "Cheer Up" },
    { title: "Knock Knock", artist: "Twice", album: "Knock Knock" },
    { title: "Merry & Happy", artist: "Twice", album: "Merry & Happy" },
    { title: "One More Time", artist: "Twice", album: "One More Time" },
    { title: "OOH-AHH하게", artist: "Twice", album: "OOH-AHH하게" },
    { title: "SIGNAL", artist: "Twice", album: "SIGNAL" },
    { title: "TT", artist: "Twice", album: "TT" },
    { title: "What Is Love", artist: "Twice", album: "What Is Love" },
    { title: "Yes Or Yes", artist: "Twice", album: "Yes Or Yes" },
    { title: "DDU-DU-DDU-DU", artist: "Blackpink", album: "Square Uo" },
    { title: "Kill This Love", artist: "Blackpink", album: "Kill This Love" },
    {
      title: "How You Like That",
      artist: "Blackpink",
      album: "How You Like That",
    },
    { title: "Ice Cream", artist: "Blackpink", album: "Ice Cream" },
    { title: "Icy", artist: "ITZY", album: "Icy" },
    { title: "ICY", artist: "ITZY", album: "ICY" },
    { title: "Dalla Dalla", artist: "ITZY", album: "Dalla Dalla" },
    { title: "Not Shy", artist: "ITZY", album: "Not Shy" },
    { title: "Wannabe", artist: "ITZY", album: "Wannabe" },
    { title: "HIP", artist: "Mamamoo", album: "HIP" },
    { title: "Egotistic", artist: "Mamamoo", album: "Egotistic" },
    { title: "Starry Night", artist: "Mamamoo", album: "Starry Night" },
    { title: "Wind Flower", artist: "Mamamoo", album: "Wind Flower" },
  ];

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
          <AppShell navbar={<MenuBar />} footer={<PlayerFooter />}>
            <div className="App">
              <SearchBar data={searchTrackData} />
              <TrackList data={trackListData} />
            </div>
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </ContextProvider>
  );
}

export default App;
