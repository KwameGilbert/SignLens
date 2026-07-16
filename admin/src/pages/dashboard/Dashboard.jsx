import {
  Users, Activity, ArrowUpRight, ArrowDownRight,
  Sparkles, CheckSquare, Award, Camera, Mic, Loader2, AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { DashboardChart } from "./DashboardChart";
import { AccuracyMeter } from "./AccuracyMeter";
import { useDashboardQuery } from "../../hooks/useDashboard";

const STAT_STYLES = [
  {
    key: "totalUsers",
    name: "Total Users",
    icon: Users,
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    accent: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
    border: "border-orange-500/10",
    hover: "hover:border-orange-500/30",
  },
  {
    key: "lessonsAndQuizzes",
    name: "Lessons & Quizzes",
    icon: CheckSquare,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accent: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    border: "border-emerald-500/10",
    hover: "hover:border-emerald-500/30",
  },
  {
    key: "badgesAndXp",
    name: "Badges & XP",
    icon: Award,
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    accent: "text-violet-400 bg-violet-500/10 border border-violet-500/20",
    border: "border-violet-500/10",
    hover: "hover:border-violet-500/30",
  },
  {
    key: "translationsToday",
    name: "Translations Today",
    icon: Activity,
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    accent: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
    border: "border-amber-500/10",
    hover: "hover:border-amber-500/30",
  },
];

function getModeIcon(mode) {
  if (!mode) return Camera;
  return mode.toLowerCase() === "voice" ? Mic : Camera;
}

function getTranslationColor(alert) {
  return alert === "success"
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : "text-amber-400 bg-amber-500/10 border-amber-500/20";
}

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardQuery();

  const stats = data?.stats ?? {};
  const chartData = data?.chart ?? [];
  const metrics = data?.metrics ?? null;
  const recentUsers = data?.activity?.recentUsers ?? [];
  const liveTranslations = data?.activity?.liveTranslations ?? [];

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <p className="text-rose-400 text-sm font-semibold">
            {error?.response?.data?.message || error?.message || "Failed to load dashboard data."}
          </p>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !error && (
        <>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_STYLES.map((style) => {
              const stat = stats[style.key] ?? {};
              const isNegative = stat.changeType === "negative";
              return (
                <Card
                  key={style.key}
                  className={`overflow-hidden relative border ${style.border} ${style.hover} shadow-sm transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-70`} />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 border-b-0">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">{style.name}</CardTitle>
                    <div className={`p-2 rounded-lg ${style.accent}`}>
                      <style.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 pt-2">
                    <div className="text-3xl font-black text-white tracking-tight">
                      {stat.value ?? "—"}
                    </div>
                    <div className="flex items-center mt-3 text-xs">
                      <span
                        className={`flex items-center font-bold px-1.5 py-0.5 rounded-md ${
                          isNegative
                            ? "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                            : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                        }`}
                      >
                        {isNegative ? <ArrowDownRight className="h-3 w-3 mr-0.5" /> : <ArrowUpRight className="h-3 w-3 mr-0.5" />}
                        {stat.change ?? "—"}
                      </span>
                      <span className="text-gray-500 font-medium ml-2">{stat.timeframe ?? ""}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardChart chartData={chartData} />
            </div>
            <div className="lg:col-span-1">
              <AccuracyMeter metrics={metrics} />
            </div>
          </div>

          {/* Dynamic Info Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
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
                {recentUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-4">No recent user activity.</p>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {recentUsers.map((user, i) => (
                      <div key={i} className="flex items-start py-4 first:pt-0 last:pb-0">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {user.name?.charAt(0) ?? "?"}
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
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{user.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live AI Translations */}
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
                {liveTranslations.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-4">No translations recorded yet.</p>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {liveTranslations.map((translation, i) => {
                      const ModeIcon = getModeIcon(translation.mode);
                      const color = getTranslationColor(translation.alert);
                      return (
                        <div key={i} className="flex items-center py-4 first:pt-0 last:pb-0">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-gray-400">
                            <ModeIcon className="h-5 w-5 text-gray-300" />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-white">"{translation.query}"</p>
                              <span className="text-xs text-primary font-bold">{translation.confidence} Conf.</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[10px] font-bold">
                                {translation.mode} Mode
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${color}`}>
                                <span className="relative flex h-1.5 w-1.5">
                                  <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                      translation.alert === "success" ? "bg-emerald-400" : "bg-amber-400"
                                    }`}
                                  />
                                  <span
                                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                      translation.alert === "success" ? "bg-emerald-500" : "bg-amber-500"
                                    }`}
                                  />
                                </span>
                                {translation.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
