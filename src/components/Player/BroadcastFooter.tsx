import {
  createStyles,
  ActionIcon,
  Footer,
  Center,
  Grid,
  Title,
  Container,
} from "@mantine/core";
import {
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconMusic,
  IconPlayerRecord,
  IconPlayerStop,
  IconMicrophone,
  IconMicrophoneOff,
} from "@tabler/icons";
import React, { useState } from "react";

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
  const [recording, setRecording] = useState(false);
  const [muted, setMuted] = useState(false);

  return (
    <Footer className={classes.footer} height={125}>
      <Grid style={{ justifyItems: "center" }}>
        <Grid.Col span={4} style={{ justifyItems: "center" }}>
          <Center>
            <Container>
              <ActionIcon className={classes.icon} size={36}>
                <IconMusic size={48} />
              </ActionIcon>
              <Title className={classes.track} order={2}>
                Track
              </Title>
              <Title className={classes.track} order={2}>
                Artist
              </Title>
            </Container>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <ActionIcon disabled={true} className={classes.controls} size={72}>
              <IconPlayerSkipBack size={48} />
            </ActionIcon>
            <ActionIcon
              onClick={() => setRecording(!recording)}
              className={classes.controls}
              size={72}
            >
              {recording ? (
                <IconPlayerStop size={48} />
              ) : (
                <IconPlayerRecord size={48} />
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
