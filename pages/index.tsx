import React, { useEffect, useState, useContext } from "react";
import { SearchBar, useTrackContext } from "../src/components/SearchBar";
import { TrackList } from "../src/components/TrackList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { io } from "socket.io-client";

let socket;
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

interface ITrackPlaylistData {
  title: string;
  artist: string;
  album: string;
}

export default function index() {
  const [searchTrackData, setSearchTrackData] = useState(trackListData);
  const [trackPlaylistData, setTrackPlaylistData] = useState<
    Array<ITrackPlaylistData>
  >([]);

  useEffect(() => {
    socket = io("http://localhost:3000");
    console.log("csa");
    console.log("agshioew");
    socket.emit("get-track-list");
    socket.on("send-track-list", (data) => {
      setSearchTrackData(data);
    });
    console.log("halo");
    socket.on("send-track-info", (data) => {
      setTrackPlaylistData((prev) => [...prev, data]);
    });

    return () => {
      socket.off("send-track-list");
      socket.off("send-track-info");
    };
  }, []);

  return (
    <div>
      <SearchBar data={searchTrackData} />
      <TrackList data={trackPlaylistData} />
      <PlayerFooter />
    </div>
  );
}
