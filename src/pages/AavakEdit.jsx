/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Minus,
  Save,
  Printer,
  ArrowLeft,
  XCircle,
  Pencil,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import { fetchData, postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const EditAavak = () => {
  const { id } = useParams();
  console.log("Edit ID:", id);
  const navigate = useNavigate();
  const [farmerName, setFarmerName] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [date, setDate] = useState("");
  const [vehicleRent, setVehicleRent] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [others, setOthers] = useState(0);
  const [avakId, setAvakId] = useState(null);
  const [othersLabel, setOthersLabel] = useState("");
  const [isEditingOthersLabel, setIsEditingOthersLabel] = useState(false);
  const othersLabelRef = useRef(null);
  const [printSize, setPrintSize] = useState("58mm");
  const [items, setItems] = useState([]);
  const [farmerId, setFarmerId] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // ✅ Track update status

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    setDate(today);
  }, []);

  useEffect(() => {
    const fetchAvakData = async () => {
      try {
        const res = await fetchData(`/avak/${id}`); // `id` from useParams()
        // console.log("Avak API Response:", res);
        if (res.success) {
          const { avak, items } = res.data;

          setAvakId(avak.am_id);
          setFarmerName(avak.am_farmer_name);
          setFarmerId(avak.am_farmer_id);
          setBillNumber(avak.am_bill_no);
          setVehicleRent(parseFloat(avak.am_vehicle_rent));
          setAdvance(parseFloat(avak.am_advance));
          setOthers(parseFloat(avak.am_others));
          setOthersLabel(avak.am_others_label || "");

          // set items array
          const formattedItems = items.map((item) => ({
            id: nanoid(), // for local tracking
            vegetableName: item.ai_vegetable_name,
            quantity: parseFloat(item.ai_quantity),
            unit: item.ai_unit,
            rate: parseFloat(item.ai_rate),
            hamaliPerBag: parseFloat(item.ai_hamali_per_bag),
            hamaliAmount: parseFloat(item.ai_hamali_amount),
            totalAmount: parseFloat(item.ai_total_amount),
          }));

          setItems(formattedItems);
        } else {
          toast.error(res.data.message || "Failed to fetch Avak data.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Something went wrong.");
      }
    };

    fetchAvakData();
  }, [id]);

  const handleUpdateAvak = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const payload = {
        am_farmer_id: farmerId,
        am_farmer_name: farmerName,
        am_purchase_date: date,
        am_vehicle_rent: parseFloat(vehicleRent || 0),
        am_advance: parseFloat(advance || 0),
        am_others: parseFloat(others || 0),
        am_others_label: othersLabel || null,
        items: items.map((item) => ({
          ai_vegetable_name: item.vegetableName,
          ai_quantity: parseFloat(item.quantity),
          ai_unit: item.unit,
          ai_rate: parseFloat(item.rate),
          ai_hamali_per_bag: parseFloat(item.hamaliPerBag || 0),
        })),
      };

      const result = await updateData(`/avak/update/${avakId}`, payload); // Use relative URL

      if (result.success) {
        toast.success("Avak updated successfully!");
        // Navigate or refresh logic here
        // navigate("/aavak")
        setIsUpdated(true);
        return avakId;
      } else {
        toast.error("Failed to update Avak.");
        return null;
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong. Please try again.");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const clamp = (val) => Math.max(0, Math.min(val, 99999));

  const updateItem = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        const quantity = parseFloat(updated.quantity) || 0;
        const rate = parseFloat(updated.rate) || 0;
        const hamaliPerBag = parseFloat(updated.hamaliPerBag) || 0;

        updated.hamaliAmount =
          updated.unit === "Bags" ? quantity * hamaliPerBag : hamaliPerBag;

        updated.totalAmount = quantity * rate + updated.hamaliAmount;

        return updated;
      })
    );
  };

  const addItem = () => {
    const newItem = {
      id: nanoid(),
      vegetable: "",
      quantity: 0,
      unit: "Kg",
      rate: 0,
      hamaliPerBag: 0,
      hamaliAmount: 0,
      totalAmount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const totalHamali = items.reduce((sum, item) => sum + item.hamaliAmount, 0);
  const expenseTotal = vehicleRent + advance + others + totalHamali;
  const netAmount = subtotal - expenseTotal;

  const formatCurrency = (value) =>
    `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // const handlePrint = async () => {

  //   const updatedId = await handleUpdateAvak();
  //   if (updatedId) {
  //     navigate(`/aavak/${updatedId}/print`);
  //   }
  // };

  const handlePrint = () => {
    if (!avakId) {
      toast.error("No Avak ID to print");
      return;
    }

    navigate(`/aavak/${avakId}/print`);
  };

  // const handleClearForm = () => {
  //   setFarmerName("");
  //   setBillNumber("");
  //   setDate("");
  //   setVehicleRent(0);
  //   setAdvance(0);
  //   setOthers(0);
  //   setItems([
  //     {
  //       id: "1",
  //       vegetable: "",
  //       quantity: 0,
  //       unit: "Kg",
  //       rate: 0,
  //       hamaliPerBag: 0,
  //       hamaliAmount: 0,
  //       totalAmount: 0,
  //     },
  //   ]);
  // };
  /**
   * Clears the value if it's "0" or "0.00" on focus.
   * @param {React.FocusEvent} e
   */
  const handleFocus = (e) => {
    if (e.target.value === "0" || e.target.value === "0.00") {
      e.target.value = "";
    }
  };

  const handleBlur = (e, setter) => {
    const value = e.target.value.trim();

    // If empty, set to 0
    if (value === "") {
      setter(0);
      e.target.value = "0";
      return;
    }

    let parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) parsed = 0;
    if (parsed > 99999) parsed = 99999;

    setter(parsed);
    e.target.value = parsed.toString(); // Ensure value updates on blur
  };

  return (
    <div className="space-y-3">
      <Toaster position="top-right" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/aavak")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Edit Aavak</h1>
          <p className="text-muted-foreground">
            Modify and update aavak record
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Left section */}
        <div className="lg:col-span-3 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                {/* Farmer Name - Bigger */}
                <div className="flex flex-col flex-[2]">
                  <Label htmlFor="farmerName">Farmer Name</Label>
                  <Input
                    id="farmerName"
                    value={farmerName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFarmerName(name);

                      // Try to find the farmer object from the name
                      const matchedFarmer = farmers.find(
                        (f) => f.mf_name === name
                      );
                      if (matchedFarmer) {
                        setFarmerId(matchedFarmer.mf_id); // ✅ store the ID
                      } else {
                        setFarmerId(null); // reset if not matched
                      }
                    }}
                    placeholder="Type to search farmers..."
                    list="farmers"
                  />
                  <datalist id="farmers">
                    {farmers.map((farmer) => (
                      <option key={farmer.mf_id} value={farmer.mf_name} />
                    ))}
                  </datalist>
                </div>

                {/* Bill Number - Smaller */}
                <div className="flex flex-col flex-[1]">
                  <Label htmlFor="billNo">Bill No</Label>
                  <Input
                    id="billNo"
                    value={billNumber}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Date - Smaller */}
                <div className="flex flex-col flex-[1]">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items</CardTitle>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vegetable</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Hamali/Bag</TableHead>
                    <TableHead className="text-right"> Hamali Amt</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          className="w-[220px]"
                          value={item.vegetableName}
                          onChange={(e) =>
                            updateItem(item.id, "vegetableName", e.target.value)
                          }
                          placeholder="Vegetable..."
                          list="vegetables"
                        />
                        <datalist id="vegetables">
                          {vegetables.map((veg) => (
                            <option key={veg} value={veg} />
                          ))}
                        </datalist>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-[80px]"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              clamp(parseFloat(e.target.value) || 0)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.unit}
                          onValueChange={(val) =>
                            updateItem(item.id, "unit", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Nos">Nos</SelectItem>
                            <SelectItem value="Bags">Bags</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-[100px]"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "rate",
                              clamp(parseFloat(e.target.value) || 0)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-[80px]"
                          value={item.hamaliPerBag}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "hamaliPerBag",
                              clamp(parseFloat(e.target.value) || 0)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right w-[120px]">
                        {formatCurrency(item.hamaliAmount)}
                      </TableCell>
                      <TableCell className="text-right w-[130px]">
                        {formatCurrency(item.totalAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Additional Charges</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Row 1: Vehicle Rent + Advance */}
              <div className="flex gap-2 mb-2">
                {/* Vehicle Rent */}
                <div className="flex flex-col w-full">
                  <Label htmlFor="vehicleRent">Vehicle Rent</Label>
                  <Input
                    id="vehicleRent"
                    type="number"
                    value={vehicleRent}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setVehicleRent(val < 0 ? 0 : Math.min(val, 99999));
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setVehicleRent)}
                    placeholder="0"
                  />
                </div>

                {/* Advance */}
                <div className="flex flex-col w-full">
                  <Label htmlFor="advance">Advance</Label>
                  <Input
                    id="advance"
                    type="number"
                    value={advance}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setAdvance(val < 0 ? 0 : Math.min(val, 99999));
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setAdvance)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Row 2: Others */}
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <Label htmlFor="others" className="flex items-center gap-2">
                    <span>Others</span>
                    <span
                      ref={othersLabelRef}
                      contentEditable
                      suppressContentEditableWarning
                      onClick={() => {
                        setIsEditingOthersLabel(true);
                        setOthersLabel("");
                        setTimeout(() => {
                          if (othersLabelRef.current) {
                            othersLabelRef.current.innerText = "";
                            othersLabelRef.current.focus();
                          }
                        }, 0);
                      }}
                      onBlur={(e) => {
                        const text = e.currentTarget.textContent?.trim() ?? "";
                        setOthersLabel(text);
                        setIsEditingOthersLabel(false);
                      }}
                      className={`inline-block min-w-[100px] px-1 text-sm outline-none border-b transition-colors ${
                        isEditingOthersLabel
                          ? "border-primary text-primary"
                          : "border-dashed border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {othersLabel || "Add Label"}
                    </span>
                  </Label>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      title="Edit Label"
                      onClick={() => {
                        setIsEditingOthersLabel(true);
                        setOthersLabel("");
                        setTimeout(() => {
                          if (othersLabelRef.current) {
                            othersLabelRef.current.innerText = "";
                            othersLabelRef.current.focus();
                          }
                        }, 0);
                      }}
                    >
                      <Pencil className="h-4 w-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      title="Clear Label"
                      onClick={() => {
                        setOthersLabel("");
                        if (othersLabelRef.current) {
                          othersLabelRef.current.innerText = "";
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <Input
                  id="others"
                  type="number"
                  value={others}
                  onChange={(e) => setOthers(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (Items):</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Vehicle Rent:</span>
                <span>-{formatCurrency(vehicleRent)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Advance:</span>
                <span>-{formatCurrency(advance)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Others:</span>
                <span>-{formatCurrency(others)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total Hamali:</span>
                <span>-{formatCurrency(totalHamali)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Expense Total:</span>
                <span>-{formatCurrency(expenseTotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Net Amount:</span>
                <span className="text-green-600">
                  {formatCurrency(netAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="sticky bottom-0 z-10 bg-white shadow-md border-t">
            <CardFooter className="flex justify-center py-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleUpdateAvak}
                  disabled={isUpdating || isUpdated}
                >
                  {isUpdating
                    ? "Updating..."
                    : isUpdated
                    ? "Updated"
                    : "Update Aavak"}
                </Button>

                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={handlePrint}
                  disabled={!isUpdated}
                  title={!isUpdated ? "Please update first" : "Print Aavak"}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditAavak;
