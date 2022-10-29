import { AppShell } from "@mantine/core";
import React from "react";
import { AudioContextProvider } from "./AudioPlayerContext";
import MenuBar from "./MenuBar";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <AppShell navbar={<MenuBar />}>
      <AudioContextProvider>
        <div className="App">{children}</div>
      </AudioContextProvider>
    </AppShell>
  );
}
