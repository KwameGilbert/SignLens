import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Flame, CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { useUserDetailQuery, useUpdateUserMutation } from "../../hooks/useUsers";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useUserDetailQuery(id);
  const updateUserMutation = useUpdateUserMutation(id);

  // Helper to format date strings
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return dateStr.split("T")[0];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-400 text-sm">Retrieving user files...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 max-w-md mx-auto text-center">
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">User Retrieve Failed</h3>
          <p className="text-gray-400 text-sm mt-1">
            {error?.response?.data?.message || error?.message || "The user record could not be loaded or does not exist."}
          </p>
        </div>
        <Button className="mt-4 cursor-pointer" onClick={() => navigate("/users")}>
          Back to Users Directory
        </Button>
      </div>
    );
  }

  // Determine if this is an admin dashboard account vs. normal mobile client
  const isAdmin = user.role && user.role.toLowerCase() !== "user" && user.role.toLowerCase() !== "client";
  const currentStatus = user.status || "Inactive";

  const toggleStatus = async () => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    try {
      await updateUserMutation.mutateAsync({ status: nextStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-white/[0.04] text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">User Details</h2>
          <p className="text-gray-400 text-sm">
            {isAdmin 
              ? "View administrative role access, core credentials, permissions matrices, and logs."
              : "View comprehensive learning progress and live AI translation telemetry."}
          </p>
        </div>
      </div>

      {/* Header Profile Panel */}
      <Card className="border-white/[0.08]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-2xl border ${
                isAdmin 
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                  : "bg-primary/10 text-primary border-primary/20"
              }`}>
                {(user.firstName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed User"}</h3>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      {user.role || "Admin"}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      currentStatus === "Active"
                        ? "bg-green-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {currentStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500">Joined on {formatDate(user.joinedDate || user.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant={currentStatus === "Active" ? "destructive" : "ghost"}
                size="sm"
                className={`flex items-center gap-1.5 cursor-pointer ${
                  currentStatus !== "Active" ? "border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" : ""
                }`}
                onClick={toggleStatus}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <span>Updating...</span>
                ) : currentStatus === "Active" ? (
                  <>
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    Suspend Account
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Activate Account
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification / Admin Performance metrics Row */}
      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/[0.08]">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dashboard Role</p>
                <h4 className="text-2xl font-black text-white mt-1">{user.role || "Admin"}</h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/[0.08]">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions Logged</p>
                <h4 className="text-2xl font-black text-white mt-1">{(user.auditLogs || []).length} Actions</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08]">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Clearance</p>
                <h4 className="text-2xl font-black text-white mt-1">
                  {user.role === "Super Admin" ? "Level 3 (Full)" : user.role === "Content Editor" ? "Level 2 (Edit)" : "Level 1 (Read)"}
                </h4>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/[0.08]">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total XP Score</p>
                <h4 className="text-2xl font-black text-white mt-1">{user.xp ?? 0} XP</h4>
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
                <h4 className="text-2xl font-black text-white mt-1">{user.streak ?? 0} Days</h4>
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
                <h4 className="text-2xl font-black text-white mt-1">{user.badgesUnlocked ?? (user.badges || []).length} Unlocked</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details matrix layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Progress breakdown (App User) or Permissions (Admin User) */}
        <div className="lg:col-span-1 space-y-6">
          {isAdmin ? (
            <Card className="border-white/[0.08]">
              <CardHeader className="border-b border-white/[0.04]">
                <CardTitle className="text-md">Access & Permissions</CardTitle>
                <CardDescription>Administrative access privilege controls.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {[
                  { label: "Manage Lessons Checkpoints", grant: "Manage Lessons" },
                  { label: "Manage Quiz Questions", grant: "Manage Quizzes" },
                  { label: "User Access Controls", grant: "Manage Users" },
                  { label: "System Core Settings", grant: "Manage System Settings" }
                ].map((perm, idx) => {
                  const hasAccess = (user.permissions || []).includes(perm.grant) || user.role === "Super Admin";
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-xs font-semibold text-gray-300">{perm.label}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        hasAccess 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {hasAccess ? "Granted" : "Restricted"}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-white/[0.08]">
                <CardHeader className="border-b border-white/[0.04]">
                  <CardTitle className="text-md">Learning Categories</CardTitle>
                  <CardDescription>Lesson modules completed status.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {(user.progress || []).length > 0 ? (
                    user.progress.map((prog, idx) => (
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
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 py-2">No learning metrics recorded yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/[0.08]">
                <CardHeader className="border-b border-white/[0.04]">
                  <CardTitle className="text-md">Trophy Room</CardTitle>
                  <CardDescription>Badges unlocked in user's mobile client.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {(user.badges || []).length > 0 ? (
                      user.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                          style={{
                            borderColor: `${badge.color || '#FB5607'}30`,
                            backgroundColor: `${badge.color || '#FB5607'}10`,
                            color: badge.color || '#FB5607',
                          }}
                        >
                          <Award className="h-3.5 w-3.5" />
                          {badge.title}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No achievements unlocked yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Side: Translation Telemetry (App User) or Admin Activity logs (Admin User) */}
        <div className="lg:col-span-2">
          {isAdmin ? (
            <Card className="border-white/[0.08] h-full flex flex-col justify-between">
              <CardHeader className="border-b border-white/[0.04] pb-4">
                <CardTitle className="text-md">Admin Activity Audit Logs</CardTitle>
                <CardDescription>Secure system modifications and console activities feed.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <div className="overflow-x-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>System Action</TableHead>
                        <TableHead>Target Panel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.auditLogs && user.auditLogs.length > 0 ? (
                        user.auditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-semibold text-white">
                              {log.action}
                            </TableCell>
                            <TableCell className="text-gray-300 text-xs">{log.target}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                Successful
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-500 text-xs">{formatDate(log.timestamp)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-gray-500 text-xs">
                            No administrative audit records logged yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/[0.08] h-full flex flex-col justify-between">
              <CardHeader className="border-b border-white/[0.04] pb-4">
                <CardTitle className="text-md">Camera & Voice Translations</CardTitle>
                <CardDescription>Recent AI recognition queries from active mobile sessions.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <div className="overflow-x-auto w-full font-sans">
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
                      {user.translations && user.translations.length > 0 ? (
                        user.translations.map((trans) => (
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
                            <TableCell className="text-gray-500 text-xs">{formatDate(trans.timestamp)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-gray-500 text-xs">
                            No recent recognition telemetry logs found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
