import {
  Card,
  createStyles,
  Group,
  SimpleGrid,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { IRadioStationData, useAudio } from "./AudioPlayerContext";
import useSWR from "swr";
import { IconRadio } from "@tabler/icons";
import { socket } from "./AudioPlayerContext";

const PRIMARY_COL_HEIGHT = 300;

const useStyles = createStyles((theme) => ({
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
  },

  grid: {
    marginTop: "5%",
  },

  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[6]
        : theme.colors.persianGreen[0],
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
}));

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRadioStation() {
  const { data, mutate } = useSWR<Array<IRadioStationData>>(
    "http://localhost:3000/radio",
    fetcher,
  );
  return {
    stations: data,
    mutate: mutate,
  };
}

export function ProgramTiles() {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

  const { stations, mutate } = useRadioStation();
  const { playRadioStation } = useAudio();

  const recommendedStations = stations?.map((station) => (
    <UnstyledButton
      key={station.id}
      className={classes.item}
      onClick={() => playRadioStation(station.name, station.url)}
    >
      <IconRadio size={36} />
      <Text size="md" mt={7}>
        {station.name}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.tile}>
      <Group position="apart">
        <Text className={classes.title}>Recommended Stations</Text>
      </Group>
      <SimpleGrid cols={3} mt="md">
        {recommendedStations}
      </SimpleGrid>
    </Card>
  );
}
