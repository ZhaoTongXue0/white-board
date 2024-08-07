"use client";

import {useCallback, useState} from "react";

import {useHistory, useCanUndo, useCanRedo, useMutation, useSelf, useStorage} from "@liveblocks/react/suspense";
import {Camera, CanvasMode, CanvasState, Color, LayerType, Point} from "@/types/canvas";
import {LiveObject} from "@liveblocks/core";

import {Toolbar} from "@/app/board/[boardId]/_components/toolbar";
import {Participants} from "@/app/board/[boardId]/_components/participants";
import {Info} from "@/app/board/[boardId]/_components/info";
import {CursorsPresence} from "@/app/board/[boardId]/_components/cursors-presence";
import {pointerEventToCanvasPoint} from "@/lib/utils";
import {nanoid} from "nanoid";
import {LayerPreview} from "@/app/board/[boardId]/_components/layer-preview";

// 限制最大图层数量 = 100
const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({boardId}: CanvasProps) => {

  const layerIds = useStorage((root) => root.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  })
  // 画布相机
  const [camera, setCamera] = useState<Camera>({x: 0, y: 0})
  // 默认黑色
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  })
  const history = useHistory();
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  // 插入图层
  const inserLayer = useMutation((
    {storage, setMyPresence},
    LayerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    position: Point,
  ) => {
    const liveLayers = storage.get("layers");

    // 图层数量上限
    if (liveLayers.size >= MAX_LAYERS) return

    // 生成新的图层、新图层ID、光标的当前位置信息
    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject({
      type: LayerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: lastUsedColor,
    })

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    // 激活撤销按钮的功能
    setMyPresence({selection: [layerId]}, {addToHistory: true});

    // 重制为选择工具
    setCanvasState({mode: CanvasMode.None});
  }, [lastUsedColor]);

  // 点击屏幕的up事件
  const opPointerUp = useMutation(({}, e) => {
    const point = pointerEventToCanvasPoint(e, camera);

    // 判断画板的状态是否为插入状态
    if (canvasState.mode === CanvasMode.Inserting) {
      inserLayer(canvasState.layerType, point);
    } else {
      setCanvasState({mode: CanvasMode.None});
    }

    history.resume();

  }, [camera, canvasState, history, inserLayer]);

  // 光标坐标
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, []);

  // 用户光标移动
  const onPointerMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e, camera);
    setMyPresence({cursor: current});
  }, []);

  // 用户光标离开标签页
  const onPointerLeave = useMutation(({setMyPresence}) => {
    setMyPresence({cursor: null});
  }, []);

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
        onPointerUp={opPointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px,${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointDown={() => {
              }}
              selectionColor="#000"
            />
          ))}
          <CursorsPresence/>
        </g>
      </svg>
    </main>
  )
}
