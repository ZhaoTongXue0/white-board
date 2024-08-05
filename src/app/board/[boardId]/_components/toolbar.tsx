import {ToolButton} from "@/app/board/[boardId]/_components/tool-button";
import {Circle, MousePointer2, Pen, Redo2, Square, StickyNote, Type, Undo} from "lucide-react";
import {CanvasMode, CanvasState, LayerType} from "@/types/canvas";
import {LogMessage} from "@/hooks/log-message";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = (
  {canvasState, setCanvasState, undo, redo, canRedo, canUndo}: ToolbarProps,
) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="选择"
          icon={MousePointer2}
          onClick={() => {
            setCanvasState({mode: CanvasMode.None})
            LogMessage("切换为选择工具")
          }}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="文本"
          icon={Type}
          onClick={() => {
            setCanvasState({mode: CanvasMode.Inserting, layerType: LayerType.Text})
            LogMessage("切换为文本工具")
          }}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label="便利贴"
          icon={StickyNote}
          onClick={() => {
          }}
          isActive={false}/>
        <ToolButton
          label="矩形"
          icon={Square}
          onClick={() => {
          }}
          isActive={false}/>
        <ToolButton
          label="椭圆形"
          icon={Circle}
          onClick={() => {
          }}
          isActive={false}/>
        <ToolButton
          label="画笔"
          icon={Pen}
          onClick={() => {
          }}
          isActive={false}/>
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton label="撤销" icon={Undo} onClick={undo} isDisabled={!canUndo}/>
        <ToolButton label="重做" icon={Redo2} onClick={redo} isDisabled={!canRedo}/>
      </div>
    </div>
  )
}
export const ToolbarSkeleton = () => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md"/>
  )
}
