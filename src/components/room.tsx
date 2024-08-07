"use client";

import {ReactNode} from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import {Loading} from "@/components/auth/loading";

interface RoomProps {
  children: ReactNode
  roomId: string
  fallback: NonNullable<ReactNode> | null
}

export function Room(
  {children, roomId, fallback}: RoomProps
) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
      <RoomProvider id={roomId} initialPresence={{cursor: null}}>
        <ClientSideSuspense fallback={<Loading/>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
