import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "repaid":
      return "default";
    case "active":
      return "secondary";
    case "overdue":
      return "destructive";
    default:
      return "outline";
  }
};

export default function HistoryPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Transaction History
          </h1>
          <p className="text-muted-foreground">
            A complete record of all loan activities.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Loans</CardTitle>
            <CardDescription>
              Browse and manage all loan records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">No transactions found.</TableCell>
                    </TableRow>
                ) : transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.user}</TableCell>
                    <TableCell className="text-right">{txn.amount}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(txn.status)}>
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{txn.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
