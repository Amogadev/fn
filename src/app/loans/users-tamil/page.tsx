"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const loanUsers = [
  {
    id: "user_001",
    name: "குமார்",
    loanAmount: "₹10,000",
    paidAmount: "₹2,000",
    status: "செயலில்",
    nextDueDate: "2024-08-15",
  },
  {
    id: "user_002",
    name: "பிரியா",
    loanAmount: "₹5,000",
    paidAmount: "₹5,000",
    status: "முடிந்தது",
    nextDueDate: "-",
  },
  {
    id: "user_003",
    name: "ராஜேஷ்",
    loanAmount: "₹25,000",
    paidAmount: "₹10,000",
    status: "செயலில்",
    nextDueDate: "2024-08-20",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "செயலில்":
      return "secondary";
    case "முடிந்தது":
      return "default";
    default:
      return "outline";
  }
};

export default function LoanUsersPage() {
  return (
    <TamilAppLayout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">
                    கடன் பயனர் பட்டியல்
                </h1>
                <p className="text-muted-foreground">
                    அனைத்து செயலில் உள்ள மற்றும் முடிக்கப்பட்ட கடன்களை நிர்வகிக்கவும்.
                </p>
            </div>
            <div className="flex gap-4">
                <Link href="/dashboard-tamil">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        முகப்புக்குத் திரும்பு
                    </Button>
                </Link>
                <Link href="/loans/new-tamil">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        புதிய பயனரைச் சேர்
                    </Button>
                </Link>
            </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>செயலில் உள்ள பயனர்கள்</CardTitle>
            <CardDescription>கடன் திட்டத்தில் பதிவுசெய்யப்பட்ட பயனர்களின் பட்டியல்.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>பெயர்</TableHead>
                  <TableHead>கடன் தொகை</TableHead>
                  <TableHead>செலுத்திய தொகை</TableHead>
                  <TableHead>நிலை</TableHead>
                  <TableHead>அடுத்த தவணை தேதி</TableHead>
                  <TableHead className="text-right">செயல்கள்</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.loanAmount}</TableCell>
                    <TableCell>{user.paidAmount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.nextDueDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        நிர்வகி
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TamilAppLayout>
  );
}
