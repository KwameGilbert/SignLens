import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Award, BookOpen, Flame, User, CheckCircle2, XCircle, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";

// Mock users mapping
const mockUserData = {
  "1": {
    name: "John Doe",
    email: "john@example.com",
    joinedDate: "2026-06-15",
    status: "Active",
    xp: 1250,
    streak: 7,
    badgesUnlocked: 4,
    badges: [
      { title: "First Sign", color: "#F59E0B" },
      { title: "7-Day Streak", color: "#FB5607" },
      { title: "Quick Learner", color: "#8B5CF6" },
      { title: "Vocabulary Master", color: "#3B82F6" },
    ],
    progress: [
      { category: "Basics", completed: 100, lessons: "12 / 12 completed" },
      { category: "Numbers", completed: 60, lessons: "6 / 10 completed" },
      { category: "Family", completed: 0, lessons: "0 / 8 completed" },
    ],
    translations: [
      { id: "t1", query: "Hello", mode: "Camera", confidence: 98.4, status: "Success", timestamp: "2026-06-20 09:12:04" },
      { id: "t2", query: "Thank You", mode: "Camera", confidence: 96.2, status: "Success", timestamp: "2026-06-19 14:22:10" },
      { id: "t3", query: "Please", mode: "Voice", confidence: 93.8, status: "Success", timestamp: "2026-06-18 10:15:32" },
      { id: "t4", query: "Help", mode: "Camera", confidence: 71.3, status: "Low Confidence", timestamp: "2026-06-17 18:04:12" },
    ],
  },
  "2": {
    name: "Jane Smith",
    email: "jane@example.com",
    joinedDate: "2026-06-18",
    status: "Inactive",
    xp: 250,
    streak: 0,
    badgesUnlocked: 1,
    badges: [
      { title: "First Sign", color: "#F59E0B" },
    ],
    progress: [
      { category: "Basics", completed: 10, lessons: "1 / 12 completed" },
      { category: "Numbers", completed: 0, lessons: "0 / 10 completed" },
      { category: "Family", completed: 0, lessons: "0 / 8 completed" },
    ],
    translations: [
      { id: "t1", query: "Goodbye", mode: "Camera", confidence: 91.0, status: "Success", timestamp: "2026-06-18 12:00:55" },
    ],
  },
  "3": {
    name: "Alice Johnson",
    email: "alice@example.com",
    joinedDate: "2026-06-19",
    status: "Active",
    xp: 750,
    streak: 2,
    badgesUnlocked: 2,
    badges: [
      { title: "First Sign", color: "#F59E0B" },
      { title: "Quick Learner", color: "#8B5CF6" },
    ],
    progress: [
      { category: "Basics", completed: 80, lessons: "9 / 12 completed" },
      { category: "Numbers", completed: 30, lessons: "3 / 10 completed" },
      { category: "Family", completed: 0, lessons: "0 / 8 completed" },
    ],
    translations: [
      { id: "t1", query: "Yes", mode: "Camera", confidence: 97.1, status: "Success", timestamp: "2026-06-20 07:14:22" },
      { id: "t2", query: "No", mode: "Camera", confidence: 94.6, status: "Success", timestamp: "2026-06-19 16:32:00" },
    ],
  },
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const user = mockUserData[id];
  const [status, setStatus] = useState(user?.status || "Active");

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-white">User not found</h3>
        <Button className="mt-4" onClick={() => navigate("/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  const toggleStatus = () => {
    setStatus(status === "Active" ? "Suspended" : "Active");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-white/[0.04] text-gray-400 hover:text-white" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">User Details</h2>
          <p className="text-gray-400 text-sm">View comprehensive learning progress and live AI translation telemetry.</p>
        </div>
      </div>

      {/* Header Profile Panel */}
      <Card className="border-white/[0.08]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      status === "Active"
                        ? "bg-green-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500">Joined on {user.joinedDate}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant={status === "Active" ? "destructive" : "outline"}
                size="sm"
                className="flex items-center gap-1.5"
                onClick={toggleStatus}
              >
                {status === "Active" ? (
                  <>
                    <ShieldAlert className="h-4 w-4" />
                    Suspend User
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Activate User
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-white/[0.08]">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total XP Score</p>
              <h4 className="text-2xl font-black text-white mt-1">{user.xp} XP</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/[0.08]">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Streak</p>
              <h4 className="text-2xl font-black text-white mt-1">{user.streak} Days</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08]">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trophies Unlocked</p>
              <h4 className="text-2xl font-black text-white mt-1">{user.badgesUnlocked} / 6</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-md">Learning Categories</CardTitle>
              <CardDescription>Lesson modules completed status.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {user.progress.map((prog, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-300">{prog.category}</span>
                    <span className="text-primary">{prog.completed}%</span>
                  </div>
                  <div className="w-full bg-white/[0.04] rounded-full h-2 overflow-hidden border border-white/[0.06]">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${prog.completed}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold">{prog.lessons}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-md">Trophy Room</CardTitle>
              <CardDescription>Badges unlocked in user's mobile client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                    style={{
                      borderColor: `${badge.color}30`,
                      backgroundColor: `${badge.color}10`,
                      color: badge.color,
                    }}
                  >
                    <Award className="h-3.5 w-3.5" />
                    {badge.title}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Translation Telemetry */}
        <div className="lg:col-span-2">
          <Card className="border-white/[0.08] h-full flex flex-col justify-between">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-md">Camera & Voice Translations</CardTitle>
              <CardDescription>Recent AI recognition queries from active mobile sessions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.translations.map((trans) => (
                    <TableRow key={trans.id}>
                      <TableCell className="font-semibold text-white">"{trans.query}"</TableCell>
                      <TableCell className="text-gray-300 text-xs">{trans.mode}</TableCell>
                      <TableCell className="text-gray-200 font-bold text-xs">{trans.confidence}%</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            trans.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {trans.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-xs">{trans.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
