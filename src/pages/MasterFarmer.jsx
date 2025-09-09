/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { deleteData, fetchData, postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

const FarmerMaster = () => {
  const [farmers, setFarmers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  // const [editingFarmer, setEditingFarmer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    balance: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      address: "",
      balance: 0,
    });
  };

  const formatCurrency = (amount) => {
    const value = Number(amount);
    if (isNaN(value)) return "₹0.00";

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  useEffect(() => {
    fetchFarmers();
  }, [currentPage, searchTerm]);

  const fetchFarmers = async () => {
    try {
      const response = await fetchData("/farmers", {
        params: {
          search: searchTerm,
          per_page: itemsPerPage,
          page: currentPage,
        },
      });

      if (response.success) {
        setFarmers(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.msg || "Failed to load farmers");
      }
    } catch (error) {
      console.error("Error fetching farmers:", error);
      toast.error("Something went wrong while fetching farmers");
    } finally {
      setLoading(false); // hide shimmer, show table
    }
  };

  const handleCreate = async () => {
    const { name, mobile, address, balance } = formData;

    // Input validation
    if (!name.trim()) {
      toast.error("Farmer name is required.");
      return;
    }

    if (!mobile.trim()) {
      toast.error("Mobile number is required.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!address.trim()) {
      toast.error("Address is required.");
      return;
    }

    if (balance < 0 || isNaN(balance)) {
      toast.error("Balance must be a valid non-negative number.");
      return;
    }

    const payload = {
      mfName: formData.name,
      mfMobileNo: formData.mobile,
      mfAddress: formData.address,
      mfAmount: formData.balance,
    };

    const response = await postData("/farmers", payload);

    if (response.success) {
      toast.success("Farmer created successfully!");
      setIsCreateOpen(false); // close dialog
      resetForm(); // clear form
      fetchFarmers(); // refresh table list
    } else {
      toast.error(response.msg?.trim() || "Failed to create farmer.");
    }
  };

  const fetchFarmerById = async (id) => {
    const response = await fetchData(`/farmers/${id}`);
    if (response.success) {
      setFormData({
        id: id,
        name: response.data.mf_name,
        mobile: response.data.mf_mobile_no,
        address: response.data.mf_address,
        balance: response.data.mf_amount,
      });
      setIsEditing(true);
      setIsEditOpen(true);
    } else {
      toast.error(response.msg || "Failed to fetch farmer data.");
    }
  };

  const handleUpdate = async () => {
    const payload = {
      mfName: formData.name,
      mfMobileNo: formData.mobile,
      mfAddress: formData.address,
      mfAmount: formData.balance,
    };

    const response = await updateData(
      `/farmers/update/${formData.id}`,
      payload
    );

    if (response.success) {
      toast.success("Farmer updated successfully!");
      setIsEditOpen(false); // Close dialog
      resetForm(); // Clear form
      fetchFarmers(); // Refresh list
    } else {
      toast.error(response.msg || "Failed to update farmer.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`/farmers/${id}`);
      if (response.success) {
        toast.success(response.msg || "Farmer deleted successfully!");
        fetchFarmers(); // <-- refresh list after delete
      } else {
        toast.error(response.msg || "Failed to delete farmer.");
      }
    } catch (error) {
      toast.error("Unexpected error occurred while deleting farmer.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-3">
      <Toaster position="top-right" />

      {/* Header + Search + Add Farmer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">
            Farmer Master
          </h1>
          <p className="text-muted-foreground">
            Manage farmer information and accounts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farmers..."
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

          {/* Add Farmer */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Farmer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Farmer</DialogTitle>
                <DialogDescription>
                  Enter farmer details to add them.
                </DialogDescription>
              </DialogHeader>

              {/* Create form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="farmerName">Farmer Name</Label>
                  <Input
                    id="farmerName"
                    value={formData.name}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, name: e.target.value })
                    // }
                    onChange={(e) => {
                      const value = e.target.value;
                      const formatted =
                        value.charAt(0).toUpperCase() + value.slice(1); // capitalize first letter
                      setFormData({ ...formData, name: formatted });
                    }}
                    placeholder="Enter farmer name"
                    
                  />
                </div>
                <div>
                  <Label htmlFor="farmerMobile">Mobile Number</Label>
                  <Input
                    id="farmerMobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) =>
                      /^\d{0,10}$/.test(e.target.value) &&
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                <div>
                  <Label htmlFor="farmerAddress">Address</Label>
                  <Textarea
                    id="farmerAddress"
                    value={formData.address}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, address: e.target.value })
                    // }

                      onChange={(e) => {
                      const value = e.target.value;
                      const formatted =
                      value.charAt(0).toUpperCase() + value.slice(1); // capitalize first letter
                      setFormData({ ...formData, address: formatted });
                    }}
                    placeholder="Enter complete address"
                  />
                </div>
                <div>
                  <Label htmlFor="farmerBalance">
                    Balance Amount(Amount to be Pay Farmer)
                  </Label>
                  <Input
                    id="farmerBalance"
                    type="number"
                    value={formData.balance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        balance: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter balance amount (default: 0)"
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
                <Button onClick={handleCreate}>Add Farmer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table + Shimmer + Pagination */}
      <Card>
        <CardHeader />
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
                    <TableHead>Farmer Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">
                      Initial Balance(To Pay Farmer)
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(farmers || []).map((farmer, index) => (
                    <TableRow key={farmer.mf_id}>
                      <TableCell className="text-center">
                        {pagination.total -
                          ((pagination.current_page - 1) * itemsPerPage +
                            index)}
                      </TableCell>
                      <TableCell>{farmer.mf_name}</TableCell>
                      <TableCell>{farmer.mf_mobile_no}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {farmer.mf_address}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(farmer.mf_amount?.toFixed(2) || "0.00")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fetchFarmerById(farmer.mf_id)}
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
                                  Delete Farmer
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {farmer.mf_name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(farmer.mf_id)}
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
          {/* Pagination */}
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Farmer</DialogTitle>
            <DialogDescription>Update farmer details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFarmerName">Farmer Name</Label>
              <Input
                id="editFarmerName"
                value={formData.name}
                // onChange={(e) =>
                //   setFormData({ ...formData, name: e.target.value })
                // }
                  onChange={(e) => {
                      const value = e.target.value;
                      const formatted =
                        value.charAt(0).toUpperCase() + value.slice(1); // capitalize first letter
                      setFormData({ ...formData, name: formatted });
                    }}
                placeholder="Enter farmer name"
              />
            </div>
            <div>
              <Label htmlFor="editFarmerMobile">Mobile Number</Label>
              <Input id="editFarmerMobile" value={formData.mobile} disabled />
            </div>
            <div>
              <Label htmlFor="editFarmerAddress">Address</Label>
              <Textarea
                id="editFarmerAddress"
                value={formData.address}
                // onChange={(e) =>
                //   setFormData({ ...formData, address: e.target.value })
                // }

                onChange={(e) => {
                      const value = e.target.value;
                      const formatted =
                        value.charAt(0).toUpperCase() + value.slice(1); // capitalize first letter
                      setFormData({ ...formData, address: formatted });
                    }}
                
                placeholder="Enter complete address"
              />
            </div>
            <div>
              <Label htmlFor="editFarmerBalance">Balance Amount</Label>
              <Input
                id="editFarmerBalance"
                type="number"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    balance: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Enter balance amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Farmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerMaster;
