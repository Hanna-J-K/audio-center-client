import React, { useEffect, useState } from "react";
import { SearchBar } from "../src/components/SearchBar";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { socket } from "../src/components/AudioPlayerContext";
import { useAudio } from "../src/components/AudioPlayerContext";
import type { ITrack } from "../src/components/AudioPlayerContext";
import { QueueList } from "../src/components/Tracklist/QueueList";
import type { ITrackPlaylistData } from "../src/components/AudioPlayerContext";
import { Center, Text, createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  pageTitle: {
    marginTop: 25,
    fontSize: 50,
    textTransform: "uppercase",
    fontWeight: 700,
  },
}));

export default function IndexPage() {
  const { classes } = useStyles();
  const { queue, setQueue, setTrackId } = useAudio();
  const [searchTrackData, setSearchTrackData] = useState<
    Array<ITrackPlaylistData>
  >([]);

  useEffect(() => {
    socket.emit("get-track-list");
  }, []);

  useEffect(() => {
    socket.on("send-track-list", (data) => {
      setSearchTrackData(data);
    });
    socket.on("send-track-info", (data) => {
      setQueue([...queue, data]);
    });

    socket.on("send-track", (track: ITrack) => {
      console.log("czyzby");
      console.log("track", track);
      setTrackId(track);
    });

    return () => {
      socket.off("send-track-list");
      socket.off("send-track-info");
      socket.off("send-track-to-queue");
      socket.off("send-track-source");
    };
  }, [queue, setQueue, setTrackId]);

  return (
    <div>
      <Center>
        <Text className={classes.pageTitle}>Music Queue</Text>
      </Center>
      <SearchBar data={searchTrackData} />
      <QueueList queueListData={queue} />
      <PlayerFooter />
    </div>
  );
}
