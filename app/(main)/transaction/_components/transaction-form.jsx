"use client";

import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ReceiptScanner } from "./receipt-scanner";
import { deserializeJsonResponse } from "@prisma/client/runtime/library";

const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction Updated Succesfully"
          : "Transaction created succesfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
    w-full max-w-3xl mx-auto
    p-10 space-y-7
    bg-white
    rounded-3xl
    border border-gray-200
    shadow-[0_20px_45px_rgba(0,0,0,0.2)]
    cursor-pointer
  "
    >
      {/* AI Recipt Scanner */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger
            className="
          h-13 rounded-2xl
          bg-white
          border-2 border-gray-400
          shadow-[0_10px_25px_rgba(0,0,0,0.18)]
          hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]
          transition-all
        "
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>

          <SelectContent className="shadow-xl">
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount + Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="
          h-12 rounded-xl
          bg-gray-50
          border-gray-300
          shadow-inner
        "
            {...register("amount")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger
              className="
            h-13 rounded-2xl
            bg-white
            border-2 border-gray-400
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]
            hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]
            transition-all
          "
            >
              <SelectValue placeholder="Select account" />
            </SelectTrigger>

            <SelectContent className="shadow-xl">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} — ${parseFloat(account.balance).toFixed(2)}
                </SelectItem>
              ))}

              <CreateAccountDrawer>
                <Button variant="ghost" className="w-full justify-start">
                  + Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger
            className="
          h-13 rounded-2xl
          bg-white
          border-2 border-gray-400
          shadow-[0_10px_25px_rgba(0,0,0,0.18)]
          hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]
          transition-all
        "
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent className="shadow-xl">
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="
            h-13 w-full rounded-2xl
            bg-white text-left
            border-2 border-gray-400
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]
            hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]
          "
            >
              {date ? format(date, "PPP") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="shadow-xl border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="Optional note"
          className="
        h-12 rounded-xl
        bg-gray-50
        border-gray-300
        shadow-inner
      "
          {...register("description")}
        />
      </div>

      {/* Recurring */}
      <div
        className="
      flex items-center justify-between
      rounded-2xl p-5
      bg-white
      border border-gray-300
      shadow-[0_12px_30px_rgba(0,0,0,0.18)]
    "
      >
        <div>
          <p className="font-medium">Recurring Transaction</p>
          <p className="text-sm text-gray-500">Repeat automatically</p>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

      {/* Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger
              className="
            h-13 rounded-2xl
            bg-white
            border-2 border-gray-400
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]
            hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]
          "
            >
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>

            <SelectContent className="shadow-xl">
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border-gray-400 shadow-sm cursor-pointer"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="
        h-12 rounded-xl
        bg-black text-white
        shadow-[0_14px_35px_rgba(0,0,0,0.35)]
        hover:bg-gray-900 cursor-pointer
      "
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
