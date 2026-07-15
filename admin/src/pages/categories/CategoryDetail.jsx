import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, School, Calculator, Heart, FolderOpen, MessageSquare, Smile, MessageCircle, Star, Award, BookOpen, Activity, Plus, Trash2, Edit, Eye, CheckCircle, Save, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const categoryMetadata = {
  "basics": { title: "Basics", slug: "basics", icon: "school", completions: 1540, progress: 85 },
  "alphabets": { title: "Alphabets", slug: "alphabets", icon: "school", completions: 1240, progress: 75 },
  "numbers": { title: "Numbers", slug: "numbers", icon: "calculator", completions: 820, progress: 65 },
  "common-phrases": { title: "Common Phrases", slug: "common-phrases", icon: "message-square", completions: 320, progress: 15 },
  "emotions": { title: "Emotions", slug: "emotions", icon: "smile", completions: 450, progress: 65 },
  "conversation": { title: "Conversation", slug: "conversation", icon: "message-circle", completions: 120, progress: 5 },
  "advanced-signs": { title: "Advanced Signs", slug: "advanced-signs", icon: "star", completions: 45, progress: 10 }
};

const mockLessons = [
  { id: "lesson-alpha-a-f", categorySlug: "alphabets", title: "Alphabet Signs A-F", type: "Video", completions: 1240, avgScore: 92, date: "2026-06-10" },
  { id: "lesson-alpha-g-z", categorySlug: "alphabets", title: "Alphabet Signs G-Z", type: "Scanner", completions: 980, avgScore: 88, date: "2026-06-12" },
  { id: "lesson-num-0-5", categorySlug: "numbers", title: "Numbers 0-5", type: "Video", completions: 820, avgScore: 94, date: "2026-06-14" },
  { id: "lesson-num-6-10", categorySlug: "numbers", title: "Numbers 6-10", type: "Scanner", completions: 540, avgScore: 85, date: "2026-06-16" },
  { id: "lesson-phrase-greetings", categorySlug: "common-phrases", title: "Greetings", type: "Video", completions: 320, avgScore: 90, date: "2026-06-18" },
  { id: "lesson-phrase-essentials", categorySlug: "common-phrases", title: "Essential Phrases", type: "Scanner", completions: 210, avgScore: 82, date: "2026-06-19" },
  { id: "lesson-emotion-happy-sad", categorySlug: "emotions", title: "Happy & Sad", type: "Video", completions: 450, avgScore: 88, date: "2026-06-15" },
];

const iconMap = {
  "school": School,
  "calculator": Calculator,
  "heart": Heart,
  "message-square": MessageSquare,
  "smile": Smile,
  "message-circle": MessageCircle,
  "star": Star,
  "folder": FolderOpen
};

export default function CategoryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const category = categoryMetadata[slug] || {
    title: slug ? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Custom Category",
    slug: slug || "custom-category",
    icon: "folder",
    completions: 0,
    progress: 0
  };

  const [editTitle, setEditTitle] = useState(category.title);
  const [editIcon, setEditIcon] = useState(category.icon);
  const [isEditing, setIsEditing] = useState(false);

  // Lesson management local mock state
  const [lessonsList, setLessonsList] = useState(mockLessons);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const categoryLessons = lessonsList.filter(l => l.categorySlug === slug);

  const handleSaveMetadata = (e) => {
    e.preventDefault();
    category.title = editTitle;
    category.icon = editIcon;
    setIsEditing(false);
  };

  const handleCreateLesson = (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !videoFile) return;

    const newLesson = {
      id: `lesson-${newLessonTitle.toLowerCase().trim().replace(/[\s_]+/g, "-")}`,
      categorySlug: slug,
      title: newLessonTitle.trim(),
      type: "Video",
      completions: 0,
      avgScore: 0,
      date: new Date().toISOString().split("T")[0]
    };

    setLessonsList([...lessonsList, newLesson]);
    setNewLessonTitle("");
    setVideoFile(null);
  };

  const handleDeleteLesson = (id) => {
    setLessonsList(lessonsList.filter(l => l.id !== id));
  };

  const IconComponent = iconMap[category.icon] || FolderOpen;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/[0.04] text-gray-400 hover:text-white"
          onClick={() => navigate("/categories")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Category Details</h2>
          <p className="text-gray-400 text-sm">Review category details, linked lessons, and study progress rates.</p>
        </div>
      </div>

      {/* Hero Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Information & Edit Side-Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-white/[0.08] relative overflow-hidden bg-gradient-to-b from-orange-500/10 via-transparent to-transparent">
            <CardHeader className="border-b border-white/[0.04] pb-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white">Category Profile</CardTitle>
                  <CardDescription className="text-xs">Edit category parameters.</CardDescription>
                </div>
              </div>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-xs hover:bg-white/[0.04] text-gray-300">
                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleSaveMetadata} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Category Name</label>
                    <Input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Display Icon</label>
                    <select
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="school">School / Educate</option>
                      <option value="calculator">Calculator / Numbers</option>
                      <option value="heart">Heart / Emotions</option>
                      <option value="message-square">Chat / Phrase</option>
                      <option value="smile">Smile / Moods</option>
                      <option value="message-circle">Bubble / Chat</option>
                      <option value="star">Star / Achievements</option>
                      <option value="folder">Folder / Generic</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="ghost" size="sm" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" size="sm" className="bg-primary hover:bg-primary-deep text-white flex items-center gap-1.5">
                      <Save className="h-3.5 w-3.5" /> Save
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-gray-400 font-medium">Name:</span>
                    <span className="text-white font-bold">{category.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-gray-400 font-medium">Slug ID:</span>
                    <code className="text-primary text-xs bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-bold">{category.slug}</code>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-gray-400 font-medium">Icon Key:</span>
                    <span className="text-gray-300 font-bold">{category.icon}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-400 font-medium">Mobile Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Synced to Production
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-white/[0.08]">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Completions</p>
                  <h4 className="text-2xl font-black text-white mt-1">{category.completions} Completions</h4>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/[0.08]">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Completion Rate</p>
                  <h4 className="text-2xl font-black text-white mt-1">{category.progress}% Done</h4>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Columns: Connected Lessons List & Add Lesson Quick Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-white">Connected Lessons Directory</CardTitle>
              <CardDescription>Lessons in this specific learning module checkpoints.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lesson Title</TableHead>
                      <TableHead>Media Mode</TableHead>
                      <TableHead>Completions</TableHead>
                      <TableHead>Avg Quiz Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryLessons.length > 0 ? (
                      categoryLessons.map((lesson) => (
                        <TableRow key={lesson.id}>
                          <TableCell className="font-semibold text-white">{lesson.title}</TableCell>
                          <TableCell className="text-gray-300 text-xs">
                            <code className="bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06] text-gray-400">
                              {lesson.type}
                            </code>
                          </TableCell>
                          <TableCell className="text-gray-400 font-semibold">{lesson.completions} completions</TableCell>
                          <TableCell className="text-emerald-400 font-bold">{lesson.avgScore > 0 ? `${lesson.avgScore}%` : "Not graded"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Link to={`/lessons/${lesson.id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white inline-flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                          No lessons linked to this category yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Create Lesson for Category */}
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Lesson to Category
              </CardTitle>
              <CardDescription>Directly register a check-point lesson under this active stream module.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateLesson} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-6">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Lesson Title</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Dialogue Practice"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-3">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Upload Video File</label>
                  <div className="relative h-10 flex items-center justify-between border border-white/10 rounded-md bg-white/[0.02] px-3 py-2 text-sm text-gray-400">
                    <input
                      type="file"
                      required
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span className="truncate">{videoFile ? videoFile.name : "Choose MP4..."}</span>
                    <Video className="h-4 w-4 text-primary shrink-0" />
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-3">
                  <Button type="submit" className="bg-primary hover:bg-primary-deep text-white w-full shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-1.5 h-10">
                    <Plus className="h-4 w-4" /> Add Video Lesson
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
