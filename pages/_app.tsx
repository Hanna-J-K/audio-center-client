import { useState } from "react";
import React from "react";
import "../styles/App.css";
import "../styles/index.css";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { theme } from "../styles/theme";
import { AppProps } from "next/app";
import Layout from "../src/components/Layout";
import dynamic from "next/dynamic";

function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const DynamicContextProvider = dynamic(
    () => import("../src/Context").then((mod) => mod.ContextProvider),
    {
      ssr: false,
    },
  );

  return (
    <DynamicContextProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withCSSVariables
          withGlobalStyles
          withNormalizeCSS
          theme={{ ...theme, colorScheme }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </DynamicContextProvider>
  );
}

export default App;
