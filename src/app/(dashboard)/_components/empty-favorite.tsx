import Image from "next/image";

export const EmptyFavorite = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image src="/empty-favorite.svg" alt="星标结果为空" width={140} height={140} />
      <h2 className="text-2xl font-semibold mt-6">
        你目前没有星标的内容!
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        试着添加一些星标
      </p>
    </div>
  )
}
