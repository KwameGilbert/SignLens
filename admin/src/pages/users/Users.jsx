import { useState } from "react";
import { Search, Eye, Trash2, AlertTriangle, Plus, X, Shield, UserPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useUsersQuery, useCreateAdminMutation, useDeleteUserMutation } from "../../hooks/useUsers";

export default function Users() {
  const { data: allUsers = [], isLoading, error } = useUsersQuery();
  const createAdminMutation = useCreateAdminMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const [activeTab, setActiveTab] = useState("app"); // "app" or "admin"
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  
  // Add Admin modal state
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("Super Admin");
  const [adminStatus, setAdminStatus] = useState("Active");

  // Helper to format date strings
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return dateStr.split("T")[0];
  };

  // Classify users into App Users and Admin Dashboard Users dynamically
  const appUsers = allUsers.filter(
    (u) => !u.role || u.role.toLowerCase() === "user" || u.role.toLowerCase() === "client"
  );
  
  const adminUsers = allUsers.filter(
    (u) => u.role && u.role.toLowerCase() !== "user" && u.role.toLowerCase() !== "client"
  );

  const filteredUsers = appUsers.filter(
    (user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) ||
             (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    }
  );

  const filteredAdmins = adminUsers.filter(
    (admin) => {
      const fullName = `${admin.firstName || ""} ${admin.lastName || ""}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) ||
             (admin.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
             (admin.role || "").toLowerCase().includes(searchQuery.toLowerCase());
    }
  );

  const resetAdminForm = () => {
    setIsAddAdminOpen(false);
    setAdminName("");
    setAdminEmail("");
    setAdminRole("Super Admin");
    setAdminStatus("Active");
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) return;

    try {
      const nameParts = adminName.trim().split(" ");
      await createAdminMutation.mutateAsync({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || "",
        email: adminEmail.trim(),
        role: adminRole,
        status: adminStatus,
      });
      resetAdminForm();
    } catch (err) {
      console.error("Failed to add admin:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteUser) {
      try {
        await deleteUserMutation.mutateAsync(deleteUser.id);
        setDeleteUser(null);
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">User Management</h2>
          <p className="text-gray-400 text-sm">Track and manage all registered mobile app users and administrators.</p>
        </div>
        {activeTab === "admin" && (
          <Button 
            onClick={() => setIsAddAdminOpen(true)} 
            className="flex items-center gap-2 shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary-deep text-white cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        )}
      </div>

      {/* Role Tabs Switcher */}
      <div className="flex border-b border-white/[0.08] gap-6">
        <button
          onClick={() => { setActiveTab("app"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
            activeTab === "app" ? "text-primary" : "text-gray-400 hover:text-white"
          }`}
        >
          App Users ({isLoading ? "..." : filteredUsers.length})
          {activeTab === "app" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(251,86,7,0.4)] animate-in slide-in-from-bottom-1" />
          )}
        </button>
        <button
          onClick={() => { setActiveTab("admin"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
            activeTab === "admin" ? "text-primary" : "text-gray-400 hover:text-white"
          }`}
        >
          Admin Dashboard Users ({isLoading ? "..." : filteredAdmins.length})
          {activeTab === "admin" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(251,86,7,0.4)] animate-in slide-in-from-bottom-1" />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-400 text-sm">Loading users registry...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 p-6 border border-rose-500/20 bg-rose-500/5 rounded-xl">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <p className="text-rose-400 text-sm font-semibold">
            {error?.response?.data?.message || error?.message || "Failed to load user directories."}
          </p>
        </div>
      ) : (
        <Card className="border-white/[0.08] shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
            <div>
              <CardTitle>{activeTab === "app" ? "All App Users" : "Administrators"}</CardTitle>
              <CardDescription>
                {activeTab === "app" 
                  ? "View status, registrations, and account metadata of mobile app clients." 
                  : "View dashboard administrative roles and control access clearances."}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={activeTab === "app" ? "Search users..." : "Search admins..."}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    {activeTab === "admin" && <TableHead>Admin Role</TableHead>}
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTab === "app" ? (
                    filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                {(user.firstName || "U").charAt(0).toUpperCase()}
                              </div>
                              {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed User"}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell className="text-gray-400">{formatDate(user.joinedDate || user.createdAt)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                user.status === "Active"
                                  ? "bg-green-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-white/[0.04] text-gray-400 border border-white/[0.08]"
                              }`}
                            >
                              {user.status || "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Link to={`/users/${user.id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer">
                                <Eye className="h-4 w-4" />
                                View Profile
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
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
                          No app users found matching your query.
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    filteredAdmins.length > 0 ? (
                      filteredAdmins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                                {(admin.firstName || "A").charAt(0).toUpperCase()}
                              </div>
                              {`${admin.firstName || ""} ${admin.lastName || ""}`.trim() || "Unnamed Admin"}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{admin.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                              <Shield className="h-3 w-3 shrink-0" />
                              {admin.role || "Admin"}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-400">{formatDate(admin.joinedDate || admin.createdAt)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                admin.status === "Active"
                                  ? "bg-green-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-white/[0.04] text-gray-400 border border-white/[0.08]"
                              }`}
                            >
                              {admin.status || "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Link to={`/users/${admin.id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-white/[0.04] text-gray-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer">
                                <Eye className="h-4 w-4" />
                                View Profile
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                              onClick={() => setDeleteUser(admin)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                          No admin dashboard users found matching your query.
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

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
              Are you sure you want to delete the account for <strong className="text-white">{`${deleteUser.firstName || ""} ${deleteUser.lastName || ""}`.trim()}</strong> ({deleteUser.email})? 
              {deleteUser.role && deleteUser.role.toLowerCase() !== "user" && deleteUser.role.toLowerCase() !== "client"
                ? " This will permanently revoke their access to the admin dashboard panels."
                : " This will permanently wipe their progress, lessons streak, and credentials."
              } This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="ghost" 
                className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white cursor-pointer" 
                onClick={() => setDeleteUser(null)}
                disabled={deleteUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={deleteUserMutation.isPending}
                className="cursor-pointer"
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0D121F] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Add New Administrator
              </h3>
              <button onClick={resetAdminForm} className="text-gray-400 hover:text-white transition-all cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Kwame Gilbert"
                  value={adminName}
                  disabled={createAdminMutation.isPending}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. admin@signlens.com"
                  value={adminEmail}
                  disabled={createAdminMutation.isPending}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Access Role</label>
                  <select
                    value={adminRole}
                    disabled={createAdminMutation.isPending}
                    onChange={(e) => setAdminRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Super Admin" className="bg-[#080B11]">Super Admin</option>
                    <option value="Content Editor" className="bg-[#080B11]">Content Editor</option>
                    <option value="Moderator" className="bg-[#080B11]">Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Initial Status</label>
                  <select
                    value={adminStatus}
                    disabled={createAdminMutation.isPending}
                    onChange={(e) => setAdminStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0D121F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Active" className="bg-[#080B11]">Active</option>
                    <option value="Inactive" className="bg-[#080B11]">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white cursor-pointer" 
                  onClick={resetAdminForm}
                  disabled={createAdminMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-deep text-white shadow-lg hover:shadow-primary/20 cursor-pointer"
                  disabled={createAdminMutation.isPending}
                >
                  {createAdminMutation.isPending ? "Adding..." : "Add Admin Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
