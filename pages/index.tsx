import React, { useEffect, useState } from "react";
import { SearchBar } from "../src/components/SearchBar";
import { TrackList } from "../src/components/TrackList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { socket } from "../src/components/AudioPlayerContext";
import { useAudio } from "../src/components/AudioPlayerContext";

interface ITrackPlaylistData {
  id: string;
  title: string;
  artist: string;
  album: string;
}

export default function IndexPage() {
  const { setAudioSource, queue, setQueue, trackId, setTrackId, source } =
    useAudio();
  const [searchTrackData, setSearchTrackData] = useState<
    Array<ITrackPlaylistData>
  >([]);
  const [trackPlaylistData, setTrackPlaylistData] = useState<
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
      setTrackPlaylistData((prev) => [...prev, data]);
    });
    socket.on(
      "send-song",
      ({
        trackArray,
        trackFilename,
        id,
      }: {
        trackArray: ArrayBuffer;
        trackFilename: string;
        id: string;
      }) => {
        setAudioSource(trackArray);
        setQueue([...queue, id]);
      },
    );

    return () => {
      socket.off("send-track-list");
      socket.off("send-track-info");
      socket.off("send-song");
    };
  }, [setAudioSource, queue, setQueue]);

  return (
    <div>
      <SearchBar data={searchTrackData} />
      <TrackList data={trackPlaylistData} />
      <PlayerFooter />
    </div>
  );
}
