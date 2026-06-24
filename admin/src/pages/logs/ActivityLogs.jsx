import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";

const mockActivityLogs = [
  { id: "l1", admin: "Admin User", action: "Uploaded lesson 'Basic Greetings'", category: "Content", timestamp: "2026-06-20 09:20:11" },
  { id: "l2", admin: "Admin User", action: "Modified quiz question for 'Numbers 1-10'", category: "Quiz", timestamp: "2026-06-20 09:12:44" },
  { id: "l3", admin: "System", action: "Synced learning content cache with mobile client CDN", category: "System", timestamp: "2026-06-20 08:00:00" },
  { id: "l4", admin: "Admin User", action: "Updated model config confidence settings", category: "Config", timestamp: "2026-06-20 07:15:32" },
];

export default function ActivityLogs() {
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
                {mockActivityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-semibold text-white">{log.admin}</TableCell>
                    <TableCell className="text-gray-300">{log.action}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          log.category === "Content"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : log.category === "Quiz"
                            ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                            : "bg-white/[0.04] text-gray-400 border border-white/[0.08]"
                        }`}
                      >
                        {log.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
