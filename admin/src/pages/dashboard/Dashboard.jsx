import { Users, BookOpen, Activity, ArrowUpRight, ArrowDownRight, Video, FileText, Sparkles, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { DashboardChart } from "./DashboardChart";
import { AccuracyMeter } from "./AccuracyMeter";

export default function Dashboard() {
  const stats = [
    {
      name: "Total Users",
      value: "12,345",
      icon: Users,
      change: "+12%",
      changeType: "positive",
      timeframe: "vs last month",
      gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
      accent: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
      border: "border-orange-500/10 glow-orange",
    },
    {
      name: "Lessons Finished",
      value: "1,842",
      icon: BookOpen,
      change: "+8%",
      changeType: "positive",
      timeframe: "this week",
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      accent: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
      border: "border-emerald-500/10",
    },
    {
      name: "Avg Translation Accuracy",
      value: "94.6%",
      icon: BrainCircuit,
      change: "+1.2%",
      changeType: "positive",
      timeframe: "vs yesterday",
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      accent: "text-violet-400 bg-violet-500/10 border border-violet-500/20",
      border: "border-violet-500/10 glow-purple",
    },
    {
      name: "Daily Active Users",
      value: "1,203",
      icon: Activity,
      change: "-2%",
      changeType: "negative",
      timeframe: "vs yesterday",
      gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
      accent: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
      border: "border-amber-500/10",
    },
  ];

  const recentUsers = [
    { name: "Emma Thompson", email: "emma@example.com", time: "2 hours ago", status: "New Sign up", detail: "Joined via Google Auth" },
    { name: "James Wilson", email: "james.w@example.com", time: "4 hours ago", status: "Completed Lesson 1", detail: "Alphabet Basics Quiz" },
    { name: "Sofia Garcia", email: "sofia.g@example.com", time: "5 hours ago", status: "Earned Badge", detail: "Got 'Alphabet Explorer' badge" },
  ];

  const recentLessons = [
    { title: "Common Phrases", category: "Basics", type: "Video", views: "1.2k", rating: "4.9/5", icon: Video },
    { title: "Numbers 11-20", category: "Numbers", type: "Text", views: "856", rating: "4.7/5", icon: FileText },
    { title: "Family Members", category: "Family", type: "Video", views: "432", rating: "4.8/5", icon: Video },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h2>
          <p className="text-gray-400 mt-1">Real-time mobile app metrics and sign recognition telemetry.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-semibold self-start md:self-auto shadow-sm">
          <Sparkles className="h-4 w-4" />
          AI Models Online (v2.1)
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className={`overflow-hidden relative border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
            {/* Soft decorative background gradient matching the theme */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-70`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 border-b-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.name}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.accent}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="flex items-center mt-3 text-xs">
                <span
                  className={`flex items-center font-bold px-1.5 py-0.5 rounded-md ${
                    stat.changeType === "positive" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                  }`}
                >
                  {stat.changeType === "positive" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {stat.change}
                </span>
                <span className="text-gray-500 font-medium ml-2">{stat.timeframe}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        <div className="lg:col-span-1">
          <AccuracyMeter />
        </div>
      </div>

      {/* Dynamic Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/[0.08] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">Recent User Activity</CardTitle>
                <CardDescription>Latest telemetry updates from the mobile clients.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.04]">
              {recentUsers.map((user, i) => (
                <div key={i} className="flex items-start py-4 first:pt-0 last:pb-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <span className="text-[10px] text-gray-500 font-medium">{user.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-primary mt-0.5">{user.status}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">Popular Content</CardTitle>
                <CardDescription>Lesson modules with highest interactive engagement.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.04]">
              {recentLessons.map((lesson, i) => (
                <div key={i} className="flex items-center py-4 first:pt-0 last:pb-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-gray-400">
                    <lesson.icon className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{lesson.title}</p>
                      <span className="text-xs text-primary font-bold">{lesson.views} hits</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[10px] font-bold">{lesson.category}</span>
                      <span className="text-[10px] text-gray-500 font-semibold">Rating: {lesson.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
