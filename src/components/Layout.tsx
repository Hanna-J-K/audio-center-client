import { AppShell } from "@mantine/core";
import React from "react";
import MenuBar from "./MenuBar";
import { PlayerFooter } from "./Player/PlayerFooter";
import { useRouter } from "next/router";
import { BroadcastFooter } from "./Player/BroadcastFooter";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const { asPath } = useRouter();
  return (
    <AppShell navbar={<MenuBar />}>
      <div className="App">{children}</div>
    </AppShell>
  );
}
