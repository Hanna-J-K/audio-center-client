import {
  createStyles,
  ActionIcon,
  Footer,
  Center,
  Grid,
  Title,
  Container,
  Slider,
} from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconVolume,
  IconVolumeOff,
  IconMusic,
} from "@tabler/icons";
import React, { useState } from "react";
import { useAudio } from "../AudioPlayerContext";

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
  volumeSlider: {
    width: 100,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[5]
        : theme.colors.sandyBrown[0],
  },
}));

export function PlayerFooter() {
  const { classes } = useStyles();
  const [muted, setMuted] = useState(false);
  const {
    playTrack,
    stopTrack,
    playing,
    setPlaying,
    setVolume,
    volume,
    playNextTrack,
    playPreviousTrack,
  } = useAudio();

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
            <ActionIcon className={classes.controls} size={72}>
              <IconPlayerSkipBack onClick={playPreviousTrack} size={48} />
            </ActionIcon>
            <ActionIcon
              onClick={() => setPlaying(!playing)}
              className={classes.controls}
              size={72}
            >
              {playing ? (
                <IconPlayerPause onClick={stopTrack} size={48} />
              ) : (
                <IconPlayerPlay onClick={playTrack} size={48} />
              )}
            </ActionIcon>
            <ActionIcon className={classes.controls} size={72}>
              <IconPlayerSkipForward onClick={playNextTrack} size={48} />
            </ActionIcon>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <ActionIcon
              onClick={() => {
                setMuted(!muted);
                if (muted) {
                  setVolume(0);
                } else {
                  setVolume(volume);
                }
              }}
              className={classes.controls}
              size={72}
            >
              {muted ? <IconVolumeOff size={48} /> : <IconVolume size={48} />}
            </ActionIcon>
            <Slider
              defaultValue={volume}
              min={0}
              max={2}
              step={0.01}
              className={classes.volumeSlider}
              onChange={(value) => setVolume(value)}
            />
          </Center>
        </Grid.Col>
      </Grid>
    </Footer>
  );
}
