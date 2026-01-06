"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React, { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DashboardOverview = ({ accounts, transactions }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9FA8DA",
  ];

  //Filter transaction for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 shadow-[0_20px_40px_rgba(99,102,241,0.25)] rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-sm font-semibold tracking-wide text-indigo-700">
            Recent Transactions
          </CardTitle>

          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[160px] bg-white/70 backdrop-blur-md border-indigo-200 shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl bg-white/70 backdrop-blur-md p-4 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
                      transaction.type === "EXPENSE"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="border-0 bg-gradient-to-br from-rose-50 via-white to-rose-100 shadow-[0_20px_40px_rgba(244,63,94,0.25)] rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-rose-700">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-6">
          {pieChartData.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              No expenses this month
            </p>
          ) : (
            <div className="h-[320px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
