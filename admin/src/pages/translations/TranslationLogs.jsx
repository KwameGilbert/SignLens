import { useState } from "react";
import { Camera, Mic, Sparkles, Filter, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { useTranslationsQuery } from "../../hooks/useTranslations";

export default function TranslationLogs() {
  const [filterMode, setFilterMode] = useState("All");
  const { data: fetchedTranslations = [], isLoading, error } = useTranslationsQuery();

  const filteredLogs = fetchedTranslations.filter(
    (log) => filterMode === "All" || log.mode?.toLowerCase() === filterMode.toLowerCase()
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-gray-400 text-sm">Loading translation logs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
              <p className="text-rose-400 text-sm font-semibold">
                {error?.response?.data?.message || error?.message || "Failed to load translation logs."}
              </p>
            </div>
          ) : (
          <div className="overflow-x-auto w-full">
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
                    <TableCell className="font-semibold text-white">{log.prediction || "Unknown"}</TableCell>
                    <TableCell className="text-gray-300 capitalize">
                      <div className="flex items-center gap-1.5">
                        {log.mode?.toLowerCase() === "camera" ? <Camera className="h-3.5 w-3.5 text-primary" /> : <Mic className="h-3.5 w-3.5 text-violet-400" />}
                        {log.mode || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (log.confidence > 1 ? log.confidence : log.confidence * 100) >= 90
                                ? "bg-emerald-500"
                                : (log.confidence > 1 ? log.confidence : log.confidence * 100) >= 70
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${(log.confidence > 1 ? log.confidence : log.confidence * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs">{(log.confidence > 1 ? log.confidence : log.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          log.resolutionStatus?.toLowerCase() === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : log.resolutionStatus?.toLowerCase() === "low confidence"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {log.resolutionStatus || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
