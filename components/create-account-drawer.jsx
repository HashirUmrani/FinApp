"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-[#111] shadow-2xl rounded-t-2xl border-none">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Account
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Account Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                className="bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition rounded-md"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-1.5">
              <label
                htmlFor="type"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger
                  id="type"
                  className="bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition rounded-md"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 shadow-xl border-none rounded-md">
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Initial Balance */}
            <div className="space-y-1.5">
              <label
                htmlFor="balance"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition rounded-md"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

            {/* Default Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-gray-100 dark:bg-gray-800 p-4 transition shadow-sm">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium text-gray-800 dark:text-gray-200"
                >
                  Set as Default
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 cursor-pointer border border-gray-300 hover:border-black dark:hover:border-white transition"
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
