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
  ScrollArea,
  Title,
  Paper,
  Container,
  Stack,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import {
  socket,
  useAudio,
  IBroadcastRecordingData,
  API_URL,
} from "../Context/AudioPlayerContext";
import { v4 as uuidv4 } from "uuid";
import { IconBroadcast, IconRadio } from "@tabler/icons";
import { Session } from "@supabase/supabase-js";
import useSWR from "swr";
import { useSession } from "@supabase/auth-helpers-react";

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
    padding: theme.spacing.md,

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

const fetcher = (url: string, accessToken: string) =>
  fetch(url, { headers: { Authorization: "Bearer " + accessToken } }).then(
    (res) => res.json(),
  );

export function useLiveBroadcasts(session: Session | null) {
  const { data, mutate } = useSWR<Array<any>>(
    [API_URL + "/broadcast", session?.access_token],
    fetcher,
  );
  return {
    rooms: data,
    mutate: mutate,
  };
}

export function BroadcastPanel() {
  const { classes } = useStyles();
  const session = useSession();
  const { rooms, mutate } = useLiveBroadcasts(session);
  const {
    joinBroadcastRoom,
    broadcastSessionData,
    setBroadcastSessionData,
    isListeningToBroadcast,
    setIsListeningToBroadcast,
    recordedAudioURL,
  } = useAudio();
  const [customBroadcasts, setCustomBroadcasts] = useState<
    IBroadcastRecordingData[] | null
  >(null);
  const [broadcastTitle, setBroadcastTitle] = useState<string>("");
  const [broadcastDescription, setBroadcastDescription] = useState<string>("");
  const [broadcastAuthorNick, setBroadcastAuthorNick] = useState<string>("");

  const uploadedBroadcasts = useRef<any[]>([]);

  async function prepareBroadcastSession() {
    setIsListeningToBroadcast(false);
    const broadcastId = uuidv4();

    const broadcastSessionRoomName =
      broadcastTitle + "-" + broadcastId.slice(0, 8);
    setBroadcastSessionData({
      id: broadcastId,
      title: broadcastTitle,
      author: broadcastAuthorNick,
      description: broadcastDescription,
      room: broadcastSessionRoomName,
    });
    console.log("broadcastSessionData", broadcastSessionData);
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

  const liveSessions = rooms?.map((room) => {
    return (
      <UnstyledButton
        key={room.room}
        className={classes.item}
        onClick={() =>
          joinBroadcastRoom(
            room.title,
            room.author,
            room.description,
            room.room,
          )
        }
      >
        <IconBroadcast size={36} />
        <Text size="md" mt={7}>
          {room.title}
        </Text>
        <Text size="md">{room.author}</Text>
        <Text size="xs">{room.description}</Text>
      </UnstyledButton>
    );
  });

  return (
    <>
      <Center>
        <ScrollArea style={{ height: 250 }}>
          {" "}
          <Title>Current Live Broadcasting Sessions</Title>
          {liveSessions?.length !== 0 ? (
            <Container>
              <Text>
                Click on one of the room IDs below to join the live broadcasting
                session!
              </Text>
              {liveSessions}
            </Container>
          ) : (
            <Title order={2}>There are no live sessions right now.</Title>
          )}
        </ScrollArea>
      </Center>
      {/* <TextInput
        classNames={{
          input: classes.input,
          label: classes.label,
          root: classes.root,
        }}
        label="Join a live broadcast by entering room ID!"
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
      </Center> */}
      <Stack>
        <TextInput
          classNames={{
            input: classes.input,
            label: classes.label,
            root: classes.root,
          }}
          placeholder="Enter broadcast session title here"
          value={broadcastSessionData?.title}
          onChange={(event) => setBroadcastTitle(event.currentTarget.value)}
        />
        <TextInput
          classNames={{
            input: classes.input,
            label: classes.label,
            root: classes.root,
          }}
          placeholder="Enter your nickname here"
          value={broadcastSessionData?.author}
          onChange={(event) =>
            setBroadcastAuthorNick(event.currentTarget.value)
          }
        />
        <TextInput
          classNames={{
            input: classes.input,
            label: classes.label,
            root: classes.root,
          }}
          placeholder="Enter short broadcast description here"
          value={broadcastSessionData?.title}
          onChange={(event) =>
            setBroadcastDescription(event.currentTarget.value)
          }
        />
      </Stack>
      <Center>
        <Button
          type="button"
          className={classes.button}
          size="md"
          onClick={prepareBroadcastSession}
        >
          Generate broadcast session
        </Button>
      </Center>
      {isListeningToBroadcast ? null : (
        <Center>
          <Text className={classes.label}>Your session room name</Text>
          <Text>{broadcastSessionData?.room}</Text>
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
                </Group>
              </Card>
            </SimpleGrid>
          ) : (
            <Center>
              <Text className={classes.label}>
                {" "}
                {`
              No recordings in this session yet. Record your session by entering a session name and generating a room name!
              `}
              </Text>
            </Center>
          )}
        </Card>
      </Center>
    </>
  );
}
