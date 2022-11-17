import React, { useEffect, useState } from "react";
import { SearchBar } from "../src/components/SearchBar";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { socket } from "../src/components/AudioPlayerContext";
import { useAudio } from "../src/components/AudioPlayerContext";
import type { ITrack } from "../src/components/AudioPlayerContext";
import { QueueList } from "../src/components/Playlist/QueueList";
import type { ITrackPlaylistData } from "../src/components/AudioPlayerContext";

export default function IndexPage() {
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
      <SearchBar data={searchTrackData} />
      <QueueList queueListData={queue} />
      <PlayerFooter />
    </div>
  );
}
