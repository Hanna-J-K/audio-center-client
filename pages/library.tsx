import React from "react";
import { LibraryList } from "../src/components/Playlist/LibraryList";
import { PlayerFooter } from "../src/components/Player/PlayerFooter";
import { Center, Text, createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  pageTitle: {
    marginTop: 25,
    fontSize: 50,
    textTransform: "uppercase",
    fontWeight: 700,
  },
}));

export default function LibraryPage() {
  const { classes } = useStyles();
  return (
    <>
      <Center>
        <Text className={classes.pageTitle}>Your Music Library</Text>
      </Center>
      <LibraryList />
      <PlayerFooter />
    </>
  );
}
