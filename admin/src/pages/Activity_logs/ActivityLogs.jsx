import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { useActivityLogsQuery } from "../../hooks/useActivityLogs";
import { useUsersQuery } from "../../hooks/useUsers";

export default function ActivityLogs() {
  const { data: logs = [], isLoading, error } = useActivityLogsQuery();
  const { data: users = [] } = useUsersQuery();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Activity Logs</h2>
        <p className="text-gray-400 text-sm">Administrative audit trails and core system syncing logs.</p>
      </div>

      <Card className="border-white/[0.08]">
        <CardHeader className="border-b border-white/[0.04]">
          <CardTitle>System Audit Log</CardTitle>
          <CardDescription>Track modifications to lessons, achievements, and structural parameters.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-gray-400 text-sm">Loading activity logs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
              <p className="text-rose-400 text-sm font-semibold">
                {error?.response?.data?.message || error?.message || "Failed to load activity logs."}
              </p>
            </div>
          ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User / Trigger</TableHead>
                  <TableHead>Event Description</TableHead>
                  <TableHead>Action Category</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => {
                    const adminUser = users.find(u => String(u.id) === String(log.userId));
                    const adminName = adminUser ? `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || adminUser.email : (log.userId === 0 ? "System" : "Unknown User");
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-semibold text-white">{adminName}</TableCell>
                        <TableCell className="text-gray-300">{log.eventDescription}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              log.category?.toLowerCase() === "content"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : log.category?.toLowerCase() === "quiz"
                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                : "bg-white/[0.04] text-gray-400 border border-white/[0.08]"
                            }`}
                          >
                            {log.category || "Unknown"}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400 text-xs">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
