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

const useStyles = createStyles((theme) => ({
  searchBar: {
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

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  artist: string;
}

interface SearchBarProps {
  data: { title: string; artist: string; album: string }[];
}

export function SearchBar({ data }: SearchBarProps) {
  const { classes } = useStyles();

  // eslint-disable-next-line react/display-name
  const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ artist, value, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group className={classes.searchBar} noWrap>
          <div>
            <Text>{value}</Text>
            <Text size="xs" color="dimmed">
              {artist}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  const searchData = data.map((item) => ({ ...item, value: item.title }));
  return (
    <Autocomplete
      className={classes.searchBar}
      label="Choose employee of the month"
      placeholder="Pick one"
      itemComponent={AutoCompleteItem}
      data={searchData}
      filter={(value, item) =>
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.artist.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
}
