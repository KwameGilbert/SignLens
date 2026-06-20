import { Save, Shield, Sliders, Cpu, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function Settings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Settings</h2>
        <p className="text-gray-400 text-sm">Manage configuration keys, AI thresholds, and general parameters.</p>
      </div>

      <div className="space-y-6">
        {/* API Settings */}
        <Card className="border-white/[0.08]">
          <CardHeader className="border-b border-white/[0.04]">
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              API Endpoints
            </CardTitle>
            <CardDescription>Setup server connections for the admin and mobile applications.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">SignLens Service Endpoint</label>
                <Input type="url" defaultValue="https://api.signlens.dev/v2" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Media Upload CDN Bucket</label>
                <Input type="text" defaultValue="s3://signlens-learning-assets-prod" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Thresholds */}
        <Card className="border-white/[0.08]">
          <CardHeader className="border-b border-white/[0.04]">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-violet-400" />
              AI Recognition & Speech Parameters
            </CardTitle>
            <CardDescription>Calibrate sign translation levels and device parameters.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Confidence Cutoff Ratio (%)</label>
                <Input type="number" defaultValue={75} min={10} max={100} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Default Voice Output Accent</label>
                <select className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="en-US" className="bg-[#080B11]">English (US)</option>
                  <option value="en-GB" className="bg-[#080B11]">English (UK)</option>
                  <option value="es-ES" className="bg-[#080B11]">Spanish (ES)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="border-white/[0.08]">
          <CardHeader className="border-b border-white/[0.04]">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Administrator Credentials
            </CardTitle>
            <CardDescription>Update accounts security profile credentials.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Contact Email</label>
                <Input type="email" defaultValue="admin@signlens.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Update Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white">Discard Changes</Button>
        <Button className="flex items-center gap-2 shadow-lg hover:shadow-primary/20">
          <Save className="h-4 w-4" />
          Save Configurations
        </Button>
      </div>
    </div>
  );
}
