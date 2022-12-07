import {
  createStyles,
  ActionIcon,
  Footer,
  Center,
  Grid,
  Title,
} from "@mantine/core";
import {
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconPlayerRecord,
  IconPlayerStop,
  IconMicrophone,
  IconMicrophoneOff,
  IconBroadcast,
  IconBroadcastOff,
} from "@tabler/icons";
import React, { useState } from "react";
import { useAudio } from "../Context/AudioPlayerContext";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[5]
        : theme.colors.persianGreen[1],
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTop: `2px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[8]
        : theme.colors.charcoal[4]
    }`,
  },

  controls: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[5]
        : theme.colors.sandyBrown[0],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[8]
        : theme.colors.charcoal[0],
    margin: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.sandyBrown[4]
          : theme.colors.sandyBrown[0],
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.charcoal[6]
          : theme.colors.charcoal[3],
      border: "none",
    },
    "&:disabled": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.charcoal[8]
          : theme.colors.charcoal[1],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.gray[8]
          : theme.colors.gray[7],
      border: "none",
    },
  },
  track: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[8]
        : theme.colors.charcoal[0],
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.sandyBrown[4]
          : theme.colors.sandyBrown[0],
    },
  },
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[5]
        : theme.colors.sandyBrown[0],
    marginRight: 0,
    "&:hover": {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
  },
}));

export function BroadcastFooter() {
  const { classes } = useStyles();
  const [muted, setMuted] = useState(false);
  const { startRecording, stopRecording, isRecording, setIsRecording } =
    useAudio();

  return (
    <Footer className={classes.footer} height={125}>
      <Grid align="center">
        <Grid.Col span={4}>
          <Center>
            {isRecording ? (
              <Grid align="center">
                <Grid.Col span="auto">
                  <ActionIcon className={classes.icon} size={36}>
                    <IconBroadcast size={48} />
                  </ActionIcon>
                </Grid.Col>
                <Grid.Col span="content">
                  <Title className={classes.track} order={2}>
                    Broadcast is on!
                  </Title>
                </Grid.Col>
              </Grid>
            ) : (
              <Grid align="center">
                <Grid.Col span="auto">
                  <ActionIcon className={classes.icon} size={36}>
                    <IconBroadcastOff size={48} />
                  </ActionIcon>
                </Grid.Col>
                <Grid.Col span="content">
                  <Title className={classes.track} order={2}>
                    You are not broadcasting
                  </Title>
                </Grid.Col>
              </Grid>
            )}
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <ActionIcon disabled={true} className={classes.controls} size={72}>
              <IconPlayerSkipBack size={48} />
            </ActionIcon>
            <ActionIcon
              onClick={() => setIsRecording(!isRecording)}
              className={classes.controls}
              size={72}
            >
              {isRecording ? (
                <IconPlayerStop size={48} onClick={stopRecording} />
              ) : (
                <IconPlayerRecord size={48} onClick={startRecording} />
              )}
            </ActionIcon>
            <ActionIcon disabled={true} className={classes.controls} size={72}>
              <IconPlayerSkipForward size={48} />
            </ActionIcon>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <ActionIcon
              onClick={() => setMuted(!muted)}
              className={classes.controls}
              size={72}
            >
              {muted ? (
                <IconMicrophone size={48} />
              ) : (
                <IconMicrophoneOff size={48} />
              )}
            </ActionIcon>
          </Center>
        </Grid.Col>
      </Grid>
    </Footer>
  );
}
