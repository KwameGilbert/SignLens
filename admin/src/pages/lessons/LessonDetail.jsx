import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Sparkles, Award, Play, BrainCircuit, Activity,
  Trash2, Edit, CheckCircle, Video, FileText, Check, X,
  PlusCircle, MinusCircle, Loader2, AlertTriangle, Link2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useLessonDetailQuery, useUpdateLessonMutation, useDeleteLessonMutation } from "../../hooks/useLessons";
import { useQuizzesQuery } from "../../hooks/useQuizzes";
import { useCategoriesQuery } from "../../hooks/useCategories";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading, isError } = useLessonDetailQuery(id);
  const { data: allQuizzes = [] } = useQuizzesQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const updateLessonMutation = useUpdateLessonMutation(id);
  const deleteLessonMutation = useDeleteLessonMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState([]);
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const handleOpenEdit = () => {
    setEditTitle(lesson.title || "");
    setEditDescription(lesson.description || "");
    const steps = Array.isArray(lesson.instructions)
      ? lesson.instructions.map((s) => (typeof s === "string" ? s : s?.text || ""))
      : [];
    setEditContent(steps.length > 0 ? steps : [""]);
    setEditVideoUrl(lesson.lessonUrl || lesson.videoUrl || "");
    setEditCategoryId(String(lesson.categoryId || ""));
    setIsEditModalOpen(true);
  };

  const handleAddStep = () => setEditContent([...editContent, ""]);

  const handleRemoveStep = (index) => {
    if (editContent.length === 1) return;
    setEditContent(editContent.filter((_, idx) => idx !== index));
  };

  const handleStepValueChange = (index, value) => {
    const updated = [...editContent];
    updated[index] = value;
    setEditContent(updated);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    try {
      await updateLessonMutation.mutateAsync({
        title: editTitle.trim(),
        description: editDescription.trim(),
        categoryId: editCategoryId,
        lessonUrl: editVideoUrl.trim() || undefined,
        instructions: editContent
          .filter((s) => s.trim() !== "")
          .map((s) => ({ text: s })),
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update lesson:", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLessonMutation.mutateAsync(id);
      navigate("/lessons");
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4 text-orange-400" />;
      case "scan":  return <Play className="h-4 w-4 text-emerald-400" />;
      case "progress": return <Activity className="h-4 w-4 text-violet-400" />;
      default: return <FileText className="h-4 w-4 text-amber-400" />;
    }
  };

  // Derive quiz linked to this lesson
  const linkedQuiz = allQuizzes.find((q) => String(q.lessonId) === String(id));

  // Derive category name
  const categoryName =
    categories.find((c) => String(c.id) === String(lesson?.categoryId))?.name ||
    lesson?.categoryTitle ||
    "—";

  // Normalise instructions to an array of strings
  const instructions = (() => {
    const raw = lesson?.instructions;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((s) => (typeof s === "string" ? s : s?.text || ""));
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((s) => (typeof s === "string" ? s : s?.text || "")) : [];
    } catch {
      return [];
    }
  })();

  // ── Loading / Error States ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-400 text-sm">Loading lesson...</p>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
        <p className="text-rose-400 text-sm font-semibold">Failed to load lesson details.</p>
        <Button variant="ghost" onClick={() => navigate("/lessons")} className="text-gray-400 border border-white/10">
          ← Back to Lessons
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-white/[0.04] text-gray-400 hover:text-white" onClick={() => navigate("/lessons")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Lesson Details</h2>
          <p className="text-gray-400 text-sm">Review structure, contents, and connected checkpoints.</p>
        </div>
      </div>

      {/* Hero Summary */}
      <Card className="border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent">
        <div className="absolute inset-0 bg-[#080B11]/80 backdrop-blur-md -z-10" />
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {categoryName}
                </span>
                <span className="bg-white/[0.04] text-gray-300 border border-white/[0.08] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  {getMediaIcon(lesson.type)}
                  {(lesson.type || "video").toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{lesson.title}</h3>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{lesson.description || "No description provided."}</p>
              {lesson.lessonUrl || lesson.videoUrl ? (
                <a
                  href={lesson.lessonUrl || lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium mt-1"
                >
                  <Link2 className="h-3.5 w-3.5" /> View Lesson Video
                </a>
              ) : (
                <p className="text-xs text-gray-500 mt-1 italic">No video URL attached.</p>
              )}
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="ghost" onClick={handleOpenEdit} className="bg-transparent border border-primary/20 text-orange-400 hover:bg-primary/10 hover:border-primary/40 flex items-center gap-1.5">
                <Edit className="h-4 w-4" /> Edit Lesson
              </Button>
              <Button onClick={() => setIsDeleteModalOpen(true)} className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>




      {/* Detail Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Instruction Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-md">Interactive Learning Steps</CardTitle>
              <CardDescription>Instruction sequence displayed to users on the mobile app.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {instructions.length > 0 ? (
                <>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-xs font-extrabold text-primary/40 tracking-wider">
                      STEP {activeStep + 1} OF {instructions.length}
                    </div>
                    <div className="space-y-4">
                      <span className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-sm">
                        {activeStep + 1}
                      </span>
                      <p className="text-lg text-white font-semibold leading-relaxed">
                        "{instructions[activeStep]}"
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/[0.04]">
                      <Button variant="ghost" size="sm" disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)} className="text-xs hover:bg-white/[0.04]">Previous</Button>
                      <div className="flex gap-1.5">
                        {instructions.map((_, idx) => (
                          <button key={idx} onClick={() => setActiveStep(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeStep ? "w-6 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"}`} />
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" disabled={activeStep === instructions.length - 1} onClick={() => setActiveStep(p => p + 1)} className="text-xs hover:bg-white/[0.04]">Next</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Content Summary</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl transition-all">
                          <span className="text-xs font-bold text-primary shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">No instruction steps added yet.</div>
              )}
            </CardContent>
          </Card>

          {/* Connected Quiz */}
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04] flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-md">Connected Practice Quiz</CardTitle>
                <CardDescription>Validates understanding after completing steps.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {linkedQuiz ? (
                <div className="bg-[#080B11]/50 border border-white/[0.06] rounded-xl p-4 space-y-3">
                  <p className="text-white font-semibold text-sm leading-relaxed">
                    <span className="text-primary font-bold mr-1">Q:</span>
                    {linkedQuiz.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {(linkedQuiz.options || []).map((opt, i) => {
                      const isCorrect = opt.isCorrect;
                      return (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.02] border-white/[0.06] text-gray-400"}`}>
                          <span>{opt.name || opt}</span>
                          {isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">No quiz linked to this lesson yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Recent Activity (placeholder — no activity API yet) */}
        <div className="lg:col-span-1">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-md">Recent Study Activity</CardTitle>
              <CardDescription>User completions will appear here once tracking is active.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-gray-500 text-xs">
                      No recent studies recorded yet.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-lg font-bold text-white">Edit Lesson Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Lesson Title</label>
                <Input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled className="bg-[#080B11]">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#080B11]">{cat.name || cat.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Lesson Description</label>
                <textarea
                  required
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Video URL</label>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    className="pr-9"
                  />
                  <Link2 className="h-4 w-4 text-primary shrink-0 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Instruction Steps */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Instruction Steps</label>
                  <Button type="button" variant="ghost" size="sm" onClick={handleAddStep} className="text-primary hover:bg-primary/10 text-xs flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" /> Add Step
                  </Button>
                </div>
                <div className="space-y-2">
                  {editContent.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 shrink-0 w-4">{idx + 1}.</span>
                      <Input type="text" required value={step} onChange={(e) => handleStepValueChange(idx, e.target.value)} />
                      <button type="button" onClick={() => handleRemoveStep(idx)} disabled={editContent.length === 1} className="text-gray-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-gray-500">
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <Button type="button" variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={updateLessonMutation.isPending} className="bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20">
                  {updateLessonMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 mb-4">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Lesson?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">"{lesson.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmDelete} disabled={deleteLessonMutation.isPending} className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20">
                {deleteLessonMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
