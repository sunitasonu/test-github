/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { deleteData, fetchData, postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const VegetableMaster = () => {
  const [vegetables, setVegetables] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newVegetableName, setNewVegetableName] = useState("");
  const [editVegetableId, setEditVegetableId] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchVegetables();
  }, [searchTerm, currentPage]);

  const fetchVegetables = async () => {
    setLoading(true);
    try {
      const response = await fetchData("/vegetables", {
        params: {
          search: searchTerm,
          per_page: itemsPerPage,
          page: currentPage,
        },
      });

      if (response.success) {
        setVegetables(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.msg || "Failed to load vegetables");
      }
    } catch (error) {
      console.error("Error fetching vegetables:", error);
      toast.error("Something went wrong while fetching vegetables");
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newVegetableName.trim()) {
      toast.error("Vegetable name is required.");
      return;
    }

    try {
      const response = await postData("/vegetables", {
        mv_vegetable_name: newVegetableName.trim(),
      });

      if (response.success) {
        toast.success(response.msg || "Vegetable created successfully!");
        setNewVegetableName("");
        setIsCreateOpen(false);
        fetchVegetables();
      } else {
        if (response.status === 409) {
          toast.error("This vegetable already exists.");
        } else {
          toast.error(response.result || "Failed to create vegetable.");
        }
      }
    } catch (error) {
      toast.error("Unexpected error occurred while creating vegetable.");
      console.error("Create Vegetable Error:", error);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await fetchData(`/vegetables/${id}`);
      if (response.success) {
        setEditVegetableId(id);
        setNewVegetableName(response.data.mv_vegetable_name);
        setIsEditOpen(true);
      } else {
        toast.error(response.msg || "Failed to fetch vegetable.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching vegetable.");
    }
  };

  const handleUpdate = async () => {
    if (!newVegetableName.trim()) {
      toast.error("Vegetable name is required.");
      return;
    }

    try {
      const response = await updateData(
        `/vegetables/update/${editVegetableId}`,
        {
          mv_vegetable_name: newVegetableName.trim(),
        }
      );

      if (response.success) {
        toast.success(response.msg || "Vegetable updated successfully!");
        setIsEditOpen(false);
        setEditVegetableId(null);
        setNewVegetableName("");
        fetchVegetables();
      } else {
        toast.error(response.result || "Failed to update vegetable.");
      }
    } catch (error) {
      toast.error("Unexpected error occurred during update.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`/vegetables/${id}`);
      if (response.success) {
        toast.success(response.msg || "Vegetable deleted successfully!");
        fetchVegetables();
      } else {
        toast.error(response.result || "Failed to delete vegetable.");
      }
    } catch (error) {
      toast.error("Unexpected error occurred while deleting vegetable.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-3">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">
            Vegetable Master
          </h1>
          <p className="text-muted-foreground">Manage your vegetable catalog</p>
        </div>
        <div className="flex flex-col sm:flex-row  gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vegetables..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
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

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vegetable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vegetable</DialogTitle>
                <DialogDescription>
                  Enter the vegetable name to add it to your catalog.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vegetableName">Vegetable Name</Label>
                  <Input
                    id="vegetableName"
                    value={newVegetableName}
                    // onChange={(e) => setNewVegetableName(e.target.value)}
                    onChange={(e) => {
                  const value = e.target.value;
                  const formatted =
                    value.charAt(0).toUpperCase() + value.slice(1); // Capitalize first letter
                  setNewVegetableName(formatted);
                }}
                    placeholder="Enter vegetable name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Add Vegetable</Button>
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
                    <TableHead>Vegetable Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(vegetables || []).map((vegetable, index) => (
                    <TableRow key={vegetable.mv_id}>
                      <TableCell className="text-center">
                        {pagination.total -
                          ((pagination.current_page - 1) * itemsPerPage +
                            index)}
                      </TableCell>
                      <TableCell>
                        {vegetable.mv_vegetable_name.charAt(0).toUpperCase() +
                          vegetable.mv_vegetable_name.slice(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(vegetable.mv_id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Vegetable
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {vegetable.mv_name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(vegetable.mv_id)}
                                  className="bg-red-600 hover:bg-red-700"
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <span></span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vegetable</DialogTitle>
            <DialogDescription>Update the vegetable name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vegetableName">Vegetable Name</Label>
              <Input
                id="vegetableName"
                value={newVegetableName}
                // onChange={(e) => setNewVegetableName(e.target.value)}
                 onChange={(e) => {
                  const value = e.target.value;
                  const formatted =
                    value.charAt(0).toUpperCase() + value.slice(1); // Capitalize first letter
                  setNewVegetableName(formatted);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VegetableMaster;
