import Image from "next/image";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {CreateOrganization} from "@clerk/nextjs";

export const Empty = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/EmptyState.svg" alt="Empty" height={200} width={200}/>
      <h2 className="text-2xl font-semibold mt-6">
        Welcome to Board
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        创建一个组织并开始
      </p>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">创建组织</Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
            <CreateOrganization routing="hash" appearance={{
              elements: {
                cardBox: "w-[480px] z-0",
              }
            }}/>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
