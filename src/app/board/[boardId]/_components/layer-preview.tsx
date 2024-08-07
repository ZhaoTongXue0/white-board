"use client";

import {memo} from "react";
import {useStorage} from "@liveblocks/react";
import {LayerType} from "@/types/canvas";
import {Rectangle} from "@/app/board/[boardId]/_components/rectangle";

interface LayerPreviewProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

export const LayerPreview = memo((
  {id, onLayerPointDown, selectionColor}: LayerPreviewProps
) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Rectangle:
      return (<Rectangle id={id} layer={layer} onPointerDown={onLayerPointDown} selectionColor={selectionColor}/>);
    default:
      console.warn("未知类型");
      return null;
  }
});

LayerPreview.displayName = "LayerPreview";
