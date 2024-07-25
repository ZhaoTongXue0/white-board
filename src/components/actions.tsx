"use client";

import {DropdownMenuContentProps} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {Link2, Pencil, Trash2} from "lucide-react";
import {toast} from "sonner";
import {UseApiMutation} from "@/hooks/use-api-mutation";
import {api} from "../../convex/_generated/api";
import {ConfirmModel} from "@/components/confirm-model";
import {Button} from "@/components/ui/button";
import {useRenameModal} from "@/store/use-rename-modal";
import {useRouter} from "next/navigation";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
  deleteRouter?: boolean;
}

export const Actions = (
  {children, side, sideOffset, id, title, deleteRouter}: ActionsProps
) => {
  const {onOpen} = useRenameModal();
  const {mutate, pending} = UseApiMutation(api.board.remove);
  const route = useRouter();

  const onCoptLink = () => {
    const boardTitle = title;
    navigator.clipboard.writeText(
        `${window.location.origin}/board/${id}`,
      )
      .then(() => toast.success("画板《" + boardTitle + "》链接已复制"))
      .catch(() => toast.error("复制链接失败"))
  }

  const onDelete = () => {
    const boardTitle = title;
    mutate({id})
      .then(() => {
        toast.success("画板《" + boardTitle + "》已删除")
        if (deleteRouter) route.back();
      })
      .catch(() => toast.error("删除画板失败"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCoptLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2"/>
          复制画板链接
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen(id, title)} className="p-3 cursor-pointer">
          <Pencil className="h-4 w-4 mr-2"/>
          重命名
        </DropdownMenuItem>
        <ConfirmModel onConfirm={onDelete} header="删除画板" description="这将删除画板及其所有内容" disabled={pending}>
          <Button variant="ghost" className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
            <Trash2 className="h-4 w-4 mr-2"/>
            删除画板
          </Button>
        </ConfirmModel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
