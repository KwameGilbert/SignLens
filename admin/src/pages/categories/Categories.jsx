import { useState } from "react";
import { Plus, FolderOpen, Heart, School, Calculator, Trash2, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const initialCategories = [
  { id: "1", title: "Basics", slug: "basics", icon: "school", lessonCount: 12 },
  { id: "2", title: "Numbers", slug: "numbers", icon: "calculator", lessonCount: 10 },
  { id: "3", title: "Family", slug: "family", icon: "heart", lessonCount: 8 },
];

const availableIcons = [
  { value: "school", label: "School / Education", icon: School },
  { value: "calculator", label: "Calculator / Numbers", icon: Calculator },
  { value: "heart", label: "Heart / Emotions", icon: Heart },
  { value: "folder", label: "Folder / Generic", icon: FolderOpen },
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("school");

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    // Auto-generate slug: lowercase, replace spaces with hyphens, remove special characters
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const newCategory = {
      id: (categories.length + 1).toString(),
      title: title.trim(),
      slug: slug.trim(),
      icon,
      lessonCount: 0,
    };

    setCategories([...categories, newCategory]);
    setTitle("");
    setSlug("");
    setIcon("school");
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Lesson Categories</h2>
        <p className="text-gray-400 text-sm">Create and organize the core content streams for the learning modules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to Add Category */}
        <div className="lg:col-span-1">
          <Card className="border-white/[0.08] sticky top-6">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Category
              </CardTitle>
              <CardDescription>Setup metadata variables for new course categories.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Category Title</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Workplace Phrases"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Slug identifier (URL)</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. workplace-phrases"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Select Display Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {availableIcons.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#080B11]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Categories Directory Table */}
        <div className="lg:col-span-2">
          <Card className="border-white/[0.08]">
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle>Category Directory</CardTitle>
              <CardDescription>Review categories and lessons counts loaded in SignLens client.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Icon Reference</TableHead>
                    <TableHead>Lesson Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => {
                    const IconRecord = availableIcons.find((i) => i.value === cat.icon)?.icon || FolderOpen;
                    return (
                      <TableRow key={cat.id}>
                        <TableCell className="font-semibold text-white">
                          <div className="flex items-center gap-2.5">
                            <IconRecord className="h-4 w-4 text-primary" />
                            {cat.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs">{cat.slug}</TableCell>
                        <TableCell className="text-gray-400 text-xs">
                          <code className="bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                            {cat.icon}
                          </code>
                        </TableCell>
                        <TableCell className="font-bold text-gray-300">{cat.lessonCount} Lessons</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link to={`/categories/${cat.slug}`}>
                            <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white inline-flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
