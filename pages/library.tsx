import React from "react";
import { LibraryList } from "../src/components/Playlist/LibraryList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";

export default function LibraryPage() {
  return (
    <>
      <LibraryList />
      <PlayerFooter />
    </>
  );
}
