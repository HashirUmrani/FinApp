import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AccountCard } from "./_component/account-card";
import { BudgetProgress } from "./_component/budget-progress";
import { getCurrentBudget } from "@/actions/budget";
import DashboardOverview from "./_component/transaction-overview";

export default async function DashboardPage() {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Account grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card
            className="group cursor-pointer bg-white dark:bg-gray-900 border border-dashed border-gray-300 hover:border-primary
              rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]
              transform hover:scale-[1.025]"
          >
            <CardContent
              className="flex flex-col items-center justify-center h-32 p-5 text-center 
                text-muted-foreground group-hover:text-primary transition-colors duration-300"
            >
              <div
                className="flex items-center justify-center w-10 h-10 mb-2 rounded-full 
                  bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  );
}
