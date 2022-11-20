import { createStyles, TextInput, Center, Button } from "@mantine/core";
import React from "react";
import { useAudio } from "../AudioPlayerContext";

const useStyles = createStyles((theme) => ({
  label: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[6]
        : theme.colors.persianGreen[0],
    fontSize: theme.fontSizes.xl,
    fontWeight: 600,
    marginBottom: theme.spacing.xs,
  },

  root: {
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "5%",
  },

  input: {
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[1],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[8]
        : theme.colors.charcoal[1],
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[8]
        : theme.colors.charcoal[2],
    borderWidth: 2,
    fontWeight: 700,
    fontSize: theme.fontSizes.md,
    "&::placeholder": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.persianGreen[8]
          : theme.colors.persianGreen[5],
      opacity: 0.6,
    },
  },

  button: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[5]
        : theme.colors.sandyBrown[1],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[6]
        : theme.colors.charcoal[3],
    borderRadius: theme.radius.lg,
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.sandyBrown[4]
          : theme.colors.sandyBrown[0],
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.charcoal[8]
          : theme.colors.charcoal[4],
      border: "none",
    },
    minWidth: "15%",
    marginBottom: theme.spacing.xl,
    textTransform: "uppercase",
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: theme.radius.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[8]
        : theme.colors.sandyBrown[0],
    height: 90,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[6]
        : theme.colors.persianGreen[2],
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: `${theme.shadows.md} !important`,
      transform: "scale(1.05)",
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[1],
    textTransform: "uppercase",
  },

  tile: {
    border: `5px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[6]
        : theme.colors.charcoal[4]
    }`,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[6]
        : theme.colors.charcoal[4],
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSizes.xl,
    minWidth: "80%",
  },
}));

export function BroadcastPanel() {
  const { classes } = useStyles();
  const { broadcastRoomId, setBroadcastRoomId, joinBroadcastRoom } = useAudio();
  return (
    <>
      <TextInput
        classNames={{
          input: classes.input,
          label: classes.label,
          root: classes.root,
        }}
        label="Or you can join an active room!"
        placeholder="Paste broadcast room ID here"
        value={broadcastRoomId}
        onChange={(event) => setBroadcastRoomId(event.currentTarget.value)}
      />
      <Center>
        <Button
          type="button"
          className={classes.button}
          size="md"
          onClick={() => joinBroadcastRoom(broadcastRoomId)}
        >
          Join broadcast
        </Button>
      </Center>
    </>
  );
}
