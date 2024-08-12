"use client";

import {memo} from "react";
import {useOthersConnectionIds} from "@liveblocks/react/suspense";
import {Cursor} from "@/app/board/[boardId]/_components/cursor";
import {shallow, useOthersMapped} from "@liveblocks/react";
import {Path} from "@/app/board/[boardId]/_components/_layer-preview-grap/path";
import {colorToCss} from "@/lib/utils";

const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => (
        <Cursor
          key={connectionId}
          connectionId={connectionId}
        />
      ))}
    </>
  )
}

const Drafts = () => {
  const othersEvent = useOthersMapped((other) => ({
    penCilDraft: other.presence.penCilDraft,
    penColor: other.presence.penColor,
  }), shallow);

  return (
    <>
      {
        othersEvent.map(([key, other]) => {
          if (other.penCilDraft) {
            return (
              <Path
                key={key}
                x={0}
                y={0}
                points={other.penCilDraft}
                fill={other.penColor ? colorToCss(other.penColor) : "#000"}
              />
            )
          }

          return null;
        })
      }
    </>
  )

}

export const CursorsPresence = memo(() => {
  return (
    <>
      <Drafts/>
      <Cursors/>
    </>
  )
})

CursorsPresence.displayName = "CursorsPresence";
