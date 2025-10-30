"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const activeLoans = [
  { id: "txn_001", user: "Aarav Patel", total: 10000, paid: 2000 },
  { id: "txn_003", user: "Rohan Mehta", total: 25000, paid: 5000 },
  { id: "txn_005", user: "Vikram Singh", total: 50000, paid: 10000 },
];

export default function RepaymentsPage() {
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const { toast } = useToast();
  
  const selectedLoan = activeLoans.find(loan => loan.id === selectedLoanId);
  const outstandingBalance = selectedLoan ? selectedLoan.total - selectedLoan.paid : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) {
      toast({ title: "Error", description: "Please select a loan.", variant: "destructive" });
      return;
    }
    if (repaymentAmount <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }
    if (repaymentAmount > outstandingBalance) {
      toast({ title: "Error", description: `Amount cannot exceed outstanding balance of ₹${outstandingBalance.toLocaleString()}`, variant: "destructive" });
      return;
    }

    toast({
      title: "Repayment Successful",
      description: `₹${repaymentAmount.toLocaleString()} has been paid for ${selectedLoan.user}'s loan.`,
    });
    // Reset form
    setSelectedLoanId(null);
    setRepaymentAmount(0);
  };

  return (
    <AppLayout>
      <div className="grid max-w-4xl gap-8 mx-auto lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Process Repayment
            </h1>
            <p className="text-muted-foreground">
              Record a new repayment for a loan or EMI.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loan-select">Select Active Loan</Label>
              <Select onValueChange={setSelectedLoanId} value={selectedLoanId || ""}>
                <SelectTrigger id="loan-select">
                  <SelectValue placeholder="Select a loan to repay" />
                </SelectTrigger>
                <SelectContent>
                  {activeLoans.map(loan => (
                    <SelectItem key={loan.id} value={loan.id}>
                      {loan.user} - Outstanding: ₹{(loan.total - loan.paid).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Repayment Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={repaymentAmount || ""}
                onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                disabled={!selectedLoan}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedLoan || repaymentAmount <= 0}>
              Process Repayment
            </Button>
          </form>
        </div>

        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="font-headline">Repayment Summary</CardTitle>
            <CardDescription>
              Details of the selected loan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected User</span>
              <span className="font-medium">{selectedLoan?.user || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Loan Amount</span>
              <span className="font-medium">₹{selectedLoan?.total.toLocaleString() || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium">₹{selectedLoan?.paid.toLocaleString() || "0"}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold">
              <span>Outstanding Balance</span>
              <span>₹{outstandingBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Payment</span>
              <span className="font-medium">₹{repaymentAmount.toLocaleString()}</span>
            </div>
             <hr />
            <div className="flex justify-between font-bold">
              <span>Remaining Balance</span>
              <span>₹{(outstandingBalance - repaymentAmount).toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              The main vault balance will be updated upon successful repayment.
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
