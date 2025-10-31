
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
import { ArrowLeft, Camera, User, Plus, Minus } from "lucide-react";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";
import { CameraCapture } from "@/components/CameraCapture";
import { cn } from "@/lib/utils";

export default function NewLoanTamilPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [idProof, setIdProof] = useState("");
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanType, setLoanType] = useState("normal");
  const [frequency, setFrequency] = useState("monthly");

  const [isStep1Completed, setIsStep1Completed] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);


  const interestRate = loanType === 'normal' ? 0.10 : 0.12;
  const interestAmount = loanAmount * interestRate;
  const disbursedAmount = loanAmount - interestAmount;

  const handleLivePhotoCapture = (dataUri: string) => {
    setCapturedImage(dataUri);
  };

  const handleAmountChange = (value: number[]) => {
    setLoanAmount(value[0]);
  };

  const increaseAmount = () => {
     setLoanAmount(prev => Math.min(prev + 1000, 50000));
  }

  const decreaseAmount = () => {
      setLoanAmount(prev => Math.max(prev - 1000, 0));
  }

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
      loanAmount: 0,
      paidAmount: 0,
      status: "செயலில்", // Active
      avatarUrl: capturedImage || `https://picsum.photos/seed/${Date.now()}/100/100`,
      joinDate: new Date().toISOString().split('T')[0],
      transactions: []
    };

    setNewUser(userToCreate);
    setIsStep1Completed(true);
    toast({
      title: "பயனர் பதிவு செய்யப்பட்டது",
      description: `${fullName} பதிவு செய்யப்பட்டார். இப்போது கடன் விவரங்களை உள்ளிடவும்.`,
    });
  };

  const handleFinalSubmit = () => {
    if (!firestore || !newUser || loanAmount <= 0) {
        toast({
            variant: "destructive",
            title: "தகவல் இல்லை",
            description: "தயவுசெய்து சரியான கடன் தொகையை உள்ளிடவும்.",
        });
        return;
    }

    const finalUserData = {
        ...newUser,
        loanAmount: loanAmount,
        transactions: [{
            id: `txn_${Date.now()}`,
            date: new Date().toLocaleDateString('ta-IN'),
            description: "கடன் வழங்கப்பட்டது",
            type: 'debit',
            amount: -loanAmount,
        }]
    };
    
    const loanUsersCollection = collection(firestore, 'loan-users');
    addDocumentNonBlocking(loanUsersCollection, finalUserData);

    toast({
        title: "பயனர் சேர்க்கப்பட்டார்!",
        description: `${fullName} கடன் பயனராக சேர்க்கப்பட்டார்.`,
    });

    router.push("/loans/users-tamil");
  };


  return (
    <TamilAppLayout showFloatingNav={false}>
      <div className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">
                    கடன் / EMIக்கு புதிய பயனரைப் பதிவு செய்யவும்
                </h1>
                <p className="text-muted-foreground">
                    புதிய பயனரைச் சேர்த்து உடனடியாக கடன் விண்ணப்பத்தை முடிக்கவும்.
                </p>
            </div>
            <Link href="/loans/users-tamil">
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    பயனர்கள் பக்கத்திற்குத் திரும்பு
                </Button>
            </Link>
        </header>

        {/* Step 1 */}
        <div className="space-y-4">
            <p className="text-lg font-semibold text-primary">படி 1: பயனர் பதிவு</p>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>தனிப்பட்ட தகவல்</CardTitle>
                    <CardDescription>
                      புதிய விண்ணப்பதாரரின் விவரங்களை நிரப்பவும்.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">முழு பெயர்</Label>
                      <Input id="full-name" placeholder="எ.கா., விராட்" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isStep1Completed} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-number">தொடர்பு எண்</Label>
                      <Input
                        id="contact-number"
                        placeholder="எ.கா., +91 98765 43210"
                        value={contact} onChange={(e) => setContact(e.target.value)}
                        disabled={isStep1Completed}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar-number">
                        அடையாளச் சான்று (ஆதார்)
                      </Label>
                      <Input id="aadhaar-number" placeholder="எ.கா., ஆதார் எண்" value={idProof} onChange={(e) => setIdProof(e.target.value)} disabled={isStep1Completed} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>முகப் புகைப்படம்</CardTitle>
                    <CardDescription>
                      விண்ணப்பதாரரின் முகத்தின் தெளிவான படத்தைப் பிடிக்கவும்.
                    </CardDescription>
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
          <Button className="w-full lg:w-1/2 mx-auto" onClick={handleRegisterUser}>
            பதிவு செய்து அடுத்து செல்லவும்
          </Button>
        )}


        {/* Step 2 */}
        <div className={cn("space-y-4 transition-opacity", !isStep1Completed && "opacity-50 pointer-events-none")}>
            <header>
                 <p className="text-lg font-semibold text-primary">படி 2: கடன் விண்ணப்பம்</p>
                 <p className="text-sm text-muted-foreground">{isStep1Completed ? "கடன் தொகை மற்றும் வகையை உள்ளிடவும்" : "முதலில் படி 1 ஐ முடிக்கவும்"}</p>
            </header>

            <div className="grid max-w-6xl gap-8 mx-auto lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                        <CardTitle>கடன் அமைப்பு</CardTitle>
                        <CardDescription>தொகையைச் சரிசெய்து, கடன் வகையைத் தேர்ந்தெடுக்கவும்.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>கடன் தொகை (திருப்பிச் செலுத்த வேண்டிய மொத்தம்)</Label>
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="outline" onClick={decreaseAmount}><Minus/></Button>
                                <div className="flex-1 text-center">
                                    <p className="text-3xl font-bold">₹{loanAmount.toLocaleString()}</p>
                                </div>
                                <Button size="icon" variant="outline" onClick={increaseAmount}><Plus/></Button>
                            </div>
                            <Slider value={[loanAmount]} onValueChange={handleAmountChange} max={50000} step={1000} />
                        </div>
                        
                        <RadioGroup value={loanType} onValueChange={setLoanType} className="space-y-2">
                            <Label>கடன் வகை</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="normal" id="normal" className="peer sr-only" />
                                    <Label htmlFor="normal" className="flex flex-col items-center justify-between p-4 border-2 rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                                        <p className="font-semibold">சாதாரண கடன்</p>
                                        <p className="text-sm text-muted-foreground">(10% வட்டி)</p>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="emi" id="emi" className="peer sr-only" />
                                    <Label htmlFor="emi" className="flex flex-col items-center justify-between p-4 border-2 rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                                        <p className="font-semibold">EMI</p>
                                        <p className="text-sm text-muted-foreground">(12% வட்டி)</p>
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>

                        <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-2">
                            <Label>செலுத்தும் கால இடைவெளி</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {[{id: 'daily', label: "தினசரி"}, {id: 'weekly', label: "வாராந்திர"}, {id: 'monthly', label: "மாதாந்திர"}, {id: 'yearly', label: "வருடாந்திர"}].map(freq => (
                                    <div key={freq.id}>
                                        <RadioGroupItem value={freq.id} id={freq.id} className="peer sr-only" />
                                        <Label htmlFor={freq.id} className="px-4 py-2 text-center border rounded-md cursor-pointer text-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 block">
                                            {freq.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </CardContent>
                  </Card>
                </div>
                <Card className="sticky top-6 h-fit">
                  <CardHeader>
                    <CardTitle className="font-headline">கடன் விவரம்</CardTitle>
                    <CardDescription>
                      நீங்கள் கோரிய கடனின் விவரங்கள்.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">கேட்ட தொகை:</span>
                      <span className="font-medium">₹{loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">வட்டி ({interestRate * 100}%):</span>
                      <span className="font-medium text-destructive">- ₹{interestAmount.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                      <span className="text-muted-foreground">வழங்கப்படும் தொகை:</span>
                      <span className="font-medium">₹{disbursedAmount.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-base">
                      <span>திருப்பிச் செலுத்த வேண்டிய மொத்தம்:</span>
                      <span>₹{loanAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
            </div>
        </div>
        
        {isStep1Completed && (
            <Button className="w-full lg:w-1/2 mx-auto" onClick={handleFinalSubmit}>
                பயனரை உருவாக்கி கடன் விண்ணப்பத்தை சமர்ப்பிக்கவும்
            </Button>
        )}
      </div>
    </TamilAppLayout>
    );
}
