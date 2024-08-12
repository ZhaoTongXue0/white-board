"use client";

import {memo} from "react";
import {useStorage} from "@liveblocks/react";
import {LayerType} from "@/types/canvas";
import {Rectangle} from "@/app/board/[boardId]/_components/_layer-preview-grap/rectangle";
import {Ellipse} from "@/app/board/[boardId]/_components/_layer-preview-grap/ellipse";
import {Text} from "@/app/board/[boardId]/_components/_layer-preview-grap/text";
import {Note} from "@/app/board/[boardId]/_components/_layer-preview-grap/note";
import {Path} from "@/app/board/[boardId]/_components/_layer-preview-grap/path";
import {colorToCss} from "@/lib/utils";

interface LayerPreviewProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo((
  {id, onLayerPointDown, selectionColor}: LayerPreviewProps
) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Text:
      return (
        <Text
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      )
    case LayerType.Note:
      return (
        <Note
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      )
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Path:
      return (
        <Path
          key={id}
          points={layer.points}
          onPointerDown={(e) => onLayerPointDown(e, id)}
          stroke={selectionColor}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#000"}
        />
      );
    default:
      console.warn("未知类型");
      return null;
  }
});

LayerPreview.displayName = "LayerPreview";
