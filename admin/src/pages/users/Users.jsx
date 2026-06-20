import { useState } from "react";
import { Search, Eye, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", joinedDate: "2026-06-15", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", joinedDate: "2026-06-18", status: "Inactive" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", joinedDate: "2026-06-19", status: "Active" },
];

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (deleteUser) {
      setUsers(users.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">User Management</h2>
        <p className="text-gray-400 text-sm">Track and manage all registered mobile app users.</p>
      </div>

      <Card className="border-white/[0.08] shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View status, registrations, and account metadata.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-semibold text-white">{user.name}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-400">{user.joinedDate}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-white/[0.04] text-gray-400 border border-white/[0.08]"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/users/${user.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white">
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        onClick={() => setDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0D121F] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete User Account</h3>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              Are you sure you want to delete the account for <strong className="text-white">{deleteUser.name}</strong> ({deleteUser.email})? 
              This will permanently wipe their progress, lessons streak, and credentials. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/[0.04] hover:text-white" onClick={() => setDeleteUser(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
