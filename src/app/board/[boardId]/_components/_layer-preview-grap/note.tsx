import {NoteLayer, TextLayer} from "@/types/canvas";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import {cn, colorToCss, getsTheContrastFontColor} from "@/lib/utils";
import {Inter} from "next/font/google";
import {useMutation} from "@liveblocks/react/suspense";

const font = Inter({
  subsets: ["latin"],
  weight: ["400"],
});

const defaultFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(
    fontSizeBasedOnHeight,
    fontSizeBasedOnWidth,
    maxFontSize
  )
}

interface NoteProps {
  id: string,
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = (
  {id, layer, onPointerDown, selectionColor}: NoteProps,
) => {
  const {x, y, width, height, fill, value} = layer;

  const updataValue = useMutation((
    {storage},
    newValue: string,
  ) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updataValue(e.target.value);
  }

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Text"}
        className={cn(
          "h-full w-full flex items-center justify-center text-center outline-none",
          font.className
        )}
        style={{
          fontSize: defaultFontSize(width, height),
          color: fill ? getsTheContrastFontColor(fill) : "#000",
        }}
        onChange={handleContentChange}
      />
    </foreignObject>
  )
}
