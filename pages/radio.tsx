import React from "react";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { ProgramTiles } from "../src/components/ProgramTiles";
import { RadioStationBrowser } from "../src/components/Radio/RadioStationBrowser";
export default function radio() {
  return (
    <>
      <ProgramTiles />
      <RadioStationBrowser />
      <PlayerFooter />
    </>
  );
}
