"use client";

import { useState, useRef } from "react";
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
import { ArrowLeft, Camera, User } from "lucide-react";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function NewLoanTamilPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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

  return (
    <TamilAppLayout showFloatingNav={false}>
      <div className="flex flex-col gap-6">
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
                <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover rounded-lg" />
                  ) : hasCameraPermission === true ? (
                     <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
                  ) : (
                    <div className="text-center text-muted-foreground">
                        <User className="mx-auto h-12 w-12" />
                        <p>படம் இல்லை</p>
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
      <video ref={videoRef} className="hidden" autoPlay muted />
    </TamilAppLayout>
  );
}
