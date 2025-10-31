
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export default function EditLoanUserPage({ params: { id } }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user: authUser, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !id || !authUser) return null;
    return doc(firestore, 'loan-users', id);
  }, [firestore, id, authUser]);

  const { data: user, isLoading: isDocLoading } = useDoc(userDocRef);

  const [fullName, setFullName] = useState("");
  const [paidAmount, setPaidAmount] = useState<number | string>("");

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setPaidAmount(user.paidAmount);
    }
  }, [user]);

  const handleUpdateUser = async () => {
    if (!firestore || !userDocRef) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore not available.",
      });
      return;
    }
    
    if (!fullName) {
      toast({
        variant: "destructive",
        title: "தகவல் இல்லை",
        description: "தயவுசெய்து முழுப் பெயரை நிரப்பவும்.",
      });
      return;
    }

    const newPaidAmount = Number(paidAmount);
    let newStatus = user?.status;
    if (newPaidAmount >= (user?.loanAmount || 0)) {
        newStatus = 'முடிந்தது';
    } else {
        newStatus = 'செயலில்';
    }

    try {
      await updateDoc(userDocRef, {
        name: fullName,
        paidAmount: newPaidAmount,
        status: newStatus,
      });

      toast({
        title: "பயனர் புதுப்பிக்கப்பட்டார்!",
        description: `${fullName} விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன.`,
      });

      router.push("/loans/users-tamil");
    } catch (error) {
      console.error("Error updating user: ", error);
      toast({
        variant: "destructive",
        title: "பிழை",
        description: "பயனரைப் புதுப்பிப்பதில் பிழை ஏற்பட்டது.",
      });
    }
  };

  const isLoading = isUserLoading || isDocLoading;

  if (isLoading) {
    return <TamilAppLayout><div>ஏற்றுகிறது...</div></TamilAppLayout>;
  }

  if (!user && !isLoading) {
    return notFound();
  }

  return (
    <TamilAppLayout>
      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <Link href="/loans/users-tamil">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight font-headline">
            கடன் பயனர் விவரங்களைத் திருத்து
          </h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>பயனர் தகவல்</CardTitle>
            <CardDescription>
              தேவைக்கேற்ப பயனரின் விவரங்களைப் புதுப்பிக்கவும்.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">முழு பெயர்</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="loan-amount">மொத்த கடன்</Label>
                    <Input id="loan-amount" value={user?.loanAmount || ''} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paid-amount">செலுத்திய தொகை</Label>
                    <Input
                        id="paid-amount"
                        type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                    />
                </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleUpdateUser}>
          மாற்றங்களைச் சேமி
        </Button>
      </div>
    </TamilAppLayout>
  );
}
