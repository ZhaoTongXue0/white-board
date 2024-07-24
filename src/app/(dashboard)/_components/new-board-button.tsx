"use client"

import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";
import {api} from "../../../../convex/_generated/api";
import {UseApiMutation} from "@/hooks/use-api-mutation";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface NewBoardButton {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = (
  {orgId, disabled}: NewBoardButton
) => {
  const router = useRouter();
  const {mutate, pending} = UseApiMutation(api.board.create);

  const onClick = () => {
    mutate({
      orgId,
      title: "无标题",
    })
      .then((id) => {
        toast.success("创建画板");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("创建画板失败"))
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn("col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6", disabled && "opacity-75 hover:bg-blue-600 cursor-not-allowed")}>
      <div></div>
      <Plus className="h-12 w-12 text-white stroke-1"></Plus>
      <p className="text-sm text-white font-light">
        New board
      </p>
    </button>
  )
}
