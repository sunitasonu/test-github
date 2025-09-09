// import React, { useState } from 'react';
// import { Plus, Edit, Trash2, Calculator } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { useToast } from '@/hooks/use-toast';

// const TaxRates = () => {
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingTax, setEditingTax] = useState(null);
//   const [newTax, setNewTax] = useState({
//     name: '',
//     rate: '',
//     type: 'inclusive',
//     description: '',
//     country: 'US'
//   });
//   const { toast } = useToast();

//   const [taxRates, setTaxRates] = useState([
//     {
//       id: 1,
//       name: 'Standard VAT',
//       rate: 20.0,
//       type: 'inclusive',
//       description: 'Standard VAT rate for most goods and services',
//       active: true,
//       country: 'UK'
//     },
//     {
//       id: 2,
//       name: 'Reduced VAT',
//       rate: 5.0,
//       type: 'inclusive',
//       description: 'Reduced VAT rate for specific items',
//       active: true,
//       country: 'UK'
//     },
//     {
//       id: 3,
//       name: 'Sales Tax',
//       rate: 8.25,
//       type: 'exclusive',
//       description: 'State sales tax',
//       active: true,
//       country: 'US'
//     },
//     {
//       id: 4,
//       name: 'GST',
//       rate: 18.0,
//       type: 'inclusive',
//       description: 'Goods and Services Tax',
//       active: false,
//       country: 'IN'
//     }
//   ]);

//   const handleAddTax = () => {
//     if (!newTax.name || !newTax.rate) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     const tax = {
//       id: Math.max(...taxRates.map(t => t.id)) + 1,
//       ...newTax,
//       rate: parseFloat(newTax.rate),
//       active: true
//     };

//     setTaxRates([...taxRates, tax]);
//     setNewTax({
//       name: '',
//       rate: '',
//       type: 'inclusive',
//       description: '',
//       country: 'US'
//     });
//     setIsAddDialogOpen(false);
//     toast({
//       title: "Success",
//       description: "Tax rate added successfully"
//     });
//   };

//   const handleEditTax = (tax) => {
//     setEditingTax(tax);
//     setNewTax({
//       name: tax.name,
//       rate: tax.rate.toString(),
//       type: tax.type,
//       description: tax.description,
//       country: tax.country
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateTax = () => {
//     if (!newTax.name || !newTax.rate) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     setTaxRates(taxRates.map(tax =>
//       tax.id === editingTax.id
//         ? {
//             ...tax,
//             ...newTax,
//             rate: parseFloat(newTax.rate)
//           }
//         : tax
//     ));

//     setIsEditDialogOpen(false);
//     setEditingTax(null);
//     setNewTax({
//       name: '',
//       rate: '',
//       type: 'inclusive',
//       description: '',
//       country: 'US'
//     });
//     toast({
//       title: "Success",
//       description: "Tax rate updated successfully"
//     });
//   };

//   const handleDeleteTax = (id) => {
//     setTaxRates(taxRates.filter(tax => tax.id !== id));
//     toast({
//       title: "Success",
//       description: "Tax rate deleted successfully"
//     });
//   };

//   const toggleActiveStatus = (id) => {
//     setTaxRates(taxRates.map(tax =>
//       tax.id === id ? { ...tax, active: !tax.active } : tax
//     ));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Tax Rates</h1>
//           <p className="text-muted-foreground">Manage tax rates for your invoices</p>
//         </div>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Tax Rate
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Tax Rate</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="taxName">Tax Name *</Label>
//                 <Input
//                   id="taxName"
//                   value={newTax.name}
//                   onChange={(e) => setNewTax({...newTax, name: e.target.value})}
//                   placeholder="e.g., Standard VAT"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="taxRate">Tax Rate (%) *</Label>
//                 <Input
//                   id="taxRate"
//                   type="number"
//                   step="0.01"
//                   value={newTax.rate}
//                   onChange={(e) => setNewTax({...newTax, rate: e.target.value})}
//                   placeholder="0.00"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="taxType">Tax Type</Label>
//                 <Select value={newTax.type} onValueChange={(value) => setNewTax({...newTax, type: value})}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select tax type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="inclusive">Tax Inclusive</SelectItem>
//                     <SelectItem value="exclusive">Tax Exclusive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={newTax.description}
//                   onChange={(e) => setNewTax({...newTax, description: e.target.value})}
//                   placeholder="Brief description of this tax rate"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="country">Country</Label>
//                 <Select value={newTax.country} onValueChange={(value) => setNewTax({...newTax, country: value})}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select country" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="US">United States</SelectItem>
//                     <SelectItem value="UK">United Kingdom</SelectItem>
//                     <SelectItem value="CA">Canada</SelectItem>
//                     <SelectItem value="IN">India</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
//                 <Button onClick={handleAddTax}>Save Tax Rate</Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-4">
//         {taxRates.map((tax) => (
//           <Card key={tax.id}>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="p-2 bg-primary/10 rounded-full">
//                     <Calculator className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <div className="flex items-center space-x-2">
//                       <h3 className="font-semibold">{tax.name}</h3>
//                       <Badge variant={tax.active ? 'default' : 'secondary'}>
//                         {tax.active ? 'Active' : 'Inactive'}
//                       </Badge>
//                       <Badge variant="outline">{tax.country}</Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{tax.description}</p>
//                     <div className="flex items-center space-x-4 mt-1">
//                       <span className="text-sm text-muted-foreground">
//                         Rate: <span className="font-medium">{tax.rate}%</span>
//                       </span>
//                       <span className="text-sm text-muted-foreground">
//                         Type: <span className="font-medium">{tax.type}</span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button variant="ghost" size="sm" onClick={() => toggleActiveStatus(tax.id)}>
//                     {tax.active ? 'Deactivate' : 'Activate'}
//                   </Button>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditTax(tax)}>
//                     <Edit className="h-4 w-4" />
//                   </Button>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant="ghost" size="sm">
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Delete Tax Rate</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           Are you sure you want to delete "{tax.name}"? This action cannot be undone.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={() => handleDeleteTax(tax.id)}>
//                           Delete
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Tax Rate</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="editTaxName">Tax Name *</Label>
//               <Input
//                 id="editTaxName"
//                 value={newTax.name}
//                 onChange={(e) => setNewTax({...newTax, name: e.target.value})}
//                 placeholder="e.g., Standard VAT"
//               />
//             </div>
//             <div>
//               <Label htmlFor="editTaxRate">Tax Rate (%) *</Label>
//               <Input
//                 id="editTaxRate"
//                 type="number"
//                 step="0.01"
//                 value={newTax.rate}
//                 onChange={(e) => setNewTax({...newTax, rate: e.target.value})}
//                 placeholder="0.00"
//               />
//             </div>
//             <div>
//               <Label htmlFor="editTaxType">Tax Type</Label>
//               <Select value={newTax.type} onValueChange={(value) => setNewTax({...newTax, type: value})}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select tax type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="inclusive">Tax Inclusive</SelectItem>
//                   <SelectItem value="exclusive">Tax Exclusive</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="editDescription">Description</Label>
//               <Input
//                 id="editDescription"
//                 value={newTax.description}
//                 onChange={(e) => setNewTax({...newTax, description: e.target.value})}
//                 placeholder="Brief description of this tax rate"
//               />
//             </div>
//             <div>
//               <Label htmlFor="editCountry">Country</Label>
//               <Select value={newTax.country} onValueChange={(value) => setNewTax({...newTax, country: value})}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select country" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="US">United States</SelectItem>
//                   <SelectItem value="UK">United Kingdom</SelectItem>
//                   <SelectItem value="CA">Canada</SelectItem>
//                   <SelectItem value="IN">India</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
//               <Button onClick={handleUpdateTax}>Update Tax Rate</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default TaxRates;

import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { fetchData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const TaxMaster = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    mt_id: null,
    mt_cess: "",
    mt_others: "",
  });

  // Fetch Tax List with pagination
  const fetchTaxes = async () => {
    try {
      const response = await fetchData("/tax", {
        params: {
          per_page: itemsPerPage,
          page: currentPage,
        },
      });

      if (response.success) {
        setTaxes(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.msg || "Failed to load taxes");
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
      toast.error("Something went wrong while fetching taxes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, [currentPage]);

  // Open edit dialog
  const fetchTaxById = async (id) => {
    try {
      const response = await fetchData(`/tax/${id}`);
      if (response.success) {
        setFormData({
          mt_id: response.data.mt_id || "",
          mt_cess: response.data.mt_cess || "",
          mt_others: response.data.mt_others || "",
        });
        setIsEditOpen(true);
      } else {
        toast.error(response.msg || "Failed to fetch tax data.");
      }
    } catch (error) {
      console.error("Error fetching tax:", error);
      toast.error("Unexpected error while fetching tax data.");
    }
  };

  // Handle Update
  // const handleUpdate = async () => {
  //   const payload = {
  //     mt_cess: formData.mt_cess,
  //     mt_others: formData.mt_others,
  //   };

  //   const response = await updateData(`/tax/update/${formData.mt_id}`, payload);

  //   if (response.success) {
  //     toast.success("Tax updated successfully!");
  //     setIsEditOpen(false);
  //     fetchTaxes();
  //   } else {
  //     toast.error(response.msg || "Failed to update tax.");
  //   }
  // };

  // Handle Update
  const handleUpdate = async () => {
    try {
      if (!formData.mt_id) {
        toast.error("Invalid Tax ID");
        return;
      }

      const payload = {
        mt_cess: formData.mt_cess === "" ? 0 : Number(formData.mt_cess),
        mt_others: formData.mt_others === "" ? 0 : Number(formData.mt_others),
      };

      const response = await updateData(
        `/tax/update/${formData.mt_id}`,
        payload
      );

      if (response.success) {
        toast.success("Tax updated successfully!");
        setIsEditOpen(false);
        fetchTaxes();
      } else {
        toast.error(response.msg || "Failed to update tax.");
      }
    } catch (error) {
      console.error("Error updating tax:", error);
      toast.error("Unexpected error while updating tax.");
    }
  };

  return (
    <div className="space-y-3">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">
            Tax Master
          </h1>
          <p className="text-muted-foreground">Manage tax percentages</p>
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
                    <TableHead className="text-center">Cess in %</TableHead>
                    <TableHead className="text-center">Others in %</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxes.map((tax, index) => (
                    <TableRow key={tax.mt_id}>
                      <TableCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {tax.mt_cess}
                      </TableCell>
                      <TableCell className="text-center">
                        {tax.mt_others}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => fetchTaxById(tax.mt_id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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
            <DialogTitle>Edit Tax</DialogTitle>
            <DialogDescription>Update tax percentages.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Cess in %</label>
              <Input
                type="number"
                value={formData.mt_cess}
                onChange={(e) =>
                  setFormData({ ...formData, mt_cess: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Others in %</label>
              <Input
                type="number"
                value={formData.mt_others}
                onChange={(e) =>
                  setFormData({ ...formData, mt_others: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Tax</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxMaster;
