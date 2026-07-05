import { useState, useEffect } from "react";
import { Plus, CheckSquare, Eye, Trash2, X, Search, PlusCircle, MinusCircle, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useQuizzesQuery, useCreateQuizMutation, useDeleteQuizMutation } from "../../hooks/useQuizzes";
import { useCategoriesQuery } from "../../hooks/useCategories";
import { useLessonsQuery } from "../../hooks/useLessons";

export default function Quizzes() {
  const { data: fetchedQuizzes = [], isLoading, error } = useQuizzesQuery();
  const { data: fetchedCategories = [] } = useCategoriesQuery();
  const { data: fetchedLessons = [] } = useLessonsQuery();
  const createQuizMutation = useCreateQuizMutation();
  const deleteQuizMutation = useDeleteQuizMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cascading Category and Lesson Selectors
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  // Dynamic Array for Multi-Quiz Additions
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0
    }
  ]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const filtered = fetchedLessons.filter(l => String(l.categoryId) === String(catId));
    setSelectedLessonId(filtered[0]?.id || "");
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0
      }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionValueChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].question = value;
    setQuestions(updated);
  };

  const handleOptionValueChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectIndexChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].correctIndex = parseInt(value, 10);
    setQuestions(updated);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setSelectedCategory("");
    setSelectedLessonId("");
    setQuestions([
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0
      }
    ]);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedLessonId) return;

    // Validate that all questions have at least a question text and the first two options filled
    const isValid = questions.every(q => 
      q.question.trim() && 
      q.options[0].trim() && 
      q.options[1].trim()
    );
    if (!isValid) return;

    try {
      for (const q of questions) {
        const trimmedOptions = q.options.map(opt => opt.trim()).filter(opt => opt !== "");
        let cIdx = q.correctIndex;
        if (cIdx >= trimmedOptions.length) {
          cIdx = 0;
        }
        
        await createQuizMutation.mutateAsync({
          lessonId: parseInt(selectedLessonId, 10),
          question: q.question.trim(),
          options: trimmedOptions,
          correctIndex: cIdx
        });
      }
      resetForm();
    } catch (err) {
      console.error("Failed to create quizzes:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuizMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete quiz:", err);
      }
    }
  };

  const filteredQuizzes = fetchedQuizzes.filter(
    (q) => {
      const lessonTitle = fetchedLessons.find(l => String(l.id) === String(q.lessonId))?.title || "Unknown Lesson";
      return lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
             q.question.toLowerCase().includes(searchQuery.toLowerCase());
    }
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Quiz Management</h2>
          <p className="text-gray-400 text-sm">Review and edit practice check quizzes linked to lessons.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary-deep text-white">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <Card className="border-white/[0.08] shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
          <div>
            <CardTitle className="text-white">Lesson Quizzes</CardTitle>
            <CardDescription>Questions are shown to users at checkpoints to validate progress.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search quizzes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-gray-400 text-sm">Loading quizzes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
              <p className="text-rose-400 text-sm font-semibold">
                {error?.response?.data?.message || error?.message || "Failed to load quizzes."}
              </p>
            </div>
          ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linked Lesson</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Multiple Options</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.length > 0 ? (
                  filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-semibold text-white">
                        {fetchedLessons.find(l => String(l.id) === String(quiz.lessonId))?.title || "Unknown Lesson"}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-xs truncate">{quiz.question}</TableCell>
                      <TableCell className="text-gray-400">
                        <ul className="list-disc list-inside text-xs space-y-0.5">
                          {quiz.options.map((opt, i) => (
                            <li key={i} className={i === quiz.correctIndex ? "text-emerald-400 font-bold" : ""}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="text-emerald-400 font-semibold text-xs">
                        Option {quiz.correctIndex + 1}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/quizzes/${quiz.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white inline-flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDelete(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No quizzes found matching your query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Create Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04] shrink-0">
              <h3 className="text-lg font-bold text-white">Create New Practice Quiz</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">1. Select Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled className="bg-[#080B11]">Select a category...</option>
                    {fetchedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#080B11]">
                        {cat.name || cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">2. Select Lesson Checkpoint</label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    disabled={!selectedCategory || fetchedLessons.filter(l => String(l.categoryId) === String(selectedCategory)).length === 0}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {fetchedLessons.filter(l => String(l.categoryId) === String(selectedCategory)).length > 0 ? (
                      fetchedLessons.filter(l => String(l.categoryId) === String(selectedCategory)).map((lesson) => (
                        <option key={lesson.id} value={lesson.id} className="bg-[#080B11]">
                          {lesson.title}
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-[#080B11]">No lessons found</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quiz Questions</h4>
                  <Button 
                    type="button" 
                    onClick={handleAddQuestion} 
                    className="flex items-center gap-1 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-primary text-xs py-1.5 px-3 h-8 shadow-sm font-sans cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Another Question
                  </Button>
                </div>

                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div 
                      key={qIdx} 
                      className="relative bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 space-y-4 hover:border-white/[0.15] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md">
                          Question #{qIdx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveQuestion(qIdx)} 
                            className="text-rose-400 hover:text-rose-300 transition-colors p-1.5 rounded hover:bg-rose-500/10 cursor-pointer"
                            title="Remove this question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-400 block mb-1.5">Quiz Question</label>
                        <textarea
                          required
                          rows={2}
                          placeholder={`Enter quiz question #${qIdx + 1} to display...`}
                          value={q.question}
                          onChange={(e) => handleQuestionValueChange(qIdx, e.target.value)}
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
                            value={q.options[0]}
                            onChange={(e) => handleOptionValueChange(qIdx, 0, e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 2 (Required)</label>
                          <Input
                            type="text"
                            required
                            placeholder="Enter choice option 2"
                            value={q.options[1]}
                            onChange={(e) => handleOptionValueChange(qIdx, 1, e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 3</label>
                          <Input
                            type="text"
                            placeholder="Enter choice option 3"
                            value={q.options[2]}
                            onChange={(e) => handleOptionValueChange(qIdx, 2, e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Option 4</label>
                          <Input
                            type="text"
                            placeholder="Enter choice option 4"
                            value={q.options[3]}
                            onChange={(e) => handleOptionValueChange(qIdx, 3, e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Correct Option Index</label>
                        <select
                          value={q.correctIndex}
                          onChange={(e) => handleCorrectIndexChange(qIdx, e.target.value)}
                          className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value={0} className="bg-[#080B11]">Option 1</option>
                          <option value={1} className="bg-[#080B11]">Option 2</option>
                          {q.options[2].trim() && <option value={2} className="bg-[#080B11]">Option 3</option>}
                          {q.options[3].trim() && <option value={3} className="bg-[#080B11]">Option 4</option>}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04] shrink-0">
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
                  Link Practice Quizzes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
