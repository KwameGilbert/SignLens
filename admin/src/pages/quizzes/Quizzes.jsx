import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";

const mockQuizzes = [
  {
    id: "q1",
    lessonId: "1",
    lessonTitle: "Basic Greetings",
    question: "What is the correct handshape for signing 'Hello'?",
    options: ["Flat hand moving from forehead", "Closed fist circling chest", "Pointed finger tracking lips"],
    correctIndex: 0,
  },
  {
    id: "q2",
    lessonId: "3",
    lessonTitle: "Numbers 1-10",
    question: "How do you represent number '3' in ASL?",
    options: ["Index, middle, and ring finger up", "Thumb, index, and middle finger up", "Three fingers spread flat"],
    correctIndex: 1,
  },
];

export default function Quizzes() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Quiz Management</h2>
          <p className="text-gray-400 text-sm">Review and edit practice check quizzes linked to lessons.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-lg hover:shadow-primary/20">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <Card className="border-white/[0.08]">
        <CardHeader className="border-b border-white/[0.04] pb-4">
          <CardTitle>Lesson Quizzes</CardTitle>
          <CardDescription>Questions are shown to users at checkpoints to validate progress.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
              {mockQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-semibold text-white">{quiz.lessonTitle}</TableCell>
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
  );
}
