import { useState } from "react";
import { Plus, Award, Ribbon, Flame, Zap, Trophy, Globe, BookOpen, X, Search, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const badgeIconsMap = {
  ribbon: Ribbon,
  flame: Flame,
  zap: Zap,
  book: BookOpen,
  trophy: Trophy,
  globe: Globe,
  award: Award,
};

const mockBadges = [
  {
    id: "1",
    title: "First Sign",
    desc: "Translated your very first sign language gesture using live AI camera.",
    xp: 250,
    color: "#F59E0B",
    iconName: "ribbon",
    trigger: "First camera translation query",
  },
  {
    id: "2",
    title: "7-Day Streak",
    desc: "Maintained an active daily learning streak for 7 consecutive days.",
    xp: 500,
    color: "#FB5607",
    iconName: "flame",
    trigger: "7 daily active logins",
  },
  {
    id: "3",
    title: "Quick Learner",
    desc: "Successfully completed 5 practice lessons with 100% perfect accuracy.",
    xp: 500,
    color: "#8B5CF6",
    iconName: "zap",
    trigger: "5 lesson completions with score = 100",
  },
];

const availableColors = [
  { label: "Amber / Yellow", value: "#F59E0B" },
  { label: "Orange / Fire", value: "#FB5607" },
  { label: "Violet / Purple", value: "#8B5CF6" },
  { label: "Blue / Ocean", value: "#3B82F6" },
  { label: "Pink / Rose", value: "#EC4899" },
  { label: "Emerald / Green", value: "#10B981" },
];

export default function Badges() {
  const [badges, setBadges] = useState(mockBadges);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Modal state & form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [xp, setXp] = useState(250);
  const [color, setColor] = useState("#F59E0B");
  const [iconName, setIconName] = useState("ribbon");
  const [trigger, setTrigger] = useState("");

  // Edit Modal state & form
  const [editBadge, setEditBadge] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editXp, setEditXp] = useState(250);
  const [editColor, setEditColor] = useState("#F59E0B");
  const [editIconName, setEditIconName] = useState("ribbon");
  const [editTrigger, setEditTrigger] = useState("");

  // Delete Confirmation state
  const [deleteBadge, setDeleteBadge] = useState(null);

  const resetForm = () => {
    setIsAddOpen(false);
    setTitle("");
    setDesc("");
    setXp(250);
    setColor("#F59E0B");
    setIconName("ribbon");
    setTrigger("");
  };

  const handleAddBadge = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || !trigger.trim()) return;

    const newBadge = {
      id: `badge-${Date.now()}`,
      title: title.trim(),
      desc: desc.trim(),
      xp: parseInt(xp, 10) || 0,
      color,
      iconName,
      trigger: trigger.trim(),
    };

    setBadges([...badges, newBadge]);
    resetForm();
  };

  const handleOpenEdit = (badge) => {
    setEditBadge(badge);
    setEditTitle(badge.title);
    setEditDesc(badge.desc);
    setEditXp(badge.xp);
    setEditColor(badge.color);
    setEditIconName(badge.iconName || "award");
    setEditTrigger(badge.trigger);
  };

  const handleSaveBadge = (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDesc.trim() || !editTrigger.trim()) return;

    const updatedBadges = badges.map((b) => {
      if (b.id === editBadge.id) {
        return {
          ...b,
          title: editTitle.trim(),
          desc: editDesc.trim(),
          xp: parseInt(editXp, 10) || 0,
          color: editColor,
          iconName: editIconName,
          trigger: editTrigger.trim(),
        };
      }
      return b;
    });

    setBadges(updatedBadges);
    setEditBadge(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteBadge) {
      setBadges(badges.filter((b) => b.id !== deleteBadge.id));
      setDeleteBadge(null);
    }
  };

  const filteredBadges = badges.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.trigger.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Achievement System</h2>
          <p className="text-gray-400 text-sm">Configure mobile badges, gamification milestones, and XP values.</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="flex items-center gap-2 shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary-deep text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Badge
        </Button>
      </div>

      <Card className="border-white/[0.08] shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
          <div>
            <CardTitle>Mobile Badges</CardTitle>
            <CardDescription>Configure user rewards displayed on the Trophy Room screen.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search badges..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Badge</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>XP Award</TableHead>
                  <TableHead>System Trigger Requirement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBadges.length > 0 ? (
                  filteredBadges.map((badge) => {
                    const Icon = badgeIconsMap[badge.iconName] || Award;
                    return (
                      <TableRow key={badge.id}>
                        <TableCell className="font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-xl border border-white/5 shrink-0"
                              style={{ backgroundColor: `${badge.color}15`, color: badge.color }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-bold text-white block truncate max-w-[150px]">{badge.title}</span>
                              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">ID: {badge.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs max-w-xs leading-relaxed">{badge.desc}</TableCell>
                        <TableCell className="text-primary font-bold text-sm shrink-0 whitespace-nowrap">{badge.xp} XP</TableCell>
                        <TableCell className="text-gray-400 text-xs">{badge.trigger}</TableCell>
                        <TableCell className="text-right space-x-2 shrink-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-white/[0.04] text-gray-300 hover:text-white"
                            onClick={() => handleOpenEdit(badge)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            onClick={() => setDeleteBadge(badge)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No badges found matching your query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Badge Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Add New Achievement Badge
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white transition-all cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBadge} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Badge Title</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Speed Demon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain how users unlock this badge..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">XP Award</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 500"
                    value={xp}
                    onChange={(e) => setXp(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Display Icon</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ribbon" className="bg-[#080B11]">Ribbon</option>
                    <option value="flame" className="bg-[#080B11]">Flame</option>
                    <option value="zap" className="bg-[#080B11]">Zap</option>
                    <option value="book" className="bg-[#080B11]">Book Open</option>
                    <option value="trophy" className="bg-[#080B11]">Trophy</option>
                    <option value="globe" className="bg-[#080B11]">Globe</option>
                    <option value="award" className="bg-[#080B11]">Award Badge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Accent Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {availableColors.map((c) => (
                      <option key={c.value} value={c.value} className="bg-[#080B11]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Trigger Condition</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. 10 translations"
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20"
                >
                  Create Badge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Badge Modal */}
      {editBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Edit Achievement Badge
              </h3>
              <button onClick={() => setEditBadge(null)} className="text-gray-400 hover:text-white transition-all cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBadge} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Badge Title</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Speed Demon"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain how users unlock this badge..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">XP Award</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 500"
                    value={editXp}
                    onChange={(e) => setEditXp(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Display Icon</label>
                  <select
                    value={editIconName}
                    onChange={(e) => setEditIconName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ribbon" className="bg-[#080B11]">Ribbon</option>
                    <option value="flame" className="bg-[#080B11]">Flame</option>
                    <option value="zap" className="bg-[#080B11]">Zap</option>
                    <option value="book" className="bg-[#080B11]">Book Open</option>
                    <option value="trophy" className="bg-[#080B11]">Trophy</option>
                    <option value="globe" className="bg-[#080B11]">Globe</option>
                    <option value="award" className="bg-[#080B11]">Award Badge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Accent Color</label>
                  <select
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {availableColors.map((c) => (
                      <option key={c.value} value={c.value} className="bg-[#080B11]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Trigger Condition</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. 10 translations"
                    value={editTrigger}
                    onChange={(e) => setEditTrigger(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" 
                  onClick={() => setEditBadge(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 animate-in">
          <div className="w-full max-w-md bg-[#0D121F] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Badge</h3>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              Are you sure you want to delete the badge <strong className="text-white">{deleteBadge.title}</strong>? 
              This will remove it from all users' trophy rooms. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={() => setDeleteBadge(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete Badge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
