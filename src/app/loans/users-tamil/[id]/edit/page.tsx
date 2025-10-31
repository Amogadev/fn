
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
  const [contact, setContact] = useState("4545454545"); // Placeholder
  const [idProof, setIdProof] = useState("90909090"); // Placeholder

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      // Contact and ID proof are placeholders as they are not in the current data model
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
        // contact and idProof are not in the model, so we don't update them
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
                <p className="text-muted-foreground">பயனரின் தனிப்பட்ட தகவலைப் புதுப்பிக்கவும்.</p>
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
            <CardTitle>தனிப்பட்ட தகவல்</CardTitle>
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
             <div className="space-y-2">
                <Label htmlFor="contact-number">தொடர்பு எண்</Label>
                <Input
                    id="contact-number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="id-proof">அடையாளச் சான்று (ஆதார்)</Label>
                <Input
                    id="id-proof"
                    value={idProof}
                    onChange={(e) => setIdProof(e.target.value)}
                />
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
