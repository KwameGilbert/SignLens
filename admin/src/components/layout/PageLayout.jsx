import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PageLayout() {
  return (
    <div className="flex h-screen bg-[#080B11] text-gray-200 overflow-hidden relative">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-40 -right-40 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute -bottom-60 -left-20 w-[550px] h-[550px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none z-0" />
      
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
