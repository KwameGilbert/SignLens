import { LayoutDashboard, Users, BookOpen, CheckSquare, Award, Activity, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Lessons", href: "/lessons", icon: BookOpen },
  { name: "Quizzes", href: "/quizzes", icon: CheckSquare },
  { name: "Badges", href: "/badges", icon: Award },
  { name: "Translations", href: "/translations", icon: Activity },
  { name: "Activity Logs", href: "/logs", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-black/40 backdrop-blur-lg border-r border-white/[0.06] z-20">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/[0.06]">
        <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-primary to-primary-soft bg-clip-text text-transparent">
          SIGNLENS
        </h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1.5 px-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
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
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
