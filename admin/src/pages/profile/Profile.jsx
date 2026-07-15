import { useState } from "react";
import { User, ShieldCheck, Mail, Phone, Lock, Save, CheckCircle2, Sliders, BellRing, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("account"); // "account", "security", "preferences"
  
  // Account Details form states
  const [name, setName] = useState("Kwame Gilbert");
  const [email, setEmail] = useState("kwame@signlens.com");
  const [phone, setPhone] = useState("+233 24 123 4567");
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Security form states
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences form states
  const [prefEmailDigest, setPrefEmailDigest] = useState(true);
  const [prefSystemAlarms, setPrefSystemAlarms] = useState(true);
  const [prefAutoSync, setPrefAutoSync] = useState(false);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    setFeedbackMsg({ type: "success", text: "Profile details updated successfully." });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedbackMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setFeedbackMsg({ type: "success", text: "Security credentials saved." });
    setCurrPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setFeedbackMsg({ type: "success", text: "Dashboard preferences updated." });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Account Console</h2>
        <p className="text-gray-400 text-sm">Manage dashboard settings, update security keys, and manage preferences.</p>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-4 ${
          feedbackMsg.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Profile Summary Drawer Header */}
      <Card className="border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent">
        <div className="absolute inset-0 bg-[#080B11]/70 backdrop-blur-md -z-10" />
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-2xl relative shrink-0">
                {name.charAt(0)}
                <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#080B11] rounded-lg">
                  <div className="h-4.5 w-4.5 bg-emerald-500 rounded-md border border-emerald-400/30 flex items-center justify-center">
                    <ShieldCheck className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-bold text-white leading-none">{name}</h3>
                  <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-sm text-gray-400">{email}</p>
                <p className="text-xs text-gray-500">System Clearance: Level 3 Administrator Access</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin quick status metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-white/[0.08] hover:border-purple-500/20 transition-all duration-300">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clearance Group</p>
              <h4 className="text-lg font-black text-white mt-1">Level 3 Clearance</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] hover:border-blue-500/20 transition-all duration-300">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 shrink-0">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Logged Actions</p>
              <h4 className="text-lg font-black text-white mt-1">24 Console Actions</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] hover:border-emerald-500/20 transition-all duration-300">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Session Key Status</p>
              <h4 className="text-lg font-black text-white mt-1">Authorized (Active)</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs configuration drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Sidebar Sub-navigation Selector */}
        <div className="lg:col-span-1">
          <Card className="border-white/[0.08]">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {[
                  { id: "account", label: "Account Profile", icon: User },
                  { id: "security", label: "Security & Keys", icon: Lock },
                  { id: "preferences", label: "Preferences", icon: BellRing }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all relative cursor-pointer ${
                        isActive 
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                          : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Tab View Container */}
        <div className="lg:col-span-3">
          {activeTab === "account" && (
            <Card className="border-white/[0.08]">
              <CardHeader className="border-b border-white/[0.04]">
                <CardTitle>Account Profile Details</CardTitle>
                <CardDescription>Configure core metadata credentials linked to Kwame's administrator account.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                      <Input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Role Level Clearance</label>
                      <Input
                        type="text"
                        disabled
                        value="Super Admin (Read-only)"
                        className="bg-white/[0.02] border-white/10 text-gray-400 opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04] mt-6">
                    <Button type="submit" className="flex items-center gap-1.5 bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20">
                      <Save className="h-4 w-4" />
                      Save Details
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-white/[0.08]">
              <CardHeader className="border-b border-white/[0.04]">
                <CardTitle>Security & Access Keys</CardTitle>
                <CardDescription>Reset account verification passwords.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSaveSecurity} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Current Password</label>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">New Password</label>
                      <Input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Confirm New Password</label>
                      <Input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04] mt-6">
                    <Button type="submit" className="flex items-center gap-1.5 bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20">
                      <Save className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card className="border-white/[0.08]">
              <CardHeader className="border-b border-white/[0.04]">
                <CardTitle>Dashboard Preferences</CardTitle>
                <CardDescription>Configure core system notifications and background triggers.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSavePreferences} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] gap-4">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold text-white block">Email Action Digests</label>
                        <span className="text-xs text-gray-400 leading-relaxed block max-w-md">Receive automatic daily email digests documenting mobile client actions and translation rates.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefEmailDigest} 
                        onChange={(e) => setPrefEmailDigest(e.target.checked)}
                        className="w-4 h-4 text-primary bg-[#0D121F] border-white/10 rounded focus:ring-primary focus:ring-2 cursor-pointer mt-1"
                      />
                    </div>

                    <div className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] gap-4">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold text-white block">Critical Latency Alarms</label>
                        <span className="text-xs text-gray-400 leading-relaxed block max-w-md">Synchronize alert notifications for server translation response lags directly in top layout panel.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefSystemAlarms} 
                        onChange={(e) => setPrefSystemAlarms(e.target.checked)}
                        className="w-4 h-4 text-primary bg-[#0D121F] border-white/10 rounded focus:ring-primary focus:ring-2 cursor-pointer mt-1"
                      />
                    </div>

                    <div className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] gap-4">
                      <div className="space-y-0.5">
                        <label className="text-sm font-semibold text-white block">Background Sync Logs</label>
                        <span className="text-xs text-gray-400 leading-relaxed block max-w-md">Force automatic silent background consolidation of user achievement streaks and badge reward updates.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefAutoSync} 
                        onChange={(e) => setPrefAutoSync(e.target.checked)}
                        className="w-4 h-4 text-primary bg-[#0D121F] border-white/10 rounded focus:ring-primary focus:ring-2 cursor-pointer mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04] mt-6">
                    <Button type="submit" className="flex items-center gap-1.5 bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20">
                      <Save className="h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
