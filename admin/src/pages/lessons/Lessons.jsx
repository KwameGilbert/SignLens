import { useState } from "react";
import { Plus, Folder, Eye, Trash2, X, PlusCircle, MinusCircle, Video, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { useLessonsQuery, useCreateLessonMutation, useDeleteLessonMutation } from "../../hooks/useLessons";
import { useCategoriesQuery } from "../../hooks/useCategories";

export default function Lessons() {
  const { data: fetchedLessons = [], isLoading, error } = useLessonsQuery();
  const { data: fetchedCategories = [] } = useCategoriesQuery();
  const createLessonMutation = useCreateLessonMutation();
  const deleteLessonMutation = useDeleteLessonMutation();

  const [activeCategory, setActiveCategory] = useState("All Lessons");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  
  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [contentSteps, setContentSteps] = useState([""]);
  const [videoFile, setVideoFile] = useState(null);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    const generatedSlug = "lesson-" + value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleAddStep = () => {
    setContentSteps([...contentSteps, ""]);
  };

  const handleRemoveStep = (index) => {
    if (contentSteps.length === 1) return;
    setContentSteps(contentSteps.filter((_, idx) => idx !== index));
  };

  const handleStepValueChange = (index, value) => {
    const updated = [...contentSteps];
    updated[index] = value;
    setContentSteps(updated);
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !videoFile || !category) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("categoryId", category);
    formData.append("type", "video");
    formData.append("slug", slug.trim());
    formData.append("description", description.trim());
    formData.append("instructions", JSON.stringify(contentSteps.map((step) => ({ text: step }))));
    formData.append("videoFile", videoFile);

    try {
      await createLessonMutation.mutateAsync(formData);
      resetForm();
    } catch (err) {
      console.error("Failed to create lesson:", err);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setTitle("");
    setSlug("");
    setCategory("");
    setDescription("");
    setContentSteps([""]);
    setVideoFile(null);
  };

  const handleDeleteClick = (id) => {
    setLessonToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (lessonToDelete) {
      try {
        await deleteLessonMutation.mutateAsync(lessonToDelete);
        setIsDeleteModalOpen(false);
        setLessonToDelete(null);
      } catch (err) {
        console.error("Failed to delete lesson:", err);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLessonToDelete(null);
  };

  const filteredLessons = fetchedLessons.filter(
    (l) => activeCategory === "All Lessons" || l.categoryId === activeCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Lesson Management</h2>
          <p className="text-gray-400 text-sm">Upload and organize sign language lessons.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary-deep text-white">
          <Plus className="h-4 w-4" />
          Add New Lesson
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-400 text-sm">Loading lessons...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <p className="text-rose-400 text-sm font-semibold">
            {error?.response?.data?.message || error?.message || "Failed to load lessons."}
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Navigation Bar */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="flex items-center gap-2 text-md text-white">
                <Folder className="h-5 w-5 text-primary" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm">
                <li
                  onClick={() => setActiveCategory("All Lessons")}
                  className={`cursor-pointer px-3 py-2 rounded-lg transition-all ${
                    activeCategory === "All Lessons"
                      ? "text-primary font-bold bg-primary/10"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]"
                  }`}
                >
                  All Lessons
                </li>
                {fetchedCategories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`cursor-pointer px-3 py-2 rounded-lg transition-all ${
                      activeCategory === cat.id
                        ? "text-primary font-bold bg-primary/10"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    {cat.name || cat.title}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Directory List Card */}
        <div className="md:col-span-3">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="text-white">Lessons</CardTitle>
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
                  {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-semibold text-white">{lesson.title}</TableCell>
                        <TableCell className="text-gray-300">
                          {fetchedCategories.find((c) => c.id === lesson.categoryId)?.name || 
                           fetchedCategories.find((c) => c.id === lesson.categoryId)?.title || 
                           lesson.category || "Unknown"}
                        </TableCell>
                        <TableCell className="text-gray-400">{lesson.type}</TableCell>
                        <TableCell className="text-gray-400">{lesson.createdAt ? lesson.createdAt.split("T")[0] : "N/A"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link to={`/lessons/${lesson.id}`}>
                            <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white flex items-center gap-1.5 inline-flex">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            onClick={() => handleDeleteClick(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                        No lessons found for this category.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      {/* Add New Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-lg font-bold text-white">Upload New Lesson</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Lesson Title</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Alphabet Signs A-F"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Unique ID Identifier</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. lesson-alpha-a-f"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
                  <select
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled className="bg-[#080B11]">Select a category</option>
                    {fetchedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#080B11]">
                        {cat.name || cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Lesson Video</label>
                  <div className="relative h-10 flex items-center justify-between border border-white/10 rounded-md bg-white/[0.02] px-3 py-2 text-sm text-gray-400 overflow-hidden">
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="absolute inset-0 bg-transparent w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <span className="truncate w-full pr-6">{videoFile ? videoFile.name : "Select video file..."}</span>
                    <Video className="h-4 w-4 text-primary shrink-0 absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Lesson Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Summarize what users will master in this checkpoint..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Dynamic steps input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Instruction Steps</label>
                  <Button type="button" variant="ghost" size="sm" onClick={handleAddStep} className="text-primary hover:bg-primary/10 text-xs flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" /> Add Step
                  </Button>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                  {contentSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 shrink-0 w-4">{idx + 1}.</span>
                      <Input
                        type="text"
                        required
                        placeholder={`e.g. Step instruction ${idx + 1}`}
                        value={step}
                        onChange={(e) => handleStepValueChange(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        disabled={contentSteps.length === 1}
                        className="text-gray-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <Button type="button" variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLessonMutation.isPending} className="bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20">
                  {createLessonMutation.isPending ? "Creating..." : "Create Lesson Checkpoint"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 mb-4">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Lesson?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete this lesson? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="ghost" className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} disabled={deleteLessonMutation.isPending} className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20">
                {deleteLessonMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
