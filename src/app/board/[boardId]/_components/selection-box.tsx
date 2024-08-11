"use client";

import {memo} from "react";
import {LayerType, Side, XYWH} from "@/types/canvas";
import {useSelf, useStorage} from "@liveblocks/react/suspense";
import {useSelectionBounds} from "@/hooks/use-selection-bounds";

interface SelectionBoxProps {
  onResizeBoxDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo((
  {onResizeBoxDown}: SelectionBoxProps
) => {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );

  const isShowingHandles = useStorage((root) =>
    soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
  );

  const bounds = useSelectionBounds();

  if (!bounds) return null;

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 start-1 pointer-events-none"
        style={{
          transform: `translate(${bounds.x}px, ${bounds.y}px)`
        }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />
      {isShowingHandles && (
        <>
          {/*1,1*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Top + Side.Left, bounds)
            }}
          />
          {/*1,2*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,
                ${bounds.y - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Top, bounds)
            }}
          />
          {/*1,3*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Top + Side.Right, bounds)

            }}
          />
          {/*2,1*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Left, bounds)
            }}
          />
          {/*2,2*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Right, bounds)
            }}
          />
          {/*3,1*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Bottom + Side.Left, bounds)
            }}
          />
          {/*3,2*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Bottom, bounds)
            }}
          />
          {/*3,3*/}
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeBoxDown(Side.Bottom + Side.Right, bounds)
            }}
          />
        </>
      )}
    </>
  )
})

SelectionBox.displayName = "SelectionBox";
