import {
  Navbar,
  Stack,
  Text,
  Center,
  Header,
  Title,
  createStyles,
} from "@mantine/core";
import React from "react";
import { SegmentedToggle } from "./SegmentedToggle";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[6]
        : theme.colors.charcoal[4],
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[1],
    borderWidth: 5,
    justifyContent: "space-evenly",
  },
}));

export default function MenuBar() {
  const { classes } = useStyles();
  return (
    <Navbar
      className={classes.navbar}
      width={{ base: 300 }}
      height="100%"
      p="xs"
    >
      {/* <SegmentedToggle /> */}
      <Stack>
        <Navbar.Section my="xl">
          <Center>
            <Title>Catalogue</Title>
          </Center>
        </Navbar.Section>
        <Navbar.Section my="xl">
          <Center>
            <Title>Radio</Title>
          </Center>
        </Navbar.Section>
        <Navbar.Section my="xl">
          <Center>
            <Title>Broadcast</Title>
          </Center>
        </Navbar.Section>
      </Stack>
    </Navbar>
  );
}
