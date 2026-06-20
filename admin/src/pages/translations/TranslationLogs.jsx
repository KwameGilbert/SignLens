import { useState } from "react";
import { Camera, Mic, Sparkles, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";

const mockTranslations = [
  { id: "t1", query: "Hello", mode: "Camera", confidence: 98.4, status: "Success", timestamp: "2026-06-20 09:12:04" },
  { id: "t2", query: "Can you help me?", mode: "Voice", confidence: 95.1, status: "Success", timestamp: "2026-06-20 08:44:12" },
  { id: "t3", query: "Wait", mode: "Camera", confidence: 71.3, status: "Low Confidence", timestamp: "2026-06-20 08:32:55" },
  { id: "t4", query: "Family", mode: "Camera", confidence: 42.0, status: "Failed", timestamp: "2026-06-20 07:12:31" },
];

export default function TranslationLogs() {
  const [filterMode, setFilterMode] = useState("All");

  const filteredLogs = mockTranslations.filter(
    (log) => filterMode === "All" || log.mode === filterMode
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Translation Telemetry</h2>
        <p className="text-gray-400 text-sm">Real-time logs of AI gesture translations queried from mobile client sessions.</p>
      </div>

      <Card className="border-white/[0.08]">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
          <div>
            <CardTitle>Recognition Logs</CardTitle>
            <CardDescription>Live tracking of API translation outputs and engine confidence metrics.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1.5"><Filter className="h-3.5 w-3.5"/> Filter:</span>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-white/[0.02] border border-white/10 rounded-lg text-xs text-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All" className="bg-[#080B11]">All Modes</option>
              <option value="Camera" className="bg-[#080B11]">Camera Only</option>
              <option value="Voice" className="bg-[#080B11]">Voice Only</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query / Sign Name</TableHead>
                <TableHead>Translation Mode</TableHead>
                <TableHead>Confidence Rating</TableHead>
                <TableHead>Resolution Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-semibold text-white">{log.query}</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-1.5">
                      {log.mode === "Camera" ? <Camera className="h-3.5 w-3.5 text-primary" /> : <Mic className="h-3.5 w-3.5 text-violet-400" />}
                      {log.mode}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            log.confidence >= 90
                              ? "bg-emerald-500"
                              : log.confidence >= 70
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${log.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs">{log.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        log.status === "Success"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : log.status === "Low Confidence"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400 text-xs">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
