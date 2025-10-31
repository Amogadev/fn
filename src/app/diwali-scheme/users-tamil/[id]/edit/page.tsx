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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export default function EditDiwaliUserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user: authUser, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !id || !authUser) return null;
    return doc(firestore, 'diwali-users', id);
  }, [firestore, id, authUser]);

  const { data: user, isLoading: isDocLoading } = useDoc(userDocRef);

  const [fullName, setFullName] = useState("");
  const [contribution, setContribution] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [totalSaved, setTotalSaved] = useState<number | string>("");

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setContribution(String(user.contribution));
      setFrequency(user.frequency);
      setTotalSaved(user.totalSaved);
    }
  }, [user]);

  const handleSave = async () => {
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

    try {
      await updateDoc(userDocRef, {
        name: fullName,
        contribution: Number(contribution),
        frequency: frequency,
        totalSaved: Number(totalSaved),
      });

      toast({
        title: "பயனர் புதுப்பிக்கப்பட்டார்!",
        description: `${fullName} விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன.`,
      });

      router.push("/diwali-scheme/users-tamil");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "பிழை",
        description: "புதுப்பிப்பில் ஒரு பிழை ஏற்பட்டது.",
      });
    }
  };

  const isLoading = isUserLoading || isDocLoading;

  if (isLoading) {
    return <TamilAppLayout><div>ஏற்றுகிறது...</div></TamilAppLayout>;
  }

  if (!user && !isLoading) {
    notFound();
  }

  return (
    <TamilAppLayout>
      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <Link href="/diwali-scheme/users-tamil">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight font-headline">
            தீபாவளி சிட் பயனர் விவரங்களைத் திருத்து
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
                <Label>பங்களிப்புத் தொகை</Label>
                <Select value={contribution} onValueChange={setContribution}>
                  <SelectTrigger>
                    <SelectValue placeholder="தொகையைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="1000">1,000</SelectItem>
                    <SelectItem value="5000">5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>கால இடைவெளி</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="கால இடைவெளியைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total-saved">மொத்தம் சேமிப்பு</Label>
              <Input
                id="total-saved"
                type="number"
                value={totalSaved}
                onChange={(e) => setTotalSaved(e.target.value)}
              />
            </div>

            <Button onClick={handleSave}>மாற்றங்களைச் சேமி</Button>
          </CardContent>
        </Card>
      </div>
    </TamilAppLayout>
  );
}
