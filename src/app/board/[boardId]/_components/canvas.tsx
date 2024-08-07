"use client";

import {useCallback, useState} from "react";

import {useHistory, useCanUndo, useCanRedo, useMutation} from "@liveblocks/react";
import {Camera, CanvasMode, CanvasState} from "@/types/canvas";
import {useSelf} from "@liveblocks/react/suspense";

import {Toolbar} from "@/app/board/[boardId]/_components/toolbar";
import {Participants} from "@/app/board/[boardId]/_components/participants";
import {Info} from "@/app/board/[boardId]/_components/info";
import {CursorsPresence} from "@/app/board/[boardId]/_components/cursors-presence";
import {pointEventToCanvasPoint} from "@/lib/utils";

interface CanvasProps {
  boardId: string;
}

export const Canvas = (
  {boardId}: CanvasProps
) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  })

  const [camera, setCamera] = useState<Camera>({x: 0, y: 0})

  const history = useHistory();
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, []);

  // 用户光标移动
  const onPointerMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointEventToCanvasPoint(e, camera);
    setMyPresence({cursor: current});
  }, []);

  // 用户光标离开标签页
  const onPointerLeave = useMutation(({setMyPresence}) => {
    setMyPresence({cursor: null});
  },[]);

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
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorsPresence/>
        </g>
      </svg>
    </main>
  )
}
