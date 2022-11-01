import React from "react";
import { TrackList } from "../src/components/TrackList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";

const libraryData = [
  {
    id: "1",
    title: "The End",
    artist: "The Doors",
    album: "The Doors",
  },
  {
    id: "2",
    title: "The End",
    artist: "The Doors",
    album: "The Doors",
  },
];

export default function library() {
  return (
    <>
      <TrackList data={libraryData} />
      <PlayerFooter />
    </>
  );
}
