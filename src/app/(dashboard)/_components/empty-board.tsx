import Image from "next/image";
import {Button} from "@/components/ui/button";

export const EmptyBoard = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image src="/empty-boards.svg" alt="画板为空" width={110} height={110}/>
      <h2 className="text-2xl font-semibold mt-6">
        你目前没有画板!
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        为你的组织创建第一个画板
      </p>
      <div className="mt-6">
        <Button size="lg">
          创建画板
        </Button>
      </div>
    </div>
  )
}
