import { Paper, ScrollArea, Text, Title } from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";
import { socket } from "../Context/AudioPlayerContext";

export default function LiveBroadcastingSessions() {
  const [broadcastingSessions, setBroadcastingSessions] =
    useState<Array<string>>();

  useEffect(() => {
    socket.on("publish-broadcast-session-room", (data) => {
      setBroadcastingSessions([...(broadcastingSessions as []), data]);
    });
    return () => {
      socket.off("publish-broadcast-session-room");
    };
  }, [broadcastingSessions]);

  const liveSessions = broadcastingSessions?.map((session) => {
    return (
      <Paper shadow="xs" p="md" key={session}>
        <Text>Room ID: {session}</Text>
      </Paper>
    );
  });
  return (
    <ScrollArea style={{ height: 250 }}>
      {" "}
      <Title>Current Live Broadcasting Sessions</Title>
      {liveSessions}
    </ScrollArea>
  );
}
