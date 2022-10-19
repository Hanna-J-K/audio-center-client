import { useEffect, useState } from "react";
import React from "react";
import { io } from "socket.io-client";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import TrackSelect from "./components/TrackSelect";
import VideoPlayer from "./components/VideoPlayer";
import Sidebar from "./components/Sidebar";
import Notifications from "./components/Notifications";
import { ContextProvider } from "./Context";
import {
  Grid,
  Title,
  Center,
  Button,
  Text,
  Spoiler,
  Stack,
  Divider,
} from "@mantine/core";
import RadioPlayer from "./components/RadioPlayer";

const socket = io("http://localhost:3000");

function App() {
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
      <div className="App">
        <Grid grow gutter="lg" justify="space-around">
          <Grid.Col span={4}>
            <Title order={2}>Music Player</Title>
            <Stack>
              <TrackSelect chooseTrack={chooseTrack} trackList={trackList} />

              <AudioPlayer audioSource={audioSource} audioUrl={audioUrl} />
              <RadioPlayer />
            </Stack>
          </Grid.Col>

          <Divider size="lg" orientation="vertical" />

          <Grid.Col span={4}>
            <Title order={2}>Podcasts</Title>
            <Stack>
              <VideoPlayer />
              <Spoiler
                maxHeight={120}
                showLabel="Show more"
                hideLabel="Hide"
                transitionDuration={0}
              >
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Spoiler>
              <Button
                variant="gradient"
                gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
              >
                Listen Now
              </Button>
            </Stack>
            {/* <Sidebar>
            <Notifications />
          </Sidebar> */}
          </Grid.Col>

          <Grid.Col span={4}>
            <Stack>
              <audio id="audio" controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Stack>
            {/* <Title order={2}>Radio Stations</Title>
          <RadioPlayer /> */}
          </Grid.Col>
        </Grid>
      </div>
    </ContextProvider>
  );
}

export default App;
