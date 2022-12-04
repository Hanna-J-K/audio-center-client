import { forwardRef } from "react";
import {
  Group,
  Text,
  MantineColor,
  SelectItemProps,
  Autocomplete,
  createStyles,
} from "@mantine/core";
import React from "react";
import { useAudio } from "../AudioPlayerContext";
import { socket } from "../AudioPlayerContext";

const useStyles = createStyles((theme) => ({
  dropdown: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.charcoal[6]
        : theme.colors.charcoal[4],
    borderWidth: 1,
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[1],
    justifyContent: "space-evenly",
  },

  item: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.sandyBrown[6]
        : theme.colors.sandyBrown[1],
    fontSize: theme.fontSizes.md,
    fontWeight: 600,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.persianGreen[6]
          : theme.colors.persianGreen[4],
    },
  },

  root: {
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: 40,
  },

  input: {
    marginBottom: theme.spacing.xl,
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
          ? theme.colors.charcoal[8]
          : theme.colors.charcoal[0],
      opacity: 0.65,
    },
  },
}));

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  artist: string;
}

interface SearchTrackBarProps {
  data: { id: string; title: string; artist: string; album: string }[];
}

export function SearchTracksBar({ data }: SearchTrackBarProps) {
  const { classes } = useStyles();
  const { trackId } = useAudio();

  const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ artist, value, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Text>{value}</Text>
            <Text size="xs" color="dimmed">
              {artist}
            </Text>
          </div>
        </Group>
      </div>
    ),
  );

  AutoCompleteItem.displayName = "AutoCompleteItem";

  const searchData = data.map((item) => ({ ...item, value: item.title }));
  return (
    <Autocomplete
      classNames={{
        dropdown: classes.dropdown,
        item: classes.item,
        input: classes.input,
        root: classes.root,
      }}
      placeholder="Search for more music..."
      itemComponent={AutoCompleteItem}
      data={searchData}
      filter={(value, item) =>
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.artist.toLowerCase().includes(value.toLowerCase().trim())
      }
      onItemSubmit={(item) => {
        if (trackId === null) {
          socket.emit("send-track-source", item);
        }
        socket.emit("search-for-track", item);
      }}
      nothingFound="There seems to be nothing here matching your search..."
    />
  );
}
