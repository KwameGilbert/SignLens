import { useState } from "react";
import { Plus, Folder } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";

const mockLessons = [
  { id: "1", title: "Basic Greetings", category: "Basics", type: "Video", uploadedAt: "2026-06-10" },
  { id: "2", title: "Alphabet A-Z", category: "Basics", type: "Image", uploadedAt: "2026-06-12" },
  { id: "3", title: "Numbers 1-10", category: "Numbers", type: "Video", uploadedAt: "2026-06-14" },
];

export default function Lessons() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Lesson Management</h2>
          <p className="text-gray-400 text-sm">Upload and organize sign language lessons.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-lg hover:shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add New Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="flex items-center gap-2 text-md">
                <Folder className="h-5 w-5 text-primary" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2.5 text-sm">
                <li className="cursor-pointer text-primary font-bold bg-primary/10 px-2 py-1.5 rounded-lg">All Lessons</li>
                <li className="cursor-pointer text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] px-2 py-1.5 rounded-lg transition-all">Basics</li>
                <li className="cursor-pointer text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] px-2 py-1.5 rounded-lg transition-all">Numbers</li>
                <li className="cursor-pointer text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] px-2 py-1.5 rounded-lg transition-all">Family</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle>Lessons</CardTitle>
              <CardDescription>All video, image, and text lessons uploaded to the mobile app.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-semibold text-white">{lesson.title}</TableCell>
                      <TableCell className="text-gray-300">{lesson.category}</TableCell>
                      <TableCell className="text-gray-400">{lesson.type}</TableCell>
                      <TableCell className="text-gray-400">{lesson.uploadedAt}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
