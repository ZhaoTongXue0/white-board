import {ToolButton} from "@/app/board/[boardId]/_components/tool-button";
import {Circle, MousePointer2, Pen, Redo2, Square, StickyNote, Type, Undo} from "lucide-react";

export const Toolbar = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton label="选择" icon={MousePointer2} onClick={()=>{}} isActive={true}/>
        <ToolButton label="文本" icon={Type} onClick={()=>{}} isActive={false}/>
        <ToolButton label="便利贴" icon={StickyNote} onClick={()=>{}} isActive={false}/>
        <ToolButton label="矩形" icon={Square} onClick={()=>{}} isActive={false}/>
        <ToolButton label="椭圆形" icon={Circle} onClick={()=>{}} isActive={false}/>
        <ToolButton label="画笔" icon={Pen} onClick={()=>{}} isActive={false}/>
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton label="撤销" icon={Undo} onClick={()=>{}} isDisabled={true}/>
        <ToolButton label="重做" icon={Redo2} onClick={()=>{}} isDisabled={true}/>
      </div>
    </div>
  )
}
export const ToolbarSkeleton = () => {
  return(
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md"/>
  )
}
