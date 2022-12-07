import {
  Card,
  createStyles,
  Group,
  SimpleGrid,
  UnstyledButton,
  Text,
  Center,
} from "@mantine/core";
import React from "react";
import { IRadioStationData, useAudio } from "../Context/AudioPlayerContext";
import useSWR from "swr";
import { IconRadio } from "@tabler/icons";
import { API_URL } from "../Context/AudioPlayerContext";

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
    minWidth: "80%",
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
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[1],
    fontSize: theme.fontSizes.xl,
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
}));

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRadioStation() {
  const { data, mutate } = useSWR<Array<IRadioStationData>>(
    API_URL + "/radio",
    fetcher,
  );
  return {
    stations: data,
    mutate: mutate,
  };
}

export function RadioTiles() {
  const { classes } = useStyles();

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
    <Center>
      <Card withBorder radius="md" className={classes.tile}>
        <Group position="apart">
          <Text className={classes.title}>Recommended Stations</Text>
        </Group>
        <SimpleGrid cols={3} mt="md">
          {recommendedStations}
        </SimpleGrid>
      </Card>
    </Center>
  );
}
