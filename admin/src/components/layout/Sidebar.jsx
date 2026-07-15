import { LayoutDashboard, Users, BookOpen, FolderOpen, CheckSquare, Award, Activity, History, Settings, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

const navigationGroups = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content Management",
    items: [
      { name: "Lessons", href: "/lessons", icon: BookOpen },
      { name: "Categories", href: "/categories", icon: FolderOpen },
      { name: "Quizzes", href: "/quizzes", icon: CheckSquare },
    ],
  },
  {
    title: "User Engagement",
    items: [
      { name: "Users", href: "/users", icon: Users },
      { name: "Badges", href: "/badges", icon: Award },
    ],
  },
  {
    title: "System & Logs",
    items: [
      { name: "Translations", href: "/translations", icon: Activity },
      { name: "Activity Logs", href: "/logs", icon: History },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0D121F]/95 backdrop-blur-lg border-r border-white/[0.06] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:bg-black/40",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/[0.06]">
        <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-primary to-primary-soft bg-clip-text text-transparent">
          SIGNLENS
        </h1>
        {/* Close Button inside Sidebar Drawer on Mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-white cursor-pointer -mr-2"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <nav className="flex-1 space-y-6 px-4">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 block mb-1">
                {group.title}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        isActive
                          ? "bg-primary/10 text-primary border-l-2 border-primary font-bold"
                          : "text-gray-400 hover:bg-white/[0.02] hover:text-gray-200",
                        "group flex items-center rounded-r-lg pl-3 pr-4 py-2 text-sm font-medium transition-all duration-150"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-300",
                          "mr-3 h-4 w-4 flex-shrink-0 transition-colors"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
