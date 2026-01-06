"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="group relative transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-black/20 dark:hover:shadow-black/60 hover:shadow-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-400 bg-white dark:bg-[#0f172a] p-4">
      <Link href={`/account/${id}`} className="block">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold capitalize text-neutral-900 dark:text-neutral-100 group-hover:text-black transition-colors">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
            className="bg-black border border-neutral-800 dark:bg-black dark:border-neutral-700 relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-in-out data-[state=checked]:bg-black data-[state=unchecked]:bg-black"
          >
            <div className="pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white ring-2 ring-white shadow-black shadow-md transition-transform duration-300 data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[4px]" />
          </Switch>
        </CardHeader>

        <CardContent>
          <div className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500 transition-transform group-hover:translate-y-[-1px]" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500 transition-transform group-hover:translate-y-[1px]" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};
