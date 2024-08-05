"use client";

import {useState} from "react";

import {useHistory, useCanUndo, useCanRedo} from "@liveblocks/react";
import {CanvasMode, CanvasState} from "@/types/canvas";
import {useSelf} from "@liveblocks/react/suspense";

import {Toolbar} from "@/app/board/[boardId]/_components/toolbar";
import {Participants} from "@/app/board/[boardId]/_components/participants";
import {Info} from "@/app/board/[boardId]/_components/info";

interface CanvasProps {
  boardId: string;
}

export const Canvas = (
  {boardId}: CanvasProps
) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  })

  const history = useHistory();
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  const {name, picture} = useSelf((me) => me.info);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId}/>
      <Participants/>
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        redo={history.redo}
        undo={history.undo}
      />
    </main>
  )
}
