import React, { useEffect } from "react";
import { TrackList } from "../src/components/TrackList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { socket, useAudio } from "../src/components/AudioPlayerContext";
import type { ITrackPlaylistData } from ".";

export default function LibraryPage() {
  const { savedLibraryData } = useAudio();

  return (
    <>
      <TrackList data={savedLibraryData} />
      <PlayerFooter />
    </>
  );
}
