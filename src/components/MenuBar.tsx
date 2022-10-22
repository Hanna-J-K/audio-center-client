import { Navbar, Stack, Text, Center, Header, Title } from "@mantine/core";
import React from "react";
import { SegmentedToggle } from "./SegmentedToggle";

export default function MenuBar() {
  return (
    <Navbar
      width={{ base: 300 }}
      height="100%"
      p="xs"
      styles={(theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.charcoal[8]
              : theme.colors.charcoal[4],
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.sandyBrown[8]
              : theme.colors.sandyBrown[1],
          borderWidth: 5,
          justifyContent: "space-evenly",
        },
      })}
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
