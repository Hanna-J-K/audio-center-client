import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  ActionIcon,
} from "@mantine/core";
import React from "react";
import { IconDeviceFloppy } from "@tabler/icons";
import { ITrackPlaylistData, socket } from "../AudioPlayerContext";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[0]
        : theme.colors.charcoal[4],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[8]
        : theme.colors.persianGreen[0],
    borderBottom: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[8]
        : theme.colors.persianGreen[0]
    }`,
    // transition: "box-shadow 150ms ease",

    "&::after": {
      // eslint-disable-next-line prettier/prettier, quotes
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.persianGreen[8]
          : theme.colors.persianGreen[0]
      }`,
    },
  },

  root: {
    "& thead tr th, & tfoot tr th": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
    },
  },
  scrolled: {
    // boxShadow: theme.shadows.sm,
  },

  scrollArea: {
    margin: "auto",
    marginTop: 75,
    height: "100%",
    maxWidth: "75%",
  },
  table: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[8]
        : theme.colors.sandyBrown[0],
  },

  tableRow: {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.charcoal[8]
          : theme.colors.charcoal[4],
    },
    borderBottom: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[8]
        : theme.colors.persianGreen[0]
    }`,
  },

  iconUnsaved: {
    color: theme.colors.sandyBrown[0],
    backgroundColor: "none",
    borderColor: theme.colors.sandyBrown[0],
    borderWidth: 1,
    "&:hover": {
      color: theme.colors.sandyBrown[3],
      backgroundColor: theme.colors.charcoal[4],
      borderColor: theme.colors.sandyBrown[3],
    },
  },

  iconSaved: {
    color: theme.colors.charcoal[4],
    backgroundColor: theme.colors.sandyBrown[0],
    "&:hover": {
      color: theme.colors.charcoal[4],
      backgroundColor: theme.colors.sandyBrown[3],
      borderColor: theme.colors.sandyBrown[3],
    },
  },
}));

const savedToLibrary = (id: string) => {
  socket.emit("save-to-library", id);
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLibrary() {
  const { data, mutate } = useSWR<Array<ITrackPlaylistData>>(
    "http://localhost:3000/library",
    fetcher,
  );
  return {
    library: data,
    mutate: mutate,
  };
}

export function LibraryList() {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const { library, mutate } = useLibrary();

  const rows = library?.map((row) => (
    <tr key={row.title} className={classes.tableRow}>
      <td style={{ borderBottom: "1px solid #2a9d8f" }}>{row.title}</td>
      <td style={{ borderBottom: "1px solid #2a9d8f" }}>{row.artist}</td>
      <td style={{ borderBottom: "1px solid #2a9d8f" }}>{row.album}</td>
      <td style={{ borderBottom: "1px solid #2a9d8f" }}>
        <ActionIcon
          onClick={() => savedToLibrary(row.id)}
          className={classes.iconSaved}
        >
          <IconDeviceFloppy />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      className={classes.scrollArea}
    >
      <Table
        verticalSpacing="md"
        fontSize="md"
        horizontalSpacing="xl"
        className={classes.table}
      >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th style={{ color: "#2a9d8f" }}>
              <Text>Title</Text>
            </th>
            <th style={{ color: "#2a9d8f" }}>Artist</th>
            <th style={{ color: "#2a9d8f" }}>Album</th>
            <th style={{ color: "#2a9d8f" }}></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
