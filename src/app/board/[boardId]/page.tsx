import {Canvas} from "@/app/board/[boardId]/_components/canvas";

interface BoardIdPagePropr {
  params: {
    boardId: string;
  };
}

const BoardIdPage = (
  {params}: BoardIdPagePropr
) => {
  return (
    <Canvas boardId={params.boardId}/>
  )
}

export default BoardIdPage;
