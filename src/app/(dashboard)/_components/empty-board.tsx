"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {api} from "../../../../convex/_generated/api";
import {useOrganization} from "@clerk/nextjs";
import {UseApiMutation} from "@/hooks/use-api-mutation";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export const EmptyBoard = () => {
  const router = useRouter();
  const {organization} = useOrganization();
  const { mutate,pending } = UseApiMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled"
    })
      .then((id)=>{
        toast.success("新建画板")
        // router.push(`/board/${id}`);
      })
      .catch(()=> toast.error("创建画板失败"))
  }

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
        <Button disabled={pending} onClick={onClick} size="lg">
          创建画板
        </Button>
      </div>
    </div>
  )
}
