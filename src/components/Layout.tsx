import { AppShell } from "@mantine/core";
import React from "react";
import MenuBar from "./SideBar";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <AppShell navbar={<MenuBar />}>
      <div className="App">{children}</div>
    </AppShell>
  );
}
