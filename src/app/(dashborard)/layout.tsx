import {Sidebar} from "@/app/(dashborard)/_components/sidebar";
import {OrgSidebar} from "@/app/(dashborard)/_components/org-sidebar";
import {Navbar} from "@/app/(dashborard)/_components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Sidebar/>
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar/>
          <div className="h-full flex-1">
            <Navbar/>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
export default DashboardLayout;
