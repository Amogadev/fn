import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Landmark, ArrowUpRight, Percent, Users } from "lucide-react";

const stats = [
  {
    title: "Main Vault Balance",
    value: "₹91,000",
    icon: Landmark,
    change: "+ ₹5,000 today",
    changeType: "increase",
  },
  {
    title: "Total Loans Given",
    value: "₹9,000",
    icon: ArrowUpRight,
    change: "12 loans active",
  },
  {
    title: "Total Interest Earned",
    value: "₹1,250",
    icon: Percent,
    change: "+ ₹150 this week",
    changeType: "increase",
  },
  {
    title: "Active Borrowers",
    value: "8",
    icon: Users,
    change: "2 new this month",
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your loan management system.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Transaction history will be displayed here.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Repayment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Upcoming repayments will be shown here.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
