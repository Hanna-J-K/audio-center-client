import { Center, Text, createStyles } from "@mantine/core";
import React from "react";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { ProgramTiles } from "../src/components/ProgramTiles";
import { RadioStationBrowser } from "../src/components/Radio/RadioStationBrowser";

const useStyles = createStyles(() => ({
  pageTitle: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 50,
    textTransform: "uppercase",
    fontWeight: 700,
  },
}));
export default function RadioPage() {
  const { classes } = useStyles();
  return (
    <>
      <Center>
        <Text className={classes.pageTitle}>Online Radio Stations </Text>
      </Center>
      <ProgramTiles />
      <RadioStationBrowser />
      <PlayerFooter />
    </>
  );
}
