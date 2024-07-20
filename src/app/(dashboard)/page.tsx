"use client"
import {Empty} from "@/app/(dashboard)/_components/empty";
import {useOrganization} from "@clerk/nextjs";
import {BorderList} from "@/app/(dashboard)/_components/border-list";

interface DashboardPageProps {
  searchParams: {
    search: string;
    favorites?: string;
  }
}

export default function DashboardPage({searchParams}: DashboardPageProps) {
  const {organization} = useOrganization();
  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <Empty/>
      ) : (
        <BorderList orgId={organization.id} query={searchParams}/>
      )}
    </div>
  );
}
