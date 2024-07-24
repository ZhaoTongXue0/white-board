"use client"

import {EmptySearch} from "@/app/(dashboard)/_components/empty-search";
import {EmptyFavorite} from "@/app/(dashboard)/_components/empty-favorite";
import {EmptyBoard} from "@/app/(dashboard)/_components/empty-board";
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {BoardCard} from "@/app/(dashboard)/_components/board-card";
import {NewBoardButton} from "@/app/(dashboard)/_components/new-board-button";

interface BorderListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BorderList = ({orgId, query}: BorderListProps) => {
  const data = useQuery(api.boards.get, {
    orgId,
    ...query
  });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "星标画板" : "团队画板"}
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled/>
          <BoardCard.Skeleton/>
          <BoardCard.Skeleton/>
          <BoardCard.Skeleton/>
        </div>
      </div>
    )
  }

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
      <h2 className="text-3xl">
        {query.favorites ? "星标画板" : "团队画板"}
      </h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId}/>
        {data?.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  )
}
