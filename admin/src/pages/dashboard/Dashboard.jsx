import { Users, BookOpen, Activity, ArrowUpRight, ArrowDownRight, Video, FileText, Sparkles, BrainCircuit, CheckSquare, Award, Camera, Mic } from "lucide-react";
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
      border: "border-orange-500/10",
      hover: "hover:glow-orange hover:border-orange-500/30",
    },
    {
      name: "Lessons & Quizzes",
      value: "84 / 15",
      icon: CheckSquare,
      change: "+3 new",
      changeType: "positive",
      timeframe: "this week",
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      accent: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
      border: "border-emerald-500/10",
      hover: "hover:glow-emerald hover:border-emerald-500/30",
    },
    {
      name: "Badges & XP",
      value: "6 / 1.2k XP",
      icon: Award,
      change: "Stable",
      changeType: "positive",
      timeframe: "Trophy Milestones",
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      accent: "text-violet-400 bg-violet-500/10 border border-violet-500/20",
      border: "border-violet-500/10",
      hover: "hover:glow-purple hover:border-violet-500/30",
    },
    {
      name: "Translations Today",
      value: "4,321",
      icon: Activity,
      change: "+18.4%",
      changeType: "positive",
      timeframe: "vs yesterday",
      gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
      accent: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
      border: "border-amber-500/10",
      hover: "hover:glow-amber hover:border-amber-500/30",
    },
  ];

  const recentUsers = [
    { name: "Emma Thompson", email: "emma@example.com", time: "2 hours ago", status: "New Sign up", detail: "Joined via Google Auth", active: true },
    { name: "James Wilson", email: "james.w@example.com", time: "4 hours ago", status: "Completed Lesson 1", detail: "Alphabet Basics Quiz", active: false },
    { name: "Sofia Garcia", email: "sofia.g@example.com", time: "5 hours ago", status: "Earned Badge", detail: "Got 'Alphabet Explorer' badge", active: false },
  ];

  const liveTranslations = [
    { query: "Hello", mode: "Camera", confidence: "98.4%", status: "Success", icon: Camera, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", alert: "success" },
    { query: "Can you help me?", mode: "Voice", confidence: "95.1%", status: "Success", icon: Mic, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", alert: "success" },
    { query: "Wait", mode: "Camera", confidence: "71.3%", status: "Warning", icon: Camera, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", alert: "warning" },
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
          <Card key={stat.name} className={`overflow-hidden relative border ${stat.border} ${stat.hover} shadow-sm transition-all duration-300 hover:-translate-y-1`}>
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs font-semibold text-primary">{user.status}</p>
                      {user.active && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
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
                <CardTitle className="text-lg text-white">Live AI Translations</CardTitle>
                <CardDescription>Real-time queries processed by the translation engine.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.04]">
              {liveTranslations.map((translation, i) => (
                <div key={i} className="flex items-center py-4 first:pt-0 last:pb-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-gray-400">
                    <translation.icon className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">"{translation.query}"</p>
                      <span className="text-xs text-primary font-bold">{translation.confidence} Conf.</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[10px] font-bold">{translation.mode} Mode</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${translation.color}`}>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            translation.alert === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}></span>
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                            translation.alert === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                        </span>
                        {translation.status}
                      </span>
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
