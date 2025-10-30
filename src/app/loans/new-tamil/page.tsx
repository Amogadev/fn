"use client";

import { useState, useRef, useEffect } from "react";
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

export default function NewLoanTamilPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);

  useEffect(() => {
    // This empty effect can be used for camera cleanup if needed in the future
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (
      !("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices)
    ) {
      toast({
        variant: "destructive",
        title: "கேமரா ஆதரிக்கப்படவில்லை",
        description:
          "உங்கள் உலாவி கேமரா அணுகலை ஆதரிக்கவில்லை.",
      });
      setHasCameraPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "கேமரா அணுகல் மறுக்கப்பட்டது",
        description:
          "இந்தப் பயன்பாட்டைப் பயன்படுத்த, உங்கள் உலாவி அமைப்புகளில் கேமரா அனுமதிகளை இயக்கவும்.",
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const dataUri = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUri);

      // Stop camera stream
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setHasCameraPermission(null);
    }
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
            <Link href="/dashboard-tamil">
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    பயனர்கள் பக்கத்திற்குத் திரும்பு
                </Button>
            </Link>
        </header>

        {/* Step 1 */}
        <div className="space-y-4">
            <p className="text-lg font-semibold text-primary">படி 1: பயனர் பதிவு</p>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
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
                      <Input id="full-name" placeholder="எ.கா., விராட்" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-number">தொடர்பு எண்</Label>
                      <Input
                        id="contact-number"
                        placeholder="எ.கா., +91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar-number">
                        அடையாளச் சான்று (ஆதார்)
                      </Label>
                      <Input id="aadhaar-number" placeholder="எ.கா., ஆதார் எண்" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>முகப் புகைப்படம் (விருப்பத்தேர்வு)</CardTitle>
                    <CardDescription>
                      விண்ணப்பதாரரின் முகத்தின் தெளிவான படத்தைப் பிடிக்கவும்.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                      ) : hasCameraPermission === true ? (
                         <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <User className="mx-auto h-12 w-12" />
                            <p className="text-sm">படம் இல்லை</p>
                        </div>
                      )}
                    </div>
                    
                    {hasCameraPermission === true && !capturedImage && (
                        <Button onClick={captureImage}>புகைப்படம் எடு</Button>
                    )}

                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                          <AlertTitle>கேமரா அணுகல் தேவை</AlertTitle>
                          <AlertDescription>
                            இந்த அம்சத்தைப் பயன்படுத்த, கேமரா அணுகலை அனுமதிக்கவும்.
                          </AlertDescription>
                        </Alert>
                    )}

                    {!capturedImage && hasCameraPermission !== true && (
                        <Button onClick={getCameraPermission}>
                            <Camera className="w-4 h-4 mr-2" />
                            கேமராவைத் திற
                        </Button>
                    )}
                     {capturedImage && (
                        <Button onClick={() => { setCapturedImage(null); getCameraPermission(); }}>
                            <Camera className="w-4 h-4 mr-2" />
                            மீண்டும் எடு
                        </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-4">
            <header>
                 <p className="text-lg font-semibold text-primary">படி 2: கடன் விண்ணப்பம்</p>
                 <p className="text-sm text-muted-foreground">முதலில் படி 1 ஐ முடிக்கவும்</p>
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
                        <div className="space-y-2">
                            <Label>கடன் வகை</Label>
                            <RadioGroup defaultValue="normal" className="grid grid-cols-2 gap-4">
                                <Label className="p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                                    <RadioGroupItem value="normal" id="normal" className="sr-only" />
                                    <p className="font-semibold">சாதாரண கடன்</p>
                                    <p className="text-sm text-muted-foreground">(10% வட்டி)</p>
                                </Label>
                                <Label className="p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                                    <RadioGroupItem value="emi" id="emi" className="sr-only" />
                                    <p className="font-semibold">EMI</p>
                                    <p className="text-sm text-muted-foreground">(12% வட்டி)</p>
                                </Label>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>செலுத்தும் கால இடைவெளி</Label>
                            <RadioGroup defaultValue="monthly" className="grid grid-cols-4 gap-2">
                                {["தினசரி", "வாராந்திர", "மாதாந்திர", "வருடாந்திர"].map(freq => (
                                    <Label key={freq} className="px-4 py-2 text-center border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer text-sm">
                                        <RadioGroupItem value={freq} id={freq} className="sr-only" />
                                        {freq}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>
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
                      <span className="text-muted-foreground">கடன் தொகை:</span>
                      <span className="font-medium">₹{loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">வட்டி (0%, முன்பணம்):</span>
                      <span className="font-medium text-destructive">- ₹0</span>
                    </div>
                     <div className="flex justify-between">
                      <span className="text-muted-foreground">செலுத்த வேண்டிய தேதி:</span>
                      <span className="font-medium">இன்று</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-base">
                      <span>செலுத்த வேண்டிய மொத்தம்:</span>
                      <span>₹{loanAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
            </div>
        </div>

        <Button className="w-full lg:w-1/2 mx-auto">
            பயனரை உருவாக்கி கடன் விண்ணப்பத்தை சமர்ப்பிக்கவும்
        </Button>
      </div>
      <video ref={videoRef} className="hidden" autoPlay muted playsInline />
    </TamilAppLayout>
  );
}
