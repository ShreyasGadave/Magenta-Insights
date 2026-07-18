import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOutlets } from "@/context/OutletContext";
import type { Outlet, OutletStatus } from "@/types/outlet";
import OutletCard from "@/components/custom/Outletcard";
import {
  Search,
  Plus,
  Grid,
  List,
  Filter,
  ArrowUpDown,
  X,
  MapPin,
  Phone,
  User,
  Calendar,
  AlertCircle,
  RotateCcw,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormErrors {
  outletName?: string;
  ownerName?: string;
  contact?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  lastVisit?: string;
}

const emptyForm = {
  outletName: "",
  ownerName: "",
  contact: "",
  address: "",
  latitude: "",
  longitude: "",
  status: "Active" as OutletStatus,
  lastVisit: new Date().toISOString().split("T")[0],
};

const Outlets: React.FC = () => {
  const { outlets, addOutlet, updateOutlet, deleteOutlet } = useOutlets();
  const location = useLocation();

  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [visitFilter, setVisitFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name_asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Dialog States
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Form Field States
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Deep Link Selection (via Query Parameter e.g. /outlets?id=3)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");
    if (idParam) {
      const id = parseInt(idParam);
      const outlet = outlets.find((o) => o.id === id);
      if (outlet) {
        setSelectedOutlet(outlet);
        setIsDetailsOpen(true);
      }
    }
  }, [location.search, outlets]);

  // Helper utility: calculate days since visit
  const getDaysSince = (dateStr: string) => {
    const then = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return Math.floor((now - then) / (1000 * 60 * 60 * 24));
  };

  // Filtered & Sorted Outlets
  const processedOutlets = useMemo(() => {
    return outlets
      .filter((outlet) => {
        // Search filter
        const term = search.toLowerCase();
        const matchesSearch =
          outlet.outletName.toLowerCase().includes(term) ||
          outlet.ownerName.toLowerCase().includes(term) ||
          outlet.address.toLowerCase().includes(term) ||
          outlet.contact.includes(term);

        // Status filter
        const matchesStatus =
          statusFilter === "All" || outlet.status === statusFilter;

        // Visit filter (overdue if > 21 days)
        const days = getDaysSince(outlet.lastVisit);
        const matchesVisit =
          visitFilter === "All" ||
          (visitFilter === "Overdue" && days > 21) ||
          (visitFilter === "Recent" && days <= 21);

        return matchesSearch && matchesStatus && matchesVisit;
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === "name_asc")
          return a.outletName.localeCompare(b.outletName);
        if (sortBy === "name_desc")
          return b.outletName.localeCompare(a.outletName);
        if (sortBy === "visit_newest")
          return (
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          );
        if (sortBy === "visit_oldest")
          return (
            new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime()
          );
        if (sortBy === "status_asc") return a.status.localeCompare(b.status);
        return 0;
      });
  }, [outlets, search, statusFilter, visitFilter, sortBy]);

  // Open Form Dialog for ADD
  const handleOpenAdd = () => {
    setFormMode("add");
    setFormData({
      ...emptyForm,
      lastVisit: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Form Dialog for EDIT
  const handleOpenEdit = (outlet: Outlet) => {
    setFormMode("edit");
    setSelectedOutlet(outlet);
    setFormData({
      outletName: outlet.outletName,
      ownerName: outlet.ownerName,
      contact: outlet.contact,
      address: outlet.address,
      latitude: outlet.latitude.toString(),
      longitude: outlet.longitude.toString(),
      status: outlet.status,
      lastVisit: outlet.lastVisit,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open View Details Dialog
  const handleOpenView = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setIsDetailsOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDelete = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setIsDeleteOpen(true);
  };

  // Validation Logic
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.outletName.trim()) {
      errors.outletName = "Outlet name is required";
    } else if (formData.outletName.trim().length < 3) {
      errors.outletName = "Name must be at least 3 characters";
    }

    if (!formData.ownerName.trim()) {
      errors.ownerName = "Owner name is required";
    } else if (formData.ownerName.trim().length < 3) {
      errors.ownerName = "Owner name must be at least 3 characters";
    }

    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact.trim())) {
      errors.contact = "Must be a valid 10-digit number";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    const lat = parseFloat(formData.latitude);
    if (!formData.latitude) {
      errors.latitude = "Latitude is required";
    } else if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = "Must be between -90 and 90";
    }

    const lng = parseFloat(formData.longitude);
    if (!formData.longitude) {
      errors.longitude = "Longitude is required";
    } else if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = "Must be between -180 and 180";
    }

    if (!formData.lastVisit) {
      errors.lastVisit = "Last visit date is required";
    } else if (new Date(formData.lastVisit).getTime() > new Date().getTime()) {
      errors.lastVisit = "Date cannot be in the future";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the validation errors.");
      return;
    }

    const payload = {
      outletName: formData.outletName.trim(),
      ownerName: formData.ownerName.trim(),
      contact: formData.contact.trim(),
      address: formData.address.trim(),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      status: formData.status,
      lastVisit: formData.lastVisit,
    };

    if (formMode === "add") {
      addOutlet(payload);
      toast.success(`Successfully added ${payload.outletName}!`);
    } else {
      if (selectedOutlet) {
        updateOutlet(selectedOutlet.id, {
          id: selectedOutlet.id,
          ...payload,
        });
        toast.success(`Successfully updated ${payload.outletName}!`);
      }
    }
    setIsFormOpen(false);
  };

  // Confirm Deletion
  const handleConfirmDelete = () => {
    if (selectedOutlet) {
      deleteOutlet(selectedOutlet.id);
      toast.success(`Deleted ${selectedOutlet.outletName}.`);
      setIsDeleteOpen(false);
      setSelectedOutlet(null);
    }
  };

  // Helper styles for status badge
  const getBadgeStyle = (status: OutletStatus) => {
    if (status === "Active")
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (status === "Inactive")
      return "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20";
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Outlets Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Search, filter, sort, and execute CRUD operations on outlets.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="font-semibold gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Outlet
        </Button>
      </div>

      {/* Controls Bar */}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search bar */}
        <div className="relative md:col-span-4 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, owner, contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full focus:bg-background border-border/60"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters & Sorting */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:col-span-8 items-center w-full">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline" />
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val || "All")}
            >
              <SelectTrigger className="w-full h-10  border border-border/60 bg-background/50 text-xs font-semibold text-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active Only</SelectItem>
                <SelectItem value="Inactive">Inactive Only</SelectItem>
                <SelectItem value="Prospect">Prospects Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visit Recency Filter */}
          <Select
            value={visitFilter}
            onValueChange={(val) => setVisitFilter(val || "All")}
          >
            <SelectTrigger className="w-full h-10 border border-border/60 bg-background/50 text-xs font-semibold text-foreground">
              <SelectValue placeholder="Visits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Visits</SelectItem>
              <SelectItem value="Overdue">Overdue (&gt;21 Days)</SelectItem>
              <SelectItem value="Recent">Recent (&le;21 Days)</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:inline" />
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val || "name_asc")}
            >
              <SelectTrigger className="w-full h-10  border border-border/60 bg-background/50 text-xs font-semibold text-foreground">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name (A - Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z - A)</SelectItem>
                <SelectItem value="visit_newest">
                  Last Visit (Newest)
                </SelectItem>
                <SelectItem value="visit_oldest">
                  Last Visit (Oldest)
                </SelectItem>
                <SelectItem value="status_asc">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Grid/Table Toggle */}
          <div className="flex bg-accent/30 border border-border/40 p-1 items-center justify-between h-10 w-full max-w-[120px] ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 flex items-center justify-center h-8 transition-colors ${
                viewMode === "grid"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 flex items-center justify-center h-8  transition-colors ${
                viewMode === "table"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Outlet Display area */}
      {processedOutlets.length > 0 ? (
        viewMode === "grid" ? (
          /* Grid Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedOutlets.map((outlet) => (
              <OutletCard
                key={outlet.id}
                outlet={outlet}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        ) : (
          /* Table Mode */
          <div className="bg-card border border-border/40 shadow-sm overflow-hidden">
            <Table className="min-w-225">
              <TableHeader>
                <TableRow className="bg-accent/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 hover:bg-accent/40">
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Outlet Name
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Owner Name
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Contact
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Address
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Coordinates
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground">
                    Last Visit
                  </TableHead>
                  <TableHead className="font-bold py-3.5 px-4 h-auto text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedOutlets.map((outlet) => {
                  const overdue = getDaysSince(outlet.lastVisit) > 21;
                  return (
                    <TableRow
                      key={outlet.id}
                      className="text-xs hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4 px-4 font-semibold text-foreground">
                        {outlet.outletName}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground font-medium">
                        {outlet.ownerName}
                      </TableCell>
                      <TableCell className="py-4 px-4 font-mono text-muted-foreground">
                        {outlet.contact}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-muted-foreground max-w-xs truncate">
                        {outlet.address}
                      </TableCell>
                      <TableCell className="py-4 px-4 font-mono text-[10px] text-muted-foreground">
                        {outlet.latitude.toFixed(4)},{" "}
                        {outlet.longitude.toFixed(4)}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Badge
                          variant={
                            outlet.status === "Active"
                              ? "default"
                              : outlet.status === "Inactive"
                                ? "secondary"
                                : "outline"
                          }
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${getBadgeStyle(outlet.status)}`}
                        >
                          {outlet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4 font-semibold">
                        <span
                          className={
                            overdue ? "text-destructive" : "text-foreground"
                          }
                        >
                          {new Date(outlet.lastVisit).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        {overdue && (
                          <span className="text-destructive font-semibold">
                            {" "}
                            · overdue
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 rounded-lg hover:bg-accent/80 border-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36 font-[Outfit] border border-border/40">
                            <DropdownMenuItem
                              onClick={() => handleOpenView(outlet)}
                              className="cursor-pointer gap-2"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(outlet)}
                              className="cursor-pointer gap-2"
                            >
                              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Edit Outlet</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/40" />
                            <DropdownMenuItem
                              onClick={() => handleOpenDelete(outlet)}
                              variant="destructive"
                              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-card border border-border/40 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm mt-8">
          <div className="size-12  bg-accent/40 flex items-center justify-center text-muted-foreground/80 mb-4 border border-border/10">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground font-[Outfit]">
            No outlets found
          </h3>
          <p className="text-muted-foreground text-xs mt-1 px-4 leading-relaxed">
            We couldn't find any outlets matching your search terms or filters.
            Try adjusting your search query, status, or visit criteria.
          </p>
          <div className="flex gap-3 mt-6">
            {(search || statusFilter !== "All" || visitFilter !== "All") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setVisitFilter("All");
                }}
                className="gap-1.5 font-semibold text-xs "
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="font-semibold text-xs gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Outlet
            </Button>
          </div>
        </div>
      )}

      {/* 1. Add / Edit Outlet Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="font-bold font-[Outfit] text-lg">
              {formMode === "add" ? "Add New Outlet" : "Edit Outlet Details"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provide necessary outlet, contact, status, and geographic
              coordinates information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-3">
              {/* Outlet Name */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Outlet Name *
                </label>
                <Input
                  value={formData.outletName}
                  onChange={(e) =>
                    setFormData({ ...formData, outletName: e.target.value })
                  }
                  placeholder="e.g. Apollo Pharmacy"
                  className={`h-9 text-xs border-border/60 ${formErrors.outletName ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
                {formErrors.outletName && (
                  <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {formErrors.outletName}
                  </p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Owner Name *
                </label>
                <Input
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  placeholder="e.g. Ramesh Patil"
                  className={`h-9 text-xs border-border/60 ${formErrors.ownerName ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
                {formErrors.ownerName && (
                  <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {formErrors.ownerName}
                  </p>
                )}
              </div>

              {/* Contact */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Contact Number (10 digits) *
                </label>
                <Input
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  placeholder="e.g. 9876543210"
                  className={`h-9 text-xs border-border/60 font-mono ${formErrors.contact ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
                {formErrors.contact && (
                  <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {formErrors.contact}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Address *
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. Hinjewadi, Pune"
                  className={`h-9 text-xs border-border/60 ${formErrors.address ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
                {formErrors.address && (
                  <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {formErrors.address}
                  </p>
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Latitude (-90 to 90) *
                  </label>
                  <Input
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="e.g. 18.5204"
                    className={`h-9 text-xs border-border/60 font-mono ${formErrors.latitude ? "border-destructive ring-1 ring-destructive" : ""}`}
                  />
                  {formErrors.latitude && (
                    <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.latitude}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Longitude (-180 to 180) *
                  </label>
                  <Input
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="e.g. 73.8567"
                    className={`h-9 text-xs border-border/60 font-mono ${formErrors.longitude ? "border-destructive ring-1 ring-destructive" : ""}`}
                  />
                  {formErrors.longitude && (
                    <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.longitude}
                    </p>
                  )}
                </div>
              </div>

              {/* Status and Last Visit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData({ ...formData, status: val as OutletStatus })
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-xs border-border/60">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Last Visit Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.lastVisit}
                    onChange={(e) =>
                      setFormData({ ...formData, lastVisit: e.target.value })
                    }
                    className={`h-9 text-xs border-border/60 ${formErrors.lastVisit ? "border-destructive ring-1 ring-destructive" : ""}`}
                  />
                  {formErrors.lastVisit && (
                    <p className="text-[10px] text-destructive mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.lastVisit}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className=" text-xs font-semibold shadow-sm"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. View Outlet Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md w-full ">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle className="font-extrabold font-[Outfit] text-lg text-foreground">
                {selectedOutlet?.outletName}
              </DialogTitle>
              {selectedOutlet && (
                <Badge
                  variant={
                    selectedOutlet.status === "Active"
                      ? "default"
                      : selectedOutlet.status === "Inactive"
                        ? "secondary"
                        : "outline"
                  }
                  className={`text-[9px] font-semibold h-4 px-2 rounded-full border ${getBadgeStyle(selectedOutlet.status)}`}
                >
                  {selectedOutlet.status}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs">
              Detailed metadata and coordinates for audit and field visit logs.
            </DialogDescription>
          </DialogHeader>

          {selectedOutlet && (
            <div className="space-y-4 py-3">
              <div className="grid grid-cols-1 gap-3.5">
                {/* Details Section */}
                <div className="flex items-center gap-3 bg-accent/20 p-3  border border-border/10">
                  <User className="h-4.5 w-4.5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">
                      Outlet Owner
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {selectedOutlet.ownerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-accent/20 p-3  border border-border/10">
                  <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">
                      Contact Number
                    </p>
                    <p className="text-sm font-mono font-bold text-foreground mt-0.5">
                      {selectedOutlet.contact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-accent/20 p-3  border border-border/10">
                  <MapPin className="h-4.5 w-4.5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">
                      Address
                    </p>
                    <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                      {selectedOutlet.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-accent/20 p-3 border border-border/10">
                  <Calendar className="h-4.5 w-4.5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">
                      Last Audit / Visit
                    </p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {new Date(selectedOutlet.lastVisit).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({getDaysSince(selectedOutlet.lastVisit)} days ago)
                      </span>
                    </p>
                  </div>
                </div>

                {/* GPS Coordinates & Google Maps Link */}
                <div className="bg-secondary/40 p-4.5  border border-border/20 text-xs flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">
                      GPS Location
                    </span>
                    <span className="font-mono bg-accent/50 text-[10px] font-bold px-2 py-0.5 rounded text-muted-foreground border border-border/10">
                      {selectedOutlet.latitude.toFixed(6)},{" "}
                      {selectedOutlet.longitude.toFixed(6)}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedOutlet.latitude},${selectedOutlet.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-3  border border-primary/20 transition-all duration-200"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Navigate via Google Maps
                  </a>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className=" text-xs font-semibold w-full"
                >
                  Close Details
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 3. Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm ">
          <DialogHeader>
            <DialogTitle className="font-extrabold font-[Outfit] text-lg text-destructive">
              Delete Outlet?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                {selectedOutlet?.outletName}
              </span>
              ? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className=" text-xs font-semibold flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className=" text-xs font-semibold flex-1 shadow-sm"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Outlets;
