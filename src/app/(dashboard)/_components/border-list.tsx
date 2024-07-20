"use client"

import {EmptySearch} from "@/app/(dashboard)/_components/empty-search";
import {EmptyFavorite} from "@/app/(dashboard)/_components/empty-favorite";
import {EmptyBoard} from "@/app/(dashboard)/_components/empty-board";

interface BorderListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BorderList = ({orgId, query}: BorderListProps) => {
  const data = [];

  if (!data?.length && query.search) {
    return <EmptySearch/>
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorite/>
  }

  if (!data?.length) {
    return <EmptyBoard/>
  }
  return (
    <div>
      {JSON.stringify(query)}
    </div>
  )
}
