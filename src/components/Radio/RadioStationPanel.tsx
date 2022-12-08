import React, { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Center,
  createStyles,
  TextInput,
  UnstyledButton,
  Text,
  Card,
  Group,
  SimpleGrid,
} from "@mantine/core";
import {
  IRadioStationData,
  socket,
  useAudio,
} from "../Context/AudioPlayerContext";
import { IconRadio } from "@tabler/icons";
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

const addCustomRadioStation = (url: string, accessToken: string) => {
  socket.emit("add-custom-radio-station", { url, accessToken });
};

export function RadioStationBrowser() {
  const { classes } = useStyles();
  const { customStationURL, setCustomStationURL, playRadioStation } =
    useAudio();
  const [customRadioStations, setCustomRadioStations] = useState<
    IRadioStationData[] | null
  >(null);
  const session = useSession();

  const customStations = customRadioStations?.map((station) => (
    <UnstyledButton
      key={station.id}
      className={classes.item}
      onClick={() => playRadioStation(station.title, station.url)}
    >
      <IconRadio size={36} />
      <Text size="md" mt={7}>
        {station.title}
      </Text>
    </UnstyledButton>
  ));

  useEffect(() => {
    socket.on("get-custom-radio-stations", (data: IRadioStationData[]) => {
      setCustomRadioStations(data);
    });
    return () => {
      socket.off("get-custom-radio-stations");
    };
  }, [setCustomRadioStations]);
  return (
    <>
      <TextInput
        classNames={{
          input: classes.input,
          label: classes.label,
          root: classes.root,
        }}
        label="Or you can add your own online radio station!"
        placeholder="Paste a link to radio station here"
        value={customStationURL ? customStationURL : ""}
        onChange={(event) => setCustomStationURL(event.currentTarget.value)}
      />
      <Center>
        <Button
          type="button"
          className={classes.button}
          size="md"
          onClick={() => {
            if (customStationURL !== null) {
              addCustomRadioStation(
                customStationURL,
                session?.access_token || "",
              );
            }
          }}
        >
          Add station
        </Button>
      </Center>

      <Center>
        <Card withBorder radius="md" className={classes.tile}>
          <Group position="apart">
            <Text className={classes.title}>Custom Radio Stations</Text>
          </Group>
          {customRadioStations !== null ? (
            <SimpleGrid cols={3} mt="md">
              {customStations}
            </SimpleGrid>
          ) : (
            <Center>
              <Text className={classes.label}>
                {" "}
                {`
              No custom radio stations added yet.
              Paste a link to a station above!
              `}
              </Text>
            </Center>
          )}
        </Card>
      </Center>
    </>
  );
}
