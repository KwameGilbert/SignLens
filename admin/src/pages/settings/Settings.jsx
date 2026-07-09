import { useState, useEffect } from "react";
import { Save, Shield, Sliders, Cpu, Link, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSettingsQuery, useUpdateSettingMutation } from "../../hooks/useSettings";

export default function Settings() {
  const { data: settingsData = [], isLoading, error } = useSettingsQuery();
  const updateSetting = useUpdateSettingMutation();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formValues, setFormValues] = useState({
    SERVICE_ENDPOINT: "",
    CDN_BUCKET: "",
    CONFIDENCE_CUTOFF: "",
    DEFAULT_ACCENT: "",
    CONTACT_EMAIL: "",
    UPDATE_PASSWORD: "",
  });

  useEffect(() => {
    if (settingsData && settingsData.length > 0) {
      const mapped = {};
      settingsData.forEach(setting => {
        mapped[setting.key] = setting.value;
      });
      setFormValues(prev => ({ ...prev, ...mapped }));
    }
  }, [settingsData]);

  const handleChange = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Create an array of update promises for keys that aren't UPDATE_PASSWORD
      // In a real app, password should go to a specific auth endpoint, but we map it to settings API for now if requested.
      const promises = Object.entries(formValues)
        .filter(([key, value]) => key !== 'UPDATE_PASSWORD' && value !== undefined && value !== "")
        .map(([key, value]) => updateSetting.mutateAsync({ key, value }));
      
      await Promise.all(promises);
      
      // Handle password update if provided (assuming the API supports it via settings or needs another route)
      if (formValues.UPDATE_PASSWORD) {
        await updateSetting.mutateAsync({ key: 'ADMIN_PASSWORD', value: formValues.UPDATE_PASSWORD });
        setFormValues(prev => ({ ...prev, UPDATE_PASSWORD: "" })); // clear after save
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-400 text-sm">Loading configurations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
        <p className="text-rose-400 text-sm font-semibold">
          {error?.response?.data?.message || error?.message || "Failed to load settings."}
        </p>
      </div>
    );
  }
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
                <Input 
                  type="url" 
                  placeholder="e.g. https://api.signlens.dev/v2" 
                  value={formValues.SERVICE_ENDPOINT}
                  onChange={(e) => handleChange('SERVICE_ENDPOINT', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Media Upload CDN Bucket</label>
                <Input 
                  type="text" 
                  placeholder="e.g. s3://bucket-name" 
                  value={formValues.CDN_BUCKET}
                  onChange={(e) => handleChange('CDN_BUCKET', e.target.value)}
                />
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
                <Input 
                  type="number" 
                  placeholder="Enter percentage (10-100)" 
                  min={10} max={100} 
                  value={formValues.CONFIDENCE_CUTOFF}
                  onChange={(e) => handleChange('CONFIDENCE_CUTOFF', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Default Voice Output Accent</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formValues.DEFAULT_ACCENT}
                  onChange={(e) => handleChange('DEFAULT_ACCENT', e.target.value)}
                >
                  <option value="" className="bg-[#080B11]" disabled>Select default accent...</option>
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
                <Input 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={formValues.CONTACT_EMAIL}
                  onChange={(e) => handleChange('CONTACT_EMAIL', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Update Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formValues.UPDATE_PASSWORD}
                  onChange={(e) => handleChange('UPDATE_PASSWORD', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        {saveSuccess && (
          <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
            <CheckCircle2 className="h-4 w-4" />
            Configurations Saved
          </span>
        )}
        <Button 
          variant="ghost" 
          className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white"
          onClick={() => {
            if (settingsData) {
              const mapped = {};
              settingsData.forEach(setting => { mapped[setting.key] = setting.value; });
              setFormValues(prev => ({ ...prev, ...mapped, UPDATE_PASSWORD: "" }));
            }
          }}
          disabled={isSaving}
        >
          Discard Changes
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2 shadow-lg hover:shadow-primary/20"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? "Saving..." : "Save Configurations"}
        </Button>
      </div>
    </div>
  );
}
