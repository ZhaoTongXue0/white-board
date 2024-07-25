import {Canvas} from "@/app/board/[boardId]/_components/canvas";
import {Room} from "@/components/room";
import {Loading} from "@/app/board/[boardId]/_components/loading";

interface BoardIdPagePropr {
  params: {
    boardId: string;
  };
}

const BoardIdPage = (
  {params}: BoardIdPagePropr
) => {
  return (
    <Room roomId={params.boardId} fallback={<div>Loading....</div>}>
      <Canvas boardId={params.boardId}/>
    </Room>
  )
}

export default BoardIdPage;
