import { Bell, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-black/20 px-6 backdrop-blur-md z-30">
      <div className="flex flex-1"></div>
      <div className="flex items-center gap-x-4">
        {/* Notifications Bell wrapper */}
        <Link 
          to="/notifications" 
          className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          {/* Notification Alert indicator dot */}
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-[#080B11] shadow-[0_0_8px_#FB5607] animate-pulse" />
        </Link>

        <div className="h-6 w-px bg-white/[0.08]" aria-hidden="true" />

        {/* Profile Details link */}
        <div className="flex items-center gap-x-4">
          <Link 
            to="/profile" 
            className="flex items-center gap-x-3 group hover:opacity-90 transition-all cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold leading-6 text-gray-200 group-hover:text-white transition-all">
              Kwame Gilbert
            </span>
          </Link>
          <div className="h-6 w-px bg-white/[0.08]" aria-hidden="true" />
          <button 
            onClick={handleLogout} 
            className="text-gray-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
