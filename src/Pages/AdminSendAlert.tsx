import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ChevronLeft, ChevronRight, List } from "lucide-react";
import UserTable from "@/components/UserTable/UserTable";
import Navbar from "@/components/Navbar/Navbar";

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <nav className="space-y-2 p-2">
          <SidebarLink
            icon={<AlertCircle className="h-4 w-4" />}
            label="Send Alert"
            collapsed={collapsed}
            link={"/admin/send-alert"}
          />
          <SidebarLink
            icon={<List className="h-4 w-4" />}
            label="Disasters"
            collapsed={collapsed}
            link={"/admin-panel"}
          />
        </nav>
      </ScrollArea>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  link: string;
}

const SidebarLink = ({ icon, label, collapsed, link }: SidebarLinkProps) => (
  <Button
    variant="ghost"
    className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
    onClick={() => {
      window.open(link, "_self");
    }}
  >
    {icon}
    {!collapsed && <span className="ml-2">{label}</span>}
  </Button>
);

export default function AdminSendAlert() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <UserTable />
        </main>
      </div>
    </>
  );
}
