import {
  Navbar,
  Stack,
  Text,
  Center,
  Header,
  Title,
  createStyles,
  Group,
  ActionIcon,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import { IconFolder, IconRadio, IconBroadcast } from "@tabler/icons";

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
  links: {
    marginLeft: theme.spacing.xl,
    marginRight: theme.spacing.xl,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[0],

    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.sandyBrown[6]
          : theme.colors.sandyBrown[2],
      textDecoration: "none",
    },
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[5]
        : theme.colors.sandyBrown[0],
    marginRight: 0,
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.sandyBrown[6]
          : theme.colors.sandyBrown[2],
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
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
          <Link href="/" passHref>
            <Anchor component="a" className={classes.links}>
              <Group className={classes.links} position="left">
                <ActionIcon className={classes.icon} size={36}>
                  <IconFolder size={48} />
                </ActionIcon>
                <Title>Catalogue</Title>
              </Group>
            </Anchor>
          </Link>
        </Navbar.Section>
        <Navbar.Section my="xl">
          <Link href="/radio" passHref>
            <Anchor component="a" className={classes.links}>
              <Group className={classes.links} position="left">
                <ActionIcon className={classes.icon} size={36}>
                  <IconRadio size={48} />
                </ActionIcon>
                <Title>Radio</Title>
              </Group>
            </Anchor>
          </Link>
        </Navbar.Section>
        <Navbar.Section my="xl">
          <Link href="/broadcast" passHref>
            <Anchor component="a" className={classes.links}>
              <Group className={classes.links} position="left">
                <ActionIcon className={classes.icon} size={36}>
                  <IconBroadcast size={48} />
                </ActionIcon>
                <Title>Broadcast</Title>
              </Group>
            </Anchor>
          </Link>
        </Navbar.Section>
      </Stack>
    </Navbar>
  );
}
