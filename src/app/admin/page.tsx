import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const users = [
    { id: 'usr_001', name: 'Aarav Patel', joined: '2024-07-15', loans: 1 },
    { id: 'usr_002', name: 'Priya Sharma', joined: '2024-06-20', loans: 1 },
    { id: 'usr_003', name: 'Rohan Mehta', joined: '2024-07-01', loans: 1 },
    { id: 'usr_004', name: 'Sneha Reddy', joined: '2024-05-10', loans: 1 },
    { id: 'usr_005', name: 'Vikram Singh', joined: '2024-07-18', loans: 1 },
];

const transactions = [
    { id: "txn_001", user: "Aarav Patel", amount: "₹10,000", type: "Loan", status: "Active", date: "2024-07-15" },
    { id: "txn_002", user: "Priya Sharma", amount: "₹5,000", type: "EMI", status: "Repaid", date: "2024-06-20" },
    { id: "txn_003", user: "Rohan Mehta", amount: "₹25,000", type: "Loan", status: "Active", date: "2024-07-01" },
];

export default function AdminPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage users, transactions, and system settings.
          </p>
        </header>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="vault">Vault Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Active Loans</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>{user.loans}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A complete log of all system transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(txn => (
                      <TableRow key={txn.id}>
                        <TableCell>{txn.user}</TableCell>
                        <TableCell>{txn.amount}</TableCell>
                        <TableCell>{txn.type}</TableCell>
                        <TableCell>{txn.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vault">
            <Card>
              <CardHeader>
                <CardTitle>Vault Management</CardTitle>
                <CardDescription>Manually adjust vault balance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Vault Balance</p>
                    <p className="text-3xl font-bold">₹91,000.00</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="adjustment">Adjustment Amount (₹)</Label>
                    <Input id="adjustment" type="number" placeholder="e.g., 5000 or -5000" />
                </div>
                <div className="flex gap-4">
                    <Button>Add to Vault</Button>
                    <Button variant="destructive">Deduct from Vault</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
