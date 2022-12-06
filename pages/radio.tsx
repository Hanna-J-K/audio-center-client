import { Center, Text, createStyles } from "@mantine/core";
import React from "react";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { RadioTiles } from "../src/components/Radio/RadioTiles";
import { RadioStationBrowser } from "../src/components/Radio/RadioStationPanel";

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
      <RadioTiles />
      <RadioStationBrowser />
      <PlayerFooter />
    </>
  );
}
