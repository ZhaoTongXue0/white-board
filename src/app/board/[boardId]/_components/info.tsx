"use client";

import {useQuery} from "convex/react";
import {api} from "../../../../../convex/_generated/api";
import {Id} from "../../../../../convex/_generated/dataModel";
import {Poppins} from "next/font/google";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Hint} from "@/components/hint";
import {useRenameModal} from "@/store/use-rename-modal";
import {Actions} from "@/components/actions";
import {Menu} from "lucide-react";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

const TabSeparator = () => {
  return (
    <div className="text-neutral-300 px-1.5">|</div>
  )
}

export const Info = (
  {boardId}: InfoProps,
) => {
  const {onOpen} = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  })

  if (!data) return <InfoSkeleton/>;

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="返回画板列表" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2 ">
          <Link href="/">
            <Image src="/logo.svg" alt="画报logo" height={40} width={40}/>
            <span className={cn(
              "font-semibold text-xl ml-2 text-black",
              font.className,
            )}>Board</span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator/>
      <Hint label="重命名画板" side="bottom" sideOffset={10}>
        <Button variant="board" className="text-base font-normal px-2" onClick={() => onOpen(data._id, data.title)}>
          {data.title}
        </Button>
      </Hint>
      <TabSeparator/>
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10} deleteRouter={true}>
        <div>
          <Hint label="main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <Menu/>
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  )
}

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]"/>
  )
}
