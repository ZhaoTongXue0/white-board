"use client";

import React, {useCallback, useMemo, useState} from "react";
import {useCanRedo, useCanUndo, useHistory, useMutation, useSelf, useStorage} from "@liveblocks/react/suspense";
import {useOthersMapped} from "@liveblocks/react";
import {LiveObject} from "@liveblocks/core";
import {nanoid} from "nanoid";

import {Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH} from "@/types/canvas";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle, penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds
} from "@/lib/utils";
import {Toolbar} from "@/app/board/[boardId]/_components/toolbar";
import {Participants} from "@/app/board/[boardId]/_components/participants";
import {Info} from "@/app/board/[boardId]/_components/info";
import {CursorsPresence} from "@/app/board/[boardId]/_components/cursors-presence";
import {LayerPreview} from "@/app/board/[boardId]/_components/_layer-preview-grap/layer-preview";
import {SelectionBox} from "@/app/board/[boardId]/_components/selection-box";
import {SelectionTools} from "@/app/board/[boardId]/_components/selection-tools";
import {Path} from "@/app/board/[boardId]/_components/_layer-preview-grap/path";

// 限制最大图层数量 = 100
const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({boardId}: CanvasProps) => {

  const layerIds = useStorage((root) => root.layerIds);

  const pencliDraft = useSelf((me) => me.presence.penCilDraft);

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

  /**
   * 插入图层
   * 读取lastUsedColor的默认值rgb：0,0,0
   */
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

  /**
   * 点按选择框任意一个点时触发
   * */
  const onResizeBoxPointDown = useCallback((
    corner: Side,
    initialBounds: XYWH,
  ) => {

    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner,
    })

  }, [history])

  const unSelectLayers = useMutation((
    {self, setMyPresence}
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({selection: []}, {addToHistory: true});
    }
  }, [])

  const updateSelectionNet = useMutation((
    {storage, setMyPresence},
    current: Point,
    origin: Point,
  ) => {
    const layers = storage.get("layers").toImmutable();
    setCanvasState({mode: CanvasMode.SelectionNet, origin, current});

    const ids = findIntersectingLayersWithRectangle(
      layerIds,
      layers,
      origin,
      current
    )

    setMyPresence({selection: ids});
  }, [layerIds]);

  /**
   * 多选图层
   * */
  const selectMultipleLayers = useCallback((
    current: Point,
    origin: Point,
  ) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      })
    }
  }, []);

  /**
   * 触发条件：选中的图层调整大小
   * */
  const resizeSelectedLayer = useMutation((
    {storage, self},
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Resizing) return;

    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point,
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if (layer) layer.update(bounds);
  }, [canvasState]);

  /**
   * 触发条件：选中的图层移动位置
   * */
  const TranslatingSelectedLayers = useMutation((
    {storage, self},
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Translating) return;

    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y
    };

    const liveLayers = storage.get("layers");

    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        })
      }
    }

    setCanvasState({mode: CanvasMode.Translating, current: point});
  }, [canvasState])

  const insertPath = useMutation((
    {storage, self, setMyPresence}
  ) => {
    const liveLayers = storage.get("layers");
    const {penCilDraft} = self.presence;

    if (
      penCilDraft == null ||
      penCilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({penCilDraft: null});
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(penPointsToPathLayer(
        penCilDraft,
        lastUsedColor,
      ))
    )

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({penCilDraft: null});
    setCanvasState({mode: CanvasMode.Pencil});
  }, [lastUsedColor])

  const startDrawing = useMutation((
    {setMyPresence},
    point: Point,
    pressure: number,
  ) => {
    setMyPresence({
      penCilDraft: [[point.x, point.y, pressure]],
      penColor: lastUsedColor,
    })
  }, [lastUsedColor]);

  const continueDrawing = useMutation((
    {self, setMyPresence},
    point: Point,
    e: React.PointerEvent
  ) => {
    const {penCilDraft} = self.presence;

    if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || penCilDraft == null) {
      return;
    }

    setMyPresence({
      cursor: point,
      penCilDraft:
        penCilDraft.length === 1 &&
        penCilDraft[0][0] === point.x &&
        penCilDraft[0][1] === point.y
          ? penCilDraft
          : [...penCilDraft, [point.x, point.y, e.pressure]],
    });
  }, [canvasState.mode]);

  /**
   * 用户移动选择框任意一个点时触发
   * */
  const onPointerMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Pressing) {
      selectMultipleLayers(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      TranslatingSelectedLayers(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e);
    }

    setMyPresence({cursor: current});
  }, [canvasState, camera, resizeSelectedLayer, TranslatingSelectedLayers, continueDrawing, updateSelectionNet]);

  /**光标坐标*/
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, []);

  /**用户光标离开标签页*/
  const onPointerLeave = useMutation(({setMyPresence}) => {
    setMyPresence({cursor: null});
  }, []);

  const onPointerDown = useCallback((
    e: React.PointerEvent,
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) return;

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure)
      return;
    }

    setCanvasState({origin: point, mode: CanvasMode.Pressing});
  }, [camera, canvasState.mode, setCanvasState, startDrawing]);

  const opPointerUp = useMutation((
    {}, e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {
      unSelectLayers();
      setCanvasState({mode: CanvasMode.None})
    } else if (canvasState.mode === CanvasMode.Pencil) {
      insertPath();
    } else if (canvasState.mode === CanvasMode.Inserting) {
      inserLayer(canvasState.layerType, point);
    } else {
      setCanvasState({mode: CanvasMode.None});
    }

    history.resume();

  }, [setCanvasState, camera, canvasState, history, inserLayer, unSelectLayers, insertPath]);

  /**查看图层是否被选择*/
  const selections = useOthersMapped(
    other => other.presence.selection
  );

  /**图层选中*/
  const onLayerPointerDown = useMutation((
    {self, setMyPresence},
    e: React.PointerEvent,
    layerId: string,
  ) => {
    // 处于画笔工具和插入时不会触发该事件
    if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return;

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);

    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({selection: [layerId]}, {addToHistory: true});
    }
    setCanvasState({mode: CanvasMode.Translating, current: point});
  }, [setCanvasState, camera, history, canvasState.mode]);

  /**图层选中时显示的颜色，被选择的图层与用户的光标颜色一致*/
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

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
      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={opPointerUp}
        onPointerDown={onPointerDown}
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
              onLayerPointDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onResizeBoxDown={onResizeBoxPointDown}
          />
          {
            canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null &&
            (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )
          }
          <CursorsPresence/>
          {pencliDraft != null && pencliDraft.length > 0 && (
            <Path
              points={pencliDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  )
}
