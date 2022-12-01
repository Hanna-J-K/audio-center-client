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
  ActionIcon,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import {
  socket,
  useAudio,
  IBroadcastRecordingData,
} from "../AudioPlayerContext";
import { v4 as uuidv4 } from "uuid";
import { IconRadio, IconUpload } from "@tabler/icons";

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
    marginLeft: theme.spacing.xl,
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
    recordedAudioURL,
    setRecordedAudioURL,
  } = useAudio();
  const [customBroadcasts, setCustomBroadcasts] = useState<
    IBroadcastRecordingData[] | null
  >(null);
  const [shouldShowUpload, setShouldShowUpload] = useState(false);
  const uploadedBroadcasts = useRef<any>();

  function prepareBroadcastSession() {
    setIsListeningToBroadcast(false);
    if (broadcastSessionData !== null) {
      const broadcastSessionRoomName =
        broadcastSessionData.title + "-" + broadcastSessionData.id.slice(0, 8);
      setBroadcastSessionData({
        ...broadcastSessionData,
        room: broadcastSessionRoomName,
      });
    }
  }

  useEffect(() => {
    socket.on("get-custom-broadcasts", (data: IBroadcastRecordingData[]) => {
      setCustomBroadcasts(data);

      if (customBroadcasts) {
        uploadedBroadcasts.current = customBroadcasts?.map((broadcast) => (
          <div key={broadcast.id} className={classes.item}>
            <div className={classes.title}>{broadcast.title}</div>
          </div>
        ));
      }
    });
    return () => {
      socket.off("get-custom-broadcasts");
    };
  });

  function handleFinishedBroadcast() {
    setShouldShowUpload(false);
    setRecordedAudioURL(null);
  }

  function uploadBroadcast() {
    if (recordedAudioURL) {
      const data = {
        id: broadcastSessionData?.id,
        title: broadcastSessionData?.title,
        artist: "Anonymous",
        url: recordedAudioURL,
      };
      socket.emit("upload-custom-broadcast", data);
      setRecordedAudioURL(null);
    }
  }

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
        value={broadcastRoomId !== null ? broadcastRoomId : ""}
        onChange={(event) => setBroadcastRoomId(event.currentTarget.value)}
      />
      <Center>
        <Button
          type="button"
          className={classes.button}
          size="md"
          onClick={() =>
            broadcastRoomId !== null ? joinBroadcastRoom(broadcastRoomId) : null
          }
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
            room: null,
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
            Your session room name: {broadcastSessionData?.room}
          </Text>
        </Center>
      )}
      <Center>
        <Card withBorder radius="md" className={classes.tile}>
          <Group position="apart">
            <Text className={classes.title}>Your Recorded Session</Text>
          </Group>
          {recordedAudioURL !== null ? (
            <SimpleGrid cols={3} mt="md">
              <Card withBorder radius="md" className={classes.tile}>
                <Group position="apart">
                  <UnstyledButton className={classes.item}>
                    <IconRadio size={36} />
                    <Text size="md" mt={7}>
                      {broadcastSessionData?.room}
                    </Text>
                    <audio controls={true} src={recordedAudioURL} />
                  </UnstyledButton>
                  <Center>
                    <Text className={classes.label}>
                      Do you want to upload this recording and make it public?
                    </Text>
                  </Center>
                  <Center>
                    <Button
                      type="button"
                      className={classes.button}
                      size="md"
                      onClick={() => setShouldShowUpload(true)}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      className={classes.button}
                      size="md"
                      onClick={handleFinishedBroadcast}
                    >
                      No
                    </Button>
                  </Center>
                  {shouldShowUpload ? (
                    <Center className={classes.tile}>
                      <ActionIcon
                        className={classes.item}
                        onClick={uploadBroadcast}
                      >
                        <IconUpload size={36} />
                      </ActionIcon>
                    </Center>
                  ) : null}
                </Group>
              </Card>
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
      <Card withBorder radius="md" className={classes.tile}>
        <Group position="apart">
          <Text className={classes.title}>Your Uploaded Sessions</Text>
        </Group>
      </Card>
      {uploadedBroadcasts !== null ? (
        <SimpleGrid>{uploadedBroadcasts.current}</SimpleGrid>
      ) : (
        <Text>You did not upload any recorded broadcasts yet.</Text>
      )}
    </>
  );
}
