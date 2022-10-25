import type { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "light",
  colors: {
    charcoal: [
      "#264653",
      "#223f4b",
      "#1e3842",
      "#1b313a",
      "#172a32",
      "#13232a",
      "#0f1c21",
      "#0b1519",
      "#080e11",
      "#040708",
    ],
    persianGreen: [
      "#2a9d8f",
      "#268d81",
      "#227e72",
      "#1d6e64",
      "#195e56",
      "#154f48",
      "#113f39",
      "#0d2f2b",
      "#081f1d",
      "#04100e",
    ],
    sandyBrown: [
      "#f4a261",
      "#dc9257",
      "#c3824e",
      "#ab7144",
      "#92613a",
      "#7a5131",
      "#624127",
      "#49311d",
      "#312013",
      "#18100a",
    ],
    burntSienna: [
      "#e76f51",
      "#d06449",
      "#b95941",
      "#a24e39",
      "#8b4331",
      "#743829",
      "#5c2c20",
      "#452118",
      "#2e1610",
      "#170b08",
    ],
  },
  primaryColor: "charcoal",
  globalStyles: (theme) => ({
    body: {
      ...theme.fn.fontStyles(),
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.charcoal[4]
          : theme.colors.charcoal[0],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.persianGreen[2]
          : theme.colors.persianGreen[0],
      lineHeight: theme.lineHeight,
    },
    th: {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.persianGreen[2]
          : theme.colors.persianGreen[0],
    },
  }),
};
