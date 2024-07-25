"use client";

import {UserAvatar} from "@/app/board/[boardId]/_components/user-avatar";
import {useOthers, useSelf} from "@liveblocks/react/suspense";
import {connectionIdToColor} from "@/lib/utils";

const MAX_SHOWN_USERS = 3;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {/*显示自己*/}
        {currentUser && (
          <UserAvatar
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.[0]}
            borderColor={connectionIdToColor(currentUser.connectionId)}

          />
        )}
        {users.length > 0 ? <div className="border border-gray-100 h-8"/> : null}
        {/*显示其他用户*/}
        {users.slice(0, MAX_SHOWN_USERS)
          .map(({connectionId, info}) => (
            <UserAvatar
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0] || "T"}
              borderColor={connectionIdToColor(connectionId)}
            />
          ))}
        {/*用户超出`MAX_SHOWN_USERS` 设定的人数是 显示更多*/}
        {hasMoreUsers && (
          <UserAvatar
            name={`共有 ${users.length - MAX_SHOWN_USERS} 位用户`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  )
}

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]"/>
  )
}
