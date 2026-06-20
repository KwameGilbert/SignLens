import { Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-black/20 px-6 backdrop-blur-md">
      <div className="flex flex-1"></div>
      <div className="flex items-center gap-x-4">
        <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-200 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="h-6 w-px bg-white/[0.08]" aria-hidden="true" />

        <div className="flex items-center gap-x-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold leading-6 text-gray-200">Admin User</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-rose-500 transition-colors ml-2">
             <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
