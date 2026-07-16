import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Sparkles, Award, Play, Eye, BrainCircuit, Activity, Trash2, Edit, CheckCircle, Video, Image, FileText, Check, X, PlusCircle, MinusCircle, Loader2, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useLessonDetailQuery, useUpdateLessonMutation } from "../../hooks/useLessons";
import { useCategoriesQuery } from "../../hooks/useCategories";
import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const { data: fetchedLesson, isLoading: isLoadingLesson, error: lessonError } = useLessonDetailQuery(id);
  const { data: categories = [] } = useCategoriesQuery();

  const { data: quizzesList = [], isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['quizzes', { lessonId: id }],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.QUIZZES.LIST, { params: { lessonId: id } });
      return data?.data || data;
    },
    enabled: !!id,
  });

  const updateLessonMutation = useUpdateLessonMutation(id);

  const [activeStep, setActiveStep] = useState(0);

  // Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState([]);
  const [editMediaKey, setEditMediaKey] = useState("learn");
  const [editQuizQuestion, setEditQuizQuestion] = useState("");
  const [editQuizOptions, setEditQuizOptions] = useState([]);
  const [editQuizCorrectIndex, setEditQuizCorrectIndex] = useState(0);
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editSourceType, setEditSourceType] = useState("url"); // "url" or "file"
  const [editLessonUrl, setEditLessonUrl] = useState("");

  const handleOpenEdit = () => {
    if (!fetchedLesson) return;
    setEditTitle(fetchedLesson.title);
    setEditDescription(fetchedLesson.description || "");
    setEditContent(
      fetchedLesson.instructions
        ? fetchedLesson.instructions.map(i => typeof i === 'string' ? i : i.text)
        : []
    );
    setEditMediaKey(fetchedLesson.type || "learn");
    
    // Quiz mapping
    const quizObj = quizzesList?.[0];
    setEditQuizQuestion(quizObj ? quizObj.question : "");
    setEditQuizOptions(
      quizObj && quizObj.options && quizObj.options.length > 0
        ? quizObj.options.map(o => o.name)
        : ["", "", "", ""]
    );
    setEditQuizCorrectIndex(
      quizObj && quizObj.options
        ? Math.max(0, quizObj.options.findIndex(o => o.isCorrect))
        : 0
    );
    
    setEditLessonUrl(fetchedLesson.lessonUrl || "");
    setEditVideoFile(null);
    setEditSourceType("url");
    setIsEditModalOpen(true);
  };

  const handleAddStep = () => {
    setEditContent([...editContent, ""]);
  };

  const handleRemoveStep = (index) => {
    if (editContent.length === 1) return;
    setEditContent(editContent.filter((_, idx) => idx !== index));
  };

  const handleStepValueChange = (index, value) => {
    const updated = [...editContent];
    updated[index] = value;
    setEditContent(updated);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...editQuizOptions];
    updated[index] = value;
    setEditQuizOptions(updated);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!fetchedLesson) return;

    // 1. Build FormData for lesson update
    const formData = new FormData();
    formData.append("title", editTitle.trim());
    formData.append("description", editDescription.trim());
    formData.append("type", editMediaKey);
    formData.append("categoryId", String(fetchedLesson.categoryId));
    formData.append("slug", fetchedLesson.slug);
    formData.append(
      "instructions",
      JSON.stringify(editContent.filter(step => step.trim() !== "").map(step => ({ text: step })))
    );

    if (editSourceType === "file") {
      if (editVideoFile) {
        formData.append("video", editVideoFile);
      }
    } else {
      formData.append("lessonUrl", editLessonUrl.trim());
    }

    try {
      await updateLessonMutation.mutateAsync(formData);

      // 2. Build and save quiz updates
      const quizObj = quizzesList?.[0];
      const quizOptionsPayload = editQuizOptions
        .filter(opt => opt.trim() !== "")
        .map((opt, index) => ({
          name: opt.trim(),
          isCorrect: index === editQuizCorrectIndex,
          orderIndex: index
        }));

      if (quizObj) {
        // Update existing quiz
        await api.put(ENDPOINTS.QUIZZES.UPDATE(quizObj.id), {
          lessonId: parseInt(id, 10),
          categoryId: fetchedLesson.categoryId,
          question: editQuizQuestion.trim(),
          options: quizOptionsPayload
        });
      } else if (editQuizQuestion.trim() !== "") {
        // Create new quiz
        await api.post(ENDPOINTS.QUIZZES.CREATE, {
          lessonId: parseInt(id, 10),
          categoryId: fetchedLesson.categoryId,
          question: editQuizQuestion.trim(),
          options: quizOptionsPayload
        });
      }

      // Invalidate queries to refresh view
      queryClient.invalidateQueries({ queryKey: ['lesson-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', { lessonId: id }] });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  const lesson = fetchedLesson ? {
    id: fetchedLesson.id,
    categoryTitle: categories.find(c => c.id === fetchedLesson.categoryId)?.name || "Basics",
    title: fetchedLesson.title,
    description: fetchedLesson.description || "",
    mediaKey: fetchedLesson.type || "learn",
    lessonUrl: fetchedLesson.lessonUrl || "",
    content: fetchedLesson.instructions 
      ? fetchedLesson.instructions.map(i => typeof i === 'string' ? i : i.text) 
      : [],
    quiz: quizzesList?.[0] ? {
      question: quizzesList[0].question,
      options: quizzesList[0].options ? quizzesList[0].options.map(o => o.name) : [],
      correctIndex: quizzesList[0].options ? Math.max(0, quizzesList[0].options.findIndex(o => o.isCorrect)) : 0
    } : {
      question: "No practice quiz created yet.",
      options: [],
      correctIndex: 0
    },
    recentCompletions: []
  } : null;

  if (isLoadingLesson || isLoadingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-400 text-sm">Loading lesson details...</p>
      </div>
    );
  }

  if (lessonError || !fetchedLesson || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
        <p className="text-rose-400 text-sm font-semibold">
          {lessonError?.response?.data?.message || lessonError?.message || "Failed to load lesson details."}
        </p>
        <Link to="/lessons">
          <Button variant="ghost" className="border border-white/10 text-white">
            Go Back
          </Button>
        </Link>
      </div>
    );
  }

  const getMediaIcon = (key) => {
    switch (key) {
      case "learn":
        return <Video className="h-4 w-4 text-orange-400" />;
      case "scan":
        return <Play className="h-4 w-4 text-emerald-400" />;
      case "progress":
        return <Activity className="h-4 w-4 text-violet-400" />;
      default:
        return <FileText className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/[0.04] text-gray-400 hover:text-white"
          onClick={() => navigate("/lessons")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Lesson Details</h2>
          <p className="text-gray-400 text-sm">Review structure, contents, and connected checkpoints.</p>
        </div>
      </div>

      {/* Main Stats Summary Block */}
      <Card className="border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent">
        <div className="absolute inset-0 bg-[#080B11]/80 backdrop-blur-md -z-10" />
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {lesson.categoryTitle}
                </span>
                <span className="bg-white/[0.04] text-gray-300 border border-white/[0.08] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  {getMediaIcon(lesson.mediaKey)}
                  {lesson.mediaKey.toUpperCase()} Key
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{lesson.title}</h3>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{lesson.description}</p>
            </div>
            
            <div className="flex gap-3 shrink-0">
              <Button
                variant="ghost"
                onClick={handleOpenEdit}
                className="bg-transparent border border-primary/20 text-orange-400 hover:bg-primary/10 hover:text-primary-soft hover:border-primary/40 flex items-center gap-1.5"
              >
                <Edit className="h-4 w-4" />
                Edit Lesson
              </Button>
              <Button className="flex items-center gap-1.5 shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary-deep text-white">
                <Sparkles className="h-4 w-4" />
                Sync CDN Cache
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-white/[0.08] hover:border-orange-500/20 transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Completions</p>
              <h4 className="text-2xl font-black text-white mt-1">{lesson.completions} Users</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] hover:border-emerald-500/20 transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Quiz Score</p>
              <h4 className="text-2xl font-black text-white mt-1">{lesson.avgQuizScore}% Accuracy</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] hover:border-purple-500/20 transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Study Duration</p>
              <h4 className="text-2xl font-black text-white mt-1">{lesson.avgTimeSpent}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Sections Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lesson Learning Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-md">Interactive Learning Steps</CardTitle>
              <CardDescription>Review instruction sequence displayed to users on the mobile device.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Dynamic steps slides */}
              {lesson.content && lesson.content.length > 0 ? (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-xs font-extrabold text-primary/40 tracking-wider">
                    STEP {activeStep + 1} OF {lesson.content.length}
                  </div>
                  <div className="space-y-4">
                    <span className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-sm">
                      {activeStep + 1}
                    </span>
                    <p className="text-lg text-white font-semibold leading-relaxed">
                      "{lesson.content[activeStep]}"
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/[0.04]">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep(prev => prev - 1)}
                      className="text-xs hover:bg-white/[0.04]"
                    >
                      Previous
                    </Button>
                    <div className="flex gap-1.5">
                      {lesson.content.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveStep(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === activeStep ? "w-6 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={activeStep === lesson.content.length - 1}
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="text-xs hover:bg-white/[0.04]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">No instructions steps added yet.</div>
              )}

              {/* Bullet Steps List Summary */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Content Summary</h5>
                <ul className="space-y-2 text-sm text-gray-300">
                  {lesson.content.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl transition-all">
                      <span className="text-xs font-bold text-primary shrink-0 mt-0.5">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Connected Quiz Card */}
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04] flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-md">Connected Practice Quiz</CardTitle>
                <CardDescription>Validates understanding after completing steps.</CardDescription>
              </div>
              <Button onClick={handleOpenEdit} size="sm" variant="ghost" className="border border-primary/10 text-orange-400 hover:bg-primary/10 text-xs">
                Edit Quiz
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-[#080B11]/50 border border-white/[0.06] rounded-xl p-4 space-y-3">
                <p className="text-white font-semibold text-sm leading-relaxed">
                  <span className="text-primary font-bold mr-1">Q:</span>
                  {lesson.quiz.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {lesson.quiz.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                        i === lesson.quiz.correctIndex
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-white/[0.02] border-white/[0.06] text-gray-400"
                      }`}
                    >
                      <span>{opt}</span>
                      {i === lesson.quiz.correctIndex && <Check className="h-4 w-4 shrink-0 text-emerald-400" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Completion Feed */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-white/[0.08] h-full flex flex-col justify-between">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-md">Recent Study Activity</CardTitle>
              <CardDescription>Track user performance completion feeds.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lesson.recentCompletions.length > 0 ? (
                      lesson.recentCompletions.map((user, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-semibold text-white">
                            <div>
                              <span className="block font-bold text-white text-xs">{user.name}</span>
                              <span className="block text-[10px] text-gray-500">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                              user.score === 100
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {user.score}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-500 text-xs">{user.date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-gray-500 text-xs">
                          No recent studies recorded yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Edit Lesson Modal */}
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
                <Input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lesson Video Source</label>
                    <div className="flex bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setEditSourceType("url")}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                          editSourceType === "url"
                            ? "bg-primary text-white"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditSourceType("file")}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                          editSourceType === "file"
                            ? "bg-primary text-white"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>

                  {editSourceType === "url" ? (
                    <div className="relative h-10 flex items-center justify-between border border-white/10 rounded-md bg-white/[0.02] px-3 py-2 text-sm text-gray-400">
                      <input
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        value={editLessonUrl}
                        onChange={(e) => setEditLessonUrl(e.target.value)}
                        className="absolute inset-0 bg-transparent w-full h-full px-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                      />
                      <Video className="h-4 w-4 text-primary shrink-0 absolute right-3 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative h-10 flex items-center justify-between border border-white/10 rounded-md bg-[#0D121F] px-3 py-2 text-sm text-gray-400">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditVideoFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span className="truncate text-white">{editVideoFile ? editVideoFile.name : "Select video file..."}</span>
                      <Video className="h-4 w-4 text-primary shrink-0" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Media Mode Key</label>
                  <select
                    value={editMediaKey}
                    onChange={(e) => setEditMediaKey(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="learn" className="bg-[#080B11]">Video Player (learn)</option>
                    <option value="scan" className="bg-[#080B11]">Live Camera Scanner (scan)</option>
                    <option value="progress" className="bg-[#080B11]">Interactive Progress (progress)</option>
                    <option value="voice" className="bg-[#080B11]">Audio Assist (voice)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic steps input */}
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
                      <Input
                        type="text"
                        required
                        value={step}
                        onChange={(e) => handleStepValueChange(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        disabled={editContent.length === 1}
                        className="text-gray-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz section */}
              <div className="border-t border-white/[0.04] pt-4 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Linked Practice Quiz</h4>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Quiz Question</label>
                  <Input
                    type="text"
                    required
                    value={editQuizQuestion}
                    onChange={(e) => setEditQuizQuestion(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editQuizOptions.map((opt, idx) => (
                    <div key={idx}>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Option {idx + 1}</label>
                      <Input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Correct Option Index</label>
                  <select
                    value={editQuizCorrectIndex}
                    onChange={(e) => setEditQuizCorrectIndex(parseInt(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {editQuizOptions.map((_, idx) => (
                      <option key={idx} value={idx} className="bg-[#080B11]">
                        Option {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <Button type="button" variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
