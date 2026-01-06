"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export const TransactionTable = ({ transactions }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 bg-gray-50 border border-gray-200 shadow-inner focus:ring-2 focus:ring-purple-400 rounded-md h-full"
          />
        </div>

        <div className="flex gap-2 items-stretch">
          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] bg-white border border-gray-300 shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md mt-1 p-1">
              <SelectItem
                value="INCOME"
                className="px-3 py-2 rounded hover:bg-purple-100 hover:text-purple-800 text-sm cursor-pointer transition"
              >
                Income
              </SelectItem>
              <SelectItem
                value="EXPENSE"
                className="px-3 py-2 rounded hover:bg-purple-100 hover:text-purple-800 text-sm cursor-pointer transition"
              >
                Expense
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Recurring Filter */}
          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] bg-white border border-gray-300 shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md mt-1 p-1">
              <SelectItem
                value="recurring"
                className="px-3 py-2 rounded hover:bg-purple-100 hover:text-purple-800 text-sm cursor-pointer transition"
              >
                Recurring Only
              </SelectItem>
              <SelectItem
                value="non-recurring"
                className="px-3 py-2 rounded hover:bg-purple-100 hover:text-purple-800 text-sm cursor-pointer transition"
              >
                Non-recurring Only
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Delete */}
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white shadow-md transition"
              onClick={handleBulkDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}

          {/* Clear Filters */}
          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              title="Clear filters"
              onClick={handleClearFilters}
              className="bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table className="min-w-full bg-white">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[100px]">
                <Checkbox
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-purple-600 transition"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer hover:text-purple-600 transition"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-purple-600 transition"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                      className="cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="gap-1 bg-purple-100 text-purple-800 border border-purple-200 shadow-sm cursor-pointer"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction.nextRecurringDate),
                                "PPP"
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-2 bg-gray-100 text-gray-800 border border-gray-200 shadow-sm"
                      >
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border border-gray-200 shadow-md rounded-md"
                      >
                        <DropdownMenuItem
                          className="hover:bg-gray-100 px-4 py-2 text-sm text-gray-700 cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive hover:bg-red-100 px-4 py-2 text-sm cursor-pointer"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`rounded-md px-2 py-2 text-white bg-black hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="h-4 w-4 cursor-pointer" />
          </Button>

          <span className="text-sm font-medium text-gray-800">
            Page <span className="font-semibold text-black">{currentPage}</span>{" "}
            of <span className="text-black">{totalPages}</span>
          </span>

          <Button
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`rounded-md px-2 py-2 text-white bg-black hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ChevronRight className="h-4 w-4 cursor-pointer" />
          </Button>
        </div>
      )}
    </div>
  );
};
