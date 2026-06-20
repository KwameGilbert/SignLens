import { Plus, Award, Ribbon, Flame, Zap, Trophy, Globe, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";

const badgeIcons = {
  "1": Ribbon,
  "2": Flame,
  "3": Zap,
  "4": BookOpen,
  "5": Trophy,
  "6": Globe,
};

const mockBadges = [
  {
    id: "1",
    title: "First Sign",
    desc: "Translated your very first sign language gesture using live AI camera.",
    xp: 250,
    color: "#F59E0B",
    trigger: "First camera translation query",
  },
  {
    id: "2",
    title: "7-Day Streak",
    desc: "Maintained an active daily learning streak for 7 consecutive days.",
    xp: 500,
    color: "#FB5607",
    trigger: "7 daily active logins",
  },
  {
    id: "3",
    title: "Quick Learner",
    desc: "Successfully completed 5 practice lessons with 100% perfect accuracy.",
    xp: 500,
    color: "#8B5CF6",
    trigger: "5 lesson completions with score = 100",
  },
];

export default function Badges() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Achievement System</h2>
          <p className="text-gray-400 text-sm">Configure mobile badges, gamification milestones, and XP values.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-lg hover:shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Badge
        </Button>
      </div>

      <Card className="border-white/[0.08]">
        <CardHeader className="border-b border-white/[0.04]">
          <CardTitle>Mobile Badges</CardTitle>
          <CardDescription>Configure user rewards displayed on the Trophy Room screen.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
              {mockBadges.map((badge) => {
                const Icon = badgeIcons[badge.id] || Award;
                return (
                  <TableRow key={badge.id}>
                    <TableCell className="font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-xl border border-white/5"
                          style={{ backgroundColor: `${badge.color}15`, color: badge.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{badge.title}</span>
                          <span className="text-[10px] text-gray-500 font-semibold uppercase">ID: {badge.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs max-w-xs">{badge.desc}</TableCell>
                    <TableCell className="text-primary font-bold">{badge.xp} XP</TableCell>
                    <TableCell className="text-gray-400 text-xs">{badge.trigger}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">Delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
