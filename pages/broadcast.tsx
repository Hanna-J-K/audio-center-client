import React from "react";
import { BroadcastPanel } from "../src/components/Broadcast/BroadcastPanel";
import { BroadcastFooter } from "../src/components/Player/BroadcastFooter";
import { useAudio } from "../src/components/Context/AudioPlayerContext";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { Center, Text, createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  pageTitle: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 50,
    textTransform: "uppercase",
    fontWeight: 700,
  },
}));

export default function BroadcastPage() {
  const { classes } = useStyles();
  const { isListeningToBroadcast } = useAudio();
  return (
    <>
      <Center>
        <Text className={classes.pageTitle}>Your Live Broadcast</Text>
      </Center>
      <BroadcastPanel />
      {isListeningToBroadcast ? <PlayerFooter /> : <BroadcastFooter />}
    </>
  );
}
