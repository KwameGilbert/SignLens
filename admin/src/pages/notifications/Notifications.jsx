import { useState } from "react";
import { Bell, Search, Trash2, CheckCircle2, AlertTriangle, UserPlus, BookOpen, CheckSquare, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const initialNotifications = [
  {
    id: "notif-1",
    title: "System Latency Alert",
    desc: "AI video recognition translation latency spiked above 1.2s on US-West server group.",
    type: "alert",
    unread: true,
    time: "45 minutes ago",
  },
  {
    id: "notif-2",
    title: "New Mobile Registrations",
    desc: "Student user Alice Johnson (alice@example.com) registered their mobile client account.",
    type: "user",
    unread: true,
    time: "2 hours ago",
  },
  {
    id: "notif-3",
    title: "Lesson Checkpoint Update",
    desc: "Administrator Abigail Mensah updated video attachments inside lesson 'Alphabet Signs G-Z'.",
    type: "content",
    unread: false,
    time: "5 hours ago",
  },
  {
    id: "notif-4",
    title: "Quiz Checkpoint Alert",
    desc: "Numbers 0-5 practice quiz recorded an average accuracy drop (currently at 61% accuracy).",
    type: "quiz",
    unread: false,
    time: "Yesterday at 16:40",
  },
  {
    id: "notif-5",
    title: "Database Backup Completed",
    desc: "Weekly system snapshots and progress tracking database saved to AWS S3 storage buckets.",
    type: "system",
    unread: false,
    time: "3 days ago",
  },
];

const notificationIcons = {
  alert: { icon: AlertTriangle, color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)" },
  user: { icon: UserPlus, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)" },
  content: { icon: BookOpen, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.2)" },
  quiz: { icon: CheckSquare, color: "#FB5607", bg: "rgba(251, 86, 7, 0.1)", border: "rgba(251, 86, 7, 0.2)" },
  system: { icon: CheckCircle2, color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.2)" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "unread", "alerts", "system"

  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    // Search query match
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter tab match
    if (activeFilter === "unread") return n.unread;
    if (activeFilter === "alerts") return n.type === "alert" || n.type === "quiz";
    if (activeFilter === "system") return n.type === "system" || n.type === "content";
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Notifications Center</h2>
          <p className="text-gray-400 text-sm">Review dashboard audits, system alerts, and mobile client activities.</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mark All as Read
            </Button>
            <Button
              variant="ghost"
              onClick={clearAll}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex gap-4 w-full md:w-auto">
          {[
            { label: "All Logs", value: "all", count: notifications.length },
            { label: "Unread", value: "unread", count: unreadCount },
            { label: "System Alerts", value: "alerts", count: notifications.filter(n => n.type === "alert" || n.type === "quiz").length },
            { label: "Content & Sync", value: "system", count: notifications.filter(n => n.type === "system" || n.type === "content").length }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`pb-2 text-sm font-semibold transition-all relative cursor-pointer ${
                activeFilter === tab.value ? "text-primary" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeFilter === tab.value 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-white/5 text-gray-500 border border-white/[0.04]"
                }`}>
                  {tab.count}
                </span>
              </span>
              {activeFilter === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(251,86,7,0.4)] animate-in slide-in-from-bottom-1" />
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search alerts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications Cards Container */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const config = notificationIcons[notif.type] || { icon: Bell, color: "#FFF", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" };
            const Icon = config.icon;
            return (
              <Card 
                key={notif.id} 
                className={`border-white/[0.08] transition-all duration-300 relative overflow-hidden ${
                  notif.unread 
                    ? "bg-gradient-to-r from-white/[0.03] to-transparent border-l-2 border-l-primary" 
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <CardContent className="p-5 flex gap-4 items-start justify-between">
                  <div className="flex gap-4">
                    {/* Glowing Category circle icon */}
                    <div 
                      className="p-3 rounded-xl shrink-0 border"
                      style={{ 
                        backgroundColor: config.bg, 
                        color: config.color,
                        borderColor: config.border
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white leading-none">{notif.title}</h4>
                        {notif.unread && (
                          <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider scale-95">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed pr-6">{notif.desc}</p>
                      <p className="text-[10px] text-gray-500 font-semibold">{notif.time}</p>
                    </div>
                  </div>

                  {/* Actions Drawer */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReadStatus(notif.id)}
                      className="text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      title={notif.unread ? "Mark as Read" : "Mark as Unread"}
                    >
                      {notif.unread ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notif.id)}
                      className="text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 rounded-full bg-white/[0.02] border border-white/[0.04] text-gray-600">
              <Bell className="h-10 w-10 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">All caught up!</h3>
              <p className="text-sm text-gray-500 max-w-xs mt-1">No alert notifications matched your current filter criteria.</p>
            </div>
            {notifications.length === 0 && (
              <Button 
                variant="ghost" 
                onClick={() => setNotifications(initialNotifications)} 
                className="flex items-center gap-1.5 border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white mt-2 h-9 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore Mock Data
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
