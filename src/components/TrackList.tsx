import { useState } from "react";
import { createStyles, Table, ScrollArea, Text } from "@mantine/core";
import React from "react";

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

  scrolled: {
    // boxShadow: theme.shadows.sm,
  },

  scrollArea: {
    marginTop: theme.spacing.xl,
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
  },
}));

interface TableScrollAreaProps {
  data: { title: string; artist: string; album: string }[];
}

export function TrackList({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row) => (
    <tr key={row.title} className={classes.tableRow}>
      <td>{row.title}</td>
      <td>{row.artist}</td>
      <td>{row.album}</td>
    </tr>
  ));

  return (
    <ScrollArea
      sx={{ height: "100%" }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      className={classes.scrollArea}
    >
      <Table
        sx={{ minWidth: 700 }}
        verticalSpacing="sm"
        fontSize="md"
        horizontalSpacing="xs"
        className={classes.table}
        highlightOnHover
      >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>
              <Text sx={{ color: "blue " }}>Title</Text>
            </th>
            <th>Artist</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
