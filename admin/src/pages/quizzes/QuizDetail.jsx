import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, BookOpen, Sparkles, Award, Play, Eye, BrainCircuit, Activity, Trash2, Edit, CheckCircle, Video, Image, FileText, Check, X, PlusCircle, MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const mockQuizzesData = {
  "lesson-alpha-a-f": {
    id: "lesson-alpha-a-f",
    lessonTitle: "Alphabet Signs A-F",
    categoryTitle: "Alphabets",
    completions: 1240,
    accuracy: 92,
    quiz: {
      question: "Which principle improves sign readability most?",
      options: ["Faster movement", "Consistent hand orientation", "Lower camera angle", "Minimal pauses"],
      correctIndex: 1
    },
    attempts: [
      { name: "Emma Thompson", email: "emma@example.com", choice: "Consistent hand orientation", result: "Correct", date: "2 hours ago" },
      { name: "Alice Johnson", email: "alice@example.com", choice: "Consistent hand orientation", result: "Correct", date: "5 hours ago" },
      { name: "James Wilson", email: "james.w@example.com", choice: "Faster movement", result: "Incorrect", date: "1 day ago" }
    ]
  },
  "lesson-alpha-g-z": {
    id: "lesson-alpha-g-z",
    lessonTitle: "Alphabet Signs G-Z",
    categoryTitle: "Alphabets",
    completions: 980,
    accuracy: 88,
    quiz: {
      question: "What helps most with finger-spelling fluency?",
      options: ["Closing fingers tightly", "Skipping wrist rotation", "Linking letters smoothly", "Facing away from camera"],
      correctIndex: 2
    },
    attempts: [
      { name: "Emma Thompson", email: "emma@example.com", choice: "Linking letters smoothly", result: "Correct", date: "4 hours ago" },
      { name: "James Wilson", email: "james.w@example.com", choice: "Linking letters smoothly", result: "Correct", date: "6 hours ago" }
    ]
  },
  "lesson-num-0-5": {
    id: "lesson-num-0-5",
    lessonTitle: "Numbers 0-5",
    categoryTitle: "Numbers",
    completions: 820,
    accuracy: 94,
    quiz: {
      question: "For number clarity, you should:",
      options: ["Overlap fingers", "Hide thumb", "Keep fingers visible", "Use random pace"],
      correctIndex: 2
    },
    attempts: [
      { name: "Alice Johnson", email: "alice@example.com", choice: "Keep fingers visible", result: "Correct", date: "Yesterday" }
    ]
  }
};

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fallbackQuiz = {
    id: id || "custom-quiz",
    lessonTitle: id ? id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Custom Lesson",
    categoryTitle: "Basics",
    completions: 0,
    accuracy: 0,
    quiz: {
      question: "Which option best represents correct practice habits?",
      options: ["Fast hand gestures", "Steady visual orientation", "Minimal visual camera space"],
      correctIndex: 1
    },
    attempts: []
  };

  const [quizData, setQuizData] = useState(mockQuizzesData[id] || fallbackQuiz);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [editQuestion, setEditQuestion] = useState("");
  const [editOption1, setEditOption1] = useState("");
  const [editOption2, setEditOption2] = useState("");
  const [editOption3, setEditOption3] = useState("");
  const [editOption4, setEditOption4] = useState("");
  const [editCorrectIndex, setEditCorrectIndex] = useState(0);

  const handleOpenEdit = () => {
    setEditQuestion(quizData.quiz.question);
    setEditOption1(quizData.quiz.options[0] || "");
    setEditOption2(quizData.quiz.options[1] || "");
    setEditOption3(quizData.quiz.options[2] || "");
    setEditOption4(quizData.quiz.options[3] || "");
    setEditCorrectIndex(quizData.quiz.correctIndex);
    setIsEditModalOpen(true);
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    const updatedOptions = [editOption1.trim(), editOption2.trim()];
    if (editOption3.trim()) updatedOptions.push(editOption3.trim());
    if (editOption4.trim()) updatedOptions.push(editOption4.trim());

    setQuizData({
      ...quizData,
      quiz: {
        question: editQuestion.trim(),
        options: updatedOptions,
        correctIndex: editCorrectIndex >= updatedOptions.length ? 0 : editCorrectIndex
      }
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/[0.04] text-gray-400 hover:text-white"
          onClick={() => navigate("/quizzes")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Quiz Details</h2>
          <p className="text-gray-400 text-sm">Review quiz parameters, connected lesson triggers, and stats.</p>
        </div>
      </div>

      {/* Main Header summary banner */}
      <Card className="border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent">
        <div className="absolute inset-0 bg-[#080B11]/80 backdrop-blur-md -z-10" />
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Linked Lesson Checkpoint
              </span>
              <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{quizData.lessonTitle}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                Category Module: <span className="text-white font-semibold">{quizData.categoryTitle}</span>
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to={`/lessons/${quizData.id}`}>
                <Button variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-1.5 h-10">
                  <Eye className="h-4 w-4" /> View Lesson
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleOpenEdit}
                className="bg-transparent border border-primary/20 text-orange-400 hover:bg-primary/10 hover:text-primary-soft hover:border-primary/40 flex items-center gap-1.5 h-10"
              >
                <Edit className="h-4 w-4" /> Edit Quiz Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-white/[0.08] hover:border-orange-500/20 transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Completions</p>
              <h4 className="text-2xl font-black text-white mt-1">{quizData.completions} Completions</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] hover:border-emerald-500/20 transition-all">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Attempt Accuracy</p>
              <h4 className="text-2xl font-black text-white mt-1">{quizData.accuracy}% Correct</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz details & user logs list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Quiz Block */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-md">Active Practice Question</CardTitle>
              <CardDescription>Renders practice check choices linked to lesson completion.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-[#080B11]/50 border border-white/[0.06] rounded-xl p-6 space-y-4">
                <p className="text-base text-white font-semibold leading-relaxed">
                  <span className="text-primary font-bold mr-1.5 text-lg">Q:</span>
                  {quizData.quiz.question}
                </p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {quizData.quiz.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition-all ${
                        i === quizData.quiz.correctIndex
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-white/[0.02] border-white/[0.06] text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-lg text-xs flex items-center justify-center font-bold ${
                          i === quizData.quiz.correctIndex ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-gray-400"
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>
                      {i === quizData.quiz.correctIndex && <Check className="h-4 w-4 shrink-0 text-emerald-400 animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Columns Attempt Feed */}
        <div className="lg:col-span-1">
          <Card className="border-white/[0.08] h-full flex flex-col justify-between">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-md">Recent Attempt Activity</CardTitle>
              <CardDescription>Review student validation logs.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizData.attempts.length > 0 ? (
                      quizData.attempts.map((attempt, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-semibold text-white">
                            <div>
                              <span className="block font-bold text-white text-xs">{attempt.name}</span>
                              <span className="block text-[9px] text-gray-500 truncate max-w-[120px]">{attempt.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                              attempt.result === "Correct"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                              {attempt.result}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-500 text-[10px]">{attempt.date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-gray-500 text-xs">
                          No attempt logs recorded yet.
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

      {/* Edit Quiz Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-lg font-bold text-white">Edit Practice Quiz Key</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Quiz Question</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter the quiz question to display..."
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 1 (Required)</label>
                  <Input
                    type="text"
                    required
                    placeholder="Enter choice option 1"
                    value={editOption1}
                    onChange={(e) => setEditOption1(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 2 (Required)</label>
                  <Input
                    type="text"
                    required
                    placeholder="Enter choice option 2"
                    value={editOption2}
                    onChange={(e) => setEditOption2(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 3</label>
                  <Input
                    type="text"
                    placeholder="Enter choice option 3"
                    value={editOption3}
                    onChange={(e) => setEditOption3(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 4</label>
                  <Input
                    type="text"
                    placeholder="Enter choice option 4"
                    value={editOption4}
                    onChange={(e) => setEditOption4(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Correct Answer</label>
                <select
                  value={editCorrectIndex}
                  onChange={(e) => setEditCorrectIndex(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0} className="bg-[#080B11]">Option 1</option>
                  <option value={1} className="bg-[#080B11]">Option 2</option>
                  {editOption3.trim() && <option value={2} className="bg-[#080B11]">Option 3</option>}
                  {editOption4.trim() && <option value={3} className="bg-[#080B11]">Option 4</option>}
                </select>
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
