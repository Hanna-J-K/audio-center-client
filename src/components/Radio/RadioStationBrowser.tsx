import React from "react";
import { useState } from "react";
import { createStyles, TextInput } from "@mantine/core";
import useSWR from "swr";
import type { IRadioStationData } from "../AudioPlayerContext";

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

  label: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.persianGreen[6]
        : theme.colors.persianGreen[0],
    fontSize: theme.fontSizes.xl,
    fontWeight: 600,
  },

  root: {
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "5%",
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

export function RadioStationBrowser() {
  const [value, setValue] = useState("");
  const { classes } = useStyles();
  return (
    <TextInput
      classNames={{
        input: classes.input,
        label: classes.label,
        root: classes.root,
      }}
      label="Or you can add your own online radio station!"
      placeholder="Paste a link to radio station here"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}
