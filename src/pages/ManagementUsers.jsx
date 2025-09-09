/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  UserPlus,
  XCircle,
  Search,
} from "lucide-react";
// import { toast } from "sonner";
import { deleteData, fetchData, postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const AVAILABLE_PERMISSIONS = [
  "create_invoice",
  "edit_invoice",
  "delete_invoice",
  "view_invoice",
  "create_customer",
  "edit_customer",
  "delete_customer",
  "view_customer",
  "create_product",
  "edit_product",
  "delete_product",
  "view_product",
  "manage_tax",
  "manage_discounts",
  "view_reports",
  "manage_payments",
  "manage_users",
  "manage_roles",
  "system_settings",
  "view_dashboard",
];

const UserManagement = () => {
  const [roles, setRoles] = useState([
    // {
    //   id: "1",
    //   name: "Super Admin",
    //   description: "Full system access",
    //   permissions: AVAILABLE_PERMISSIONS,
    //   isSystem: true,
    // },
    {
      id: "1",
      name: "Admin",
      description: "Administrative access",
      permissions: [
        "create_invoice",
        "edit_invoice",
        "view_invoice",
        "create_customer",
        "edit_customer",
        "view_customer",
        "view_reports",
        "manage_payments",
      ],
      isSystem: false,
    },
    // {
    //   id: "3",
    //   name: "Accountant",
    //   description: "Financial management access",
    //   permissions: [
    //     "view_invoice",
    //     "view_customer",
    //     "manage_tax",
    //     "view_reports",
    //     "manage_payments",
    //   ],
    //   isSystem: false,
    // },
    // {
    //   id: "4",
    //   name: "Sales",
    //   description: "Sales operations access",
    //   permissions: [
    //     "create_invoice",
    //     "edit_invoice",
    //     "view_invoice",
    //     "create_customer",
    //     "edit_customer",
    //     "view_customer",
    //     "create_product",
    //     "view_product",
    //   ],
    //   isSystem: false,
    // },
    {
      id: "2",
      name: "User",
      description: "Limited client access",
      permissions: ["view_invoice"],
      isSystem: false,
    },
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
    password: "",
  });

  // ✅ Reusable API call function
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchData("/users", {
        params: {
          search: searchTerm,
          per_page: itemsPerPage,
          page: currentPage,
        },
      });

      // console.log("resonsepe" , res);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      } else {
        console.error("Failed to load users:", response.message);
      }
    } catch (err) {
      console.error("API error while fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage]);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await updateData(`/users/${userId}/toggle-status`);
      if (res.success) {
        // Optionally show a toast or message
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: res.status } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleCreateUser = async () => {
    // Basic validations
    if (!newUser.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!newUser.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!editingUser && !newUser.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!newUser.role) {
      toast.error("Role is required");
      return;
    }

    if (!newUser.status) {
      toast.error("Status is required");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("fullName", newUser.name);
    formData.append("emailId", newUser.email);
    formData.append("password", newUser.password);
    formData.append("position", newUser.role);
    formData.append("status", newUser.status);

    if (newUser.mobileNo) formData.append("mobileNo", newUser.mobileNo);
    if (newUser.postalAddress)
      formData.append("postalAddress", newUser.postalAddress);
    if (newUser.image) formData.append("image", newUser.image);

    try {
      const res = await postData("/signup", formData);
      console.log("res", res);

      if (res.success) {
        toast.success(res.result || "User created successfully");
        setNewUser({
          name: "",
          email: "",
          role: "",
          status: "",
          password: "",
          mobileNo: "",
          postalAddress: "",
          image: null,
        });

        setIsUserDialogOpen(false);
        fetchUsers();
      } else {
        toast.error(res.result || "User allready exist with same eamil id");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errMsg =
        error?.res?.result || error?.res?.result || "Something went wrong.";
      toast.error(errMsg);
    }
  };

  const handleEditUser = async (user) => {
    try {
      const res = await fetchData(`/user/${user.id}`); // 👈 Using your fetchUserById logic directly here
      if (res.success) {
        const u = res.user;
        setEditingUser(u);
        setNewUser({
          name: u.full_name || u.name || "",
          email: u.email_id || u.email || "",
          role: u.role || "",
          status: u.status || "",
          password: "", // Don't populate password in edit
          mobileNo: u.mobile_no || "",
          postalAddress: u.postal_address || "",
          image: null, // Assuming image is not needed in edit
        });
        setIsUserDialogOpen(true);
      } else {
        toast.error(res.msg || "Failed to fetch user");
      }
    } catch (err) {
      toast.error(err?.msg || "Something went wrong");
    }
  };

  const handleUpdateUser = async () => {
    if (!newUser.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!newUser.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!newUser.role) {
      toast.error("Role is required");
      return;
    }

    if (!newUser.status) {
      toast.error("Status is required");
      return;
    }

    const formData = new FormData();
    formData.append("id", editingUser.id); // required
    formData.append("fullName", newUser.name);
    formData.append("emailId", newUser.email);
    formData.append("position", newUser.role);
    formData.append("status", newUser.status);

    if (newUser.mobileNo) formData.append("mobileNo", newUser.mobileNo);
    if (newUser.postalAddress)
      formData.append("address", newUser.postalAddress);
    if (newUser.image) formData.append("image", newUser.image); // Optional

    try {
      const res = await updateData("/user/update", formData); // 🔗 your Laravel API
      if (res.success) {
        toast.success(res.msg || "User updated successfully");

        // Reset UI state
        setNewUser({
          name: "",
          email: "",
          role: "",
          status: "",
          password: "",
          mobileNo: "",
          postalAddress: "",
          image: null,
        });
        setEditingUser(null);
        setIsUserDialogOpen(false);
        fetchUsers(); // ⏪ Refresh list
      } else {
        toast.error(res.msg || "Failed to update user");
      }
    } catch (error) {
      toast.error(error?.msg || "Something went wrong while updating");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await deleteData(`/delete-user/${userId}`);
      if (res.success) {
        toast.success(res.msg || "User deleted successfully");
        fetchUsers(); // 🔁 Refresh list
      } else {
        toast.error(res.msg || "Failed to delete user");
      }
    } catch (err) {
      toast.error(err?.msg || "Something went wrong");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-3">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">
            User Management
          </h1>
          <p className="text-muted-foreground">Manage users, and status</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name or mobile no..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* Clear button */}
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="pl-10"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingUser(null)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Edit User" : "Create New User"}
                </DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Update user information"
                    : "Add a new user to the system"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newUser.status}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Deactivate</SelectItem>
                      {/* <SelectItem value="suspended">Suspended</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                {!editingUser && (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter password"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUserDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                >
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Sl No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Last Login</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(users || []).map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">
                        {pagination.total -
                          ((pagination.current_page - 1) * itemsPerPage +
                            index)}
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-center">{user.role}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {user.updated_at?.slice(0, 10)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Switch
                            variant="ghost"
                            size="sm"
                            checked={user.status === "active"}
                            onCheckedChange={() =>
                              handleToggleUserStatus(user.id)
                            }
                            className="h-6 w-11  data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* <span className="ml-2 text-sm font-medium">
                            {user.status === "active" ? "Active" : "Inactive"}
                          </span> */}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          {pagination.last_page > 1 && !loading && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.last_page }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        className={`cursor-pointer ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white rounded"
                            : ""
                        }`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(
                          Math.min(pagination.last_page, currentPage + 1)
                        )
                      }
                      className={
                        currentPage === pagination.last_page
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

// ... (Keep the rest of the code unchanged, only TS types removed)
