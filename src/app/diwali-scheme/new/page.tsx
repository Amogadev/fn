
"use client";

import { useState, useRef, useEffect } from "react";
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
import { ArrowLeft, Camera, Info, User } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CameraCapture } from "@/components/CameraCapture";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";

export default function NewDiwaliSchemePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const firestore = useFirestore();
  
  const [fullName, setFullName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [contact, setContact] = useState("");
  const [contribution, setContribution] = useState<string | undefined>();
  const [frequency, setFrequency] = useState<string | undefined>();
  const [estimatedReturn, setEstimatedReturn] = useState(0);

  const [isStep1Completed, setIsStep1Completed] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);


  const currentDate = new Date().toLocaleDateString('ta-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    if (contribution && frequency) {
      const amount = Number(contribution);
      const WEEKS_TILL_DIWALI = 44; // Approx 11 months
      const MONTHS_TILL_DIWALI = 11;
      const BONUS_RATE = 0.10; // 10%

      let totalContribution = 0;
      if (frequency === 'weekly') {
        totalContribution = amount * WEEKS_TILL_DIWALI;
      } else if (frequency === 'monthly') {
        totalContribution = amount * MONTHS_TILL_DIWALI;
      }

      const bonus = totalContribution * BONUS_RATE;
      setEstimatedReturn(totalContribution + bonus);
    } else {
      setEstimatedReturn(0);
    }
  }, [contribution, frequency]);


  const handleRegisterUser = () => {
    if (!fullName) {
        toast({
            variant: "destructive",
            title: "தகவல் இல்லை",
            description: "தயவுசெய்து முழுப் பெயரை நிரப்பவும்.",
        });
        return;
    }
    
    const userToCreate = {
        name: fullName,
        contribution: 0,
        frequency: '',
        totalSaved: 0,
        avatarUrl: capturedImage || `https://picsum.photos/seed/${Date.now()}/100/100`,
        joinDate: new Date().toISOString().split('T')[0],
        estimatedBonus: 0,
        transactions: []
    };

    setNewUser(userToCreate);
    setIsStep1Completed(true);
    toast({
        title: "பயனர் பதிவு செய்யப்பட்டது",
        description: `${fullName} பதிவு செய்யப்பட்டார். இப்போது பங்களிப்புத் திட்டத்தைத் தேர்ந்தெடுக்கவும்.`,
    });
  };

  const handleFinalSubmit = () => {
    if (!firestore || !newUser || !contribution || !frequency) {
         toast({
            variant: "destructive",
            title: "தகவல் இல்லை",
            description: "தயவுசெய்து பங்களிப்புத் தொகை மற்றும் கால இடைவெளியை தேர்ந்தெடுக்கவும்.",
        });
        return;
    }
    
    const totalContribution = (Number(contribution) * (frequency === 'weekly' ? 44 : 11));

    const finalUserData = {
        ...newUser,
        contribution: Number(contribution),
        frequency: frequency,
        totalSaved: Number(contribution), // Initial contribution
        estimatedBonus: totalContribution * 0.10,
        transactions: [{
            id: `txn_${Date.now()}`,
            date: new Date().toLocaleDateString('ta-IN'),
            description: "ஆரம்ப பங்களிப்பு",
            amount: Number(contribution),
        }]
    };

    const diwaliUsersCollection = collection(firestore, 'diwali-users');
    addDocumentNonBlocking(diwaliUsersCollection, finalUserData);

    toast({
        title: "பயனர் சேர்க்கப்பட்டார்!",
        description: `${fullName} தீபாவளி சிட் திட்டத்தில் சேர்க்கப்பட்டார்.`,
    });

    router.push("/diwali-scheme/users-tamil");
  }

  const handleLivePhotoCapture = (dataUri: string) => {
    setCapturedImage(dataUri);
  };


  return (
    <TamilAppLayout showFloatingNav>
      <div className="space-y-8">
         <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/diwali-scheme/users-tamil">
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

        <div>
            <h2 className="text-3xl font-bold mb-2 font-headline">
                தீபாவளி சேமிப்புத் திட்டத்தில் சேரவும்
            </h2>
        </div>


        <div className="space-y-4">
            <p className="text-lg font-semibold text-primary">படி 1: பயனர் பதிவு</p>
            <p className="text-muted-foreground">சரிபார்ப்புக்காக உங்கள் தகவலை வழங்கவும்.</p>

             <div className="grid gap-8 lg:grid-cols-2">
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>உங்கள் விவரங்கள்</CardTitle>
                            <CardDescription>
                            தயவுசெய்து உங்கள் தகவலை அளித்து, சரிபார்ப்புக்காக ஒரு புகைப்படத்தைப் பிடிக்கவும்.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">முழு பெயர்</Label>
                                <Input id="full-name" placeholder="எ.கா., பிரியா" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isStep1Completed}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="aadhaar-number">ஆதார் எண்</Label>
                                    <Input id="aadhaar-number" placeholder="எ.கா., 1234 5678 9012" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} disabled={isStep1Completed}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact-number">தொலைபேசி எண்</Label>
                                    <Input id="contact-number" placeholder="எ.கா., +91 98765 43210" value={contact} onChange={(e) => setContact(e.target.value)} disabled={isStep1Completed}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-4 lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>முகப் புகைப்படம்</CardTitle>
                            <CardDescription>ஒரு தெளிவான படத்தைப் பிடிக்கவும்</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className={cn(isStep1Completed && "pointer-events-none opacity-50")}>
                                <CameraCapture onCapture={handleLivePhotoCapture} />
                            </div>
                        </CardContent>
                     </Card>
                  </div>
            </div>
        </div>

        {!isStep1Completed && (
            <Button className="w-full" onClick={handleRegisterUser}>பதிவு செய்து அடுத்து செல்லவும்</Button>
        )}

        <div className={cn("space-y-4 transition-opacity", !isStep1Completed && "opacity-50 pointer-events-none")}>
            <p className="text-lg font-semibold text-primary">படி 2: பங்களிப்புத் திட்டம்</p>
            <p className="text-muted-foreground">{isStep1Completed ? "உங்கள் சேமிப்புத் திட்டத்தைத் தேர்ந்தெடுக்கவும்" : "முதலில் படி 1 ஐ முடிக்கவும்"}</p>

            <Card>
                <CardHeader>
                    <CardTitle>பங்களிப்புத் திட்டம்</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>பங்களிப்புத் தொகை</Label>
                        <Select value={contribution} onValueChange={setContribution} disabled={!isStep1Completed}>
                            <SelectTrigger>
                                <SelectValue placeholder="தொகையைத் தேர்ந்தெடுக்கவும்" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="100">₹100</SelectItem>
                                <SelectItem value="1000">₹1,000</SelectItem>
                                <SelectItem value="5000">₹5,000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>கால இடைவெளி</Label>
                        <Select value={frequency} onValueChange={setFrequency} disabled={!isStep1Completed}>
                            <SelectTrigger>
                                <SelectValue placeholder="கால இடைவெளியைத் தேர்ந்தெடுக்கவும்" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">வாராந்திர</SelectItem>
                                <SelectItem value="monthly">மாதாந்திர</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>இது எப்படி வேலை செய்கிறது</AlertTitle>
                <AlertDescription>
                ₹100, ₹1,000, அல்லது ₹5,000 வாராந்திரம் அல்லது மாதாந்திரம் சேமித்து, தீபாவளி அன்று +10% போனஸ் பெறுங்கள். முன்கூட்டியே எடுத்தால் உங்கள் மொத்த சேமிப்பில் 10% கழிக்கப்படும்.
                </AlertDescription>
            </Alert>
        </div>
        
        <div className={cn("space-y-4 transition-opacity", !isStep1Completed && "opacity-50 pointer-events-none")}>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>மதிப்பிடப்பட்ட தீபாவளி வருமானம்</CardTitle>
                    <CardDescription>உங்கள் மொத்த பங்களிப்பு மற்றும் உங்கள் 10% போனஸ்.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">
                      {new Intl.NumberFormat('ta-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(estimatedReturn)}
                    </p>
                </CardContent>
            </Card>
        </div>

        {isStep1Completed && (
            <Button className="w-full" onClick={handleFinalSubmit}>
                சேமிப்புத் திட்டத்தை உறுதிசெய்து பயனரைச் சேர்க்கவும்
            </Button>
        )}
      </div>
    </TamilAppLayout>
  );
}
