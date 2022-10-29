import React, { useEffect, useState, useContext } from "react";
import { SearchBar, useTrackContext } from "../src/components/SearchBar";
import { TrackList } from "../src/components/TrackList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { useAudio } from "../src/components/AudioPlayerContext";

const DynamicContextProvider = dynamic(
  () =>
    import("../src/components/AudioPlayerContext").then(
      (mod) => mod.AudioContextProvider,
    ),
  {
    ssr: false,
  },
);

interface ITrackPlaylistData {
  id: string;
  title: string;
  artist: string;
  album: string;
}

const socket = io("http://localhost:3000");

export default function IndexPage() {
  const { setAudioSource, setAudioUrl } = useAudio();
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

    socket.on("send-song", (...data) => {
      console.log("data", data);
      setAudioSource(data[0]);
      console.log("audioSource w sockecie");
      setAudioUrl(data[1]);
    });

    return () => {
      socket.off("send-track-list");
      socket.off("send-track-info");
      socket.off("send-song");
    };
  }, [setAudioSource, setAudioUrl]);

  return (
    <div>
      <SearchBar data={searchTrackData} />
      <TrackList data={trackPlaylistData} />
      <PlayerFooter />
    </div>
  );
}
