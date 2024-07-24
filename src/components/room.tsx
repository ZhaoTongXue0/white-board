"use client";

import {ReactNode} from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import {Loading} from "@/app/board/[boardId]/_components/loading";

interface RoomProps {
  children: ReactNode
  roomId: string
  fallback: NonNullable<ReactNode> | null
}

export function Room(
  {children, roomId, fallback}: RoomProps
) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_thLq_Y9un0XeMAnrmaml8qVO2gSRGFgjDEy4EROTFnTiAdD_ZhA_wNiY16uk77Rm"}>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loading/>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
