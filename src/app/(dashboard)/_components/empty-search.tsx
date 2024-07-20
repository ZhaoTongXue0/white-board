import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image src="/empty-search.svg" alt="搜索结果为空" width={140} height={140} />
      <h2 className="text-2xl font-semibold mt-6">
        没有找到你要搜索的结果!
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        试着搜索其他东西
      </p>
    </div>
  )
}
