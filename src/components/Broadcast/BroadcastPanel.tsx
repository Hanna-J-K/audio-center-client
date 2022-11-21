import {
  createStyles,
  TextInput,
  Center,
  Button,
  Group,
  Text,
  UnstyledButton,
  SimpleGrid,
  Card,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { socket, useAudio, IBroadcastSessionData } from "../AudioPlayerContext";
import { v4 as uuidv4 } from "uuid";
import { IconRadio } from "@tabler/icons";

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
  const {
    broadcastRoomId,
    setBroadcastRoomId,
    joinBroadcastRoom,
    broadcastSessionData,
    setBroadcastSessionData,
    isListeningToBroadcast,
    setIsListeningToBroadcast,
    playBroadcast,
    setTemporaryBroadcastURL,
    temporaryBroadcastURL,
  } = useAudio();
  const [broadcastRoomName, setBroadcastRoomName] = useState("");
  const [customBroadcasts, setCustomBroadcasts] = useState<
    IBroadcastSessionData[] | null
  >(null);
  const [audioElement, setAudioElement] = useState<boolean>(false);

  function prepareBroadcastSession() {
    setIsListeningToBroadcast(false);
    setBroadcastRoomName(
      broadcastSessionData?.title + "-" + broadcastSessionData?.id.slice(0, 8),
    );
    socket.emit("create-user-broadcast-room", broadcastRoomName);
  }

  const recordedBroadcasts = customBroadcasts?.map((broadcast) => (
    <>
      <UnstyledButton key={broadcast.id} className={classes.item}>
        <IconRadio size={36} />
        <Text size="md" mt={7}>
          {broadcast.title}
        </Text>
        <audio controls={true} src={broadcast.url} />
      </UnstyledButton>
    </>
  ));

  useEffect(() => {
    socket.on("get-custom-broadcasts", (data: IBroadcastSessionData[]) => {
      console.log("halo");
      console.log(data);
      setCustomBroadcasts(data);
    });
    return () => {
      socket.off("get-custom-broadcasts");
    };
  });

  useEffect(() => {
    setAudioElement(true);
    console.log("audio element", temporaryBroadcastURL);
  }, [setTemporaryBroadcastURL, temporaryBroadcastURL]);
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
      <TextInput
        classNames={{
          input: classes.input,
          label: classes.label,
          root: classes.root,
        }}
        label="Start recording by entering session name and generating room name!"
        placeholder="Enter broadcast session name here"
        value={broadcastSessionData?.title}
        onChange={(event) =>
          setBroadcastSessionData({
            id: uuidv4(),
            title: event.currentTarget.value,
            author: "Anonymous",
          })
        }
      />
      <Center>
        <Button
          type="button"
          className={classes.button}
          size="md"
          onClick={prepareBroadcastSession}
        >
          Generate room name
        </Button>
      </Center>
      {isListeningToBroadcast ? null : (
        <Center>
          <Text className={classes.label}>
            Your session room name: {broadcastRoomName}
          </Text>
        </Center>
      )}
      <Center>
        <Card withBorder radius="md" className={classes.tile}>
          <Group position="apart">
            <Text className={classes.title}>Your Recorded Sessions</Text>
          </Group>
          {audioElement ? (
            <SimpleGrid cols={3} mt="md">
              <audio src={temporaryBroadcastURL} controls={true} />
            </SimpleGrid>
          ) : (
            <Center>
              <Text className={classes.label}>
                {" "}
                {`
              No recorder sessions yet. Record your first session by entering a session name and generating a room name!
              `}
              </Text>
            </Center>
          )}
        </Card>
      </Center>
    </>
  );
}
