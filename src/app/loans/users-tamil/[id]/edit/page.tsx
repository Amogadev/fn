
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

export default function EditLoanUserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user: authUser, isUserLoading } = useUser();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ta-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }));
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !id || !authUser) return null;
    return doc(firestore, 'loan-users', id);
  }, [firestore, id, authUser]);

  const { data: user, isLoading: isDocLoading } = useDoc(userDocRef);

  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [idProof, setIdProof] = useState("");
  const [loanAmount, setLoanAmount] = useState<number | string>("");
  const [paidAmount, setPaidAmount] = useState<number | string>("");


  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setLoanAmount(user.loanAmount);
      setPaidAmount(user.paidAmount);
      // Assuming these fields might exist on the user object from creation step
      setContact(user.contact || "");
      setIdProof(user.idProof || "");
    }
  }, [user]);

  const handleUpdateUser = async () => {
    if (!firestore || !userDocRef || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore not available or user not found.",
      });
      return;
    }
    
    try {
      await updateDoc(userDocRef, {
        name: fullName,
        contact: contact,
        idProof: idProof,
        loanAmount: Number(loanAmount),
        paidAmount: Number(paidAmount)
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
    return <TamilAppLayout showFloatingNav><div>ஏற்றுகிறது...</div></TamilAppLayout>;
  }

  if (!user && !isLoading) {
    return notFound();
  }

  return (
    <TamilAppLayout showFloatingNav>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Link href="/dashboard-tamil">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight font-headline">
                    வணக்கம்.
                </h1>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
        </header>

        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold font-headline">பயனரைத் திருத்து</h2>
                <p className="text-muted-foreground">பயனரின் தகவலைப் புதுப்பிக்கவும்.</p>
            </div>
            <Link href="/loans/users-tamil">
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    பயனர்கள் பக்கத்திற்குத் திரும்பு
                </Button>
            </Link>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>பயனர் தகவல்</CardTitle>
            <CardDescription>
              {user.name} க்கான விவரங்களை மாற்றியமைக்கவும்.
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
                <Label htmlFor="contact-number">தொடர்பு எண்</Label>
                <Input
                  id="contact-number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="பயனர் தொடர்பு"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-proof">அடையாளச் சான்று</Label>
                <Input
                  id="id-proof"
                  value={idProof}
                  onChange={(e) => setIdProof(e.target.value)}
                  placeholder="பயனர் அடையாளச் சான்று"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="loan-amount">கடன் தொகை</Label>
                    <Input
                        id="loan-amount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                    />
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
