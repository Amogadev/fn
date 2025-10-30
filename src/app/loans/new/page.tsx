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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const INTEREST_RATE = 0.1; // 10%

export default function NewLoanPage() {
  const [amount, setAmount] = useState(0);
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const interest = amount * INTEREST_RATE;
  const disbursedAmount = amount * (1 - INTEREST_RATE);
  const totalRepayable = amount;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid loan amount.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Loan Application Submitted",
      description: `Your request for ₹${amount.toLocaleString()} has been submitted for processing.`
    });
  };

  return (
    <AppLayout>
      <div className="grid max-w-4xl gap-8 mx-auto lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              New Loan Application
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to apply for a new loan or EMI.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user-select">Select User</Label>
              <Select>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Select a registered user" />
                </SelectTrigger>
                <SelectContent>
                  {/* No users by default */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount Requested (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 10000"
                value={amount || ""}
                onChange={handleAmountChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Loan Type</Label>
              <RadioGroup defaultValue="loan" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loan" id="loan" />
                  <Label htmlFor="loan">Loan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emi" id="emi" />
                  <Label htmlFor="emi">EMI</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Payment Frequency</Label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </div>

        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="font-headline">Loan Summary</CardTitle>
            <CardDescription>
              Details of your loan application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Requested</span>
              <span className="font-medium">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest (10%)</span>
              <span className="font-medium text-destructive">
                - ₹{interest.toLocaleString()}
              </span>
            </div>
            <hr />
            <div className="flex justify-between font-bold">
              <span>Amount to be Disbursed</span>
              <span>₹{disbursedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Repayable Amount</span>
              <span className="font-medium">₹{totalRepayable.toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              The disbursed amount will be deducted from the main vault.
              Interest is calculated upfront.
            </p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
