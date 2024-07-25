"use client";

import {Info} from "@/app/board/[boardId]/_components/info";
import {Participants} from "@/app/board/[boardId]/_components/participants";
import {Toolbar} from "@/app/board/[boardId]/_components/toolbar";
import {useSelf} from "@liveblocks/react/suspense";

interface CanvasProps {
  boardId: string;
}

export const Canvas = (
  {boardId}: CanvasProps
) => {
  const {name,picture} = useSelf((me) => me.info);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info/>
      <Participants/>
      <Toolbar/>
    </main>
  )
}
