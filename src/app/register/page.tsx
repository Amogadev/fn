"use client";

import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CameraCapture } from "@/components/CameraCapture";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  verifyUserIdentity,
  type VerifyUserIdentityOutput,
} from "@/ai/flows/verify-user-identity";

const steps = [
  { id: 1, name: "Personal Information" },
  { id: 2, name: "Upload ID" },
  { id: 3, name: "Facial Capture" },
  { id: 4, name: "Verification" },
];

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contact: z.string().min(10, "A valid contact number is required"),
});

type FormData = z.infer<typeof personalInfoSchema> & {
  idPhoto?: File;
  idPhotoDataUri?: string;
  livePhotoDataUri?: string;
};

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [verificationResult, setVerificationResult] =
    useState<VerifyUserIdentityOutput | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const idPlaceholder = PlaceHolderImages.find((img) => img.id === "id-card");

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { name: "", contact: "" },
  });

  const handleNext = async (values: FieldValues) => {
    const updatedData = { ...formData, ...values };
    setFormData(updatedData);

    if (currentStep < steps.length) {
      if (currentStep === 3) {
        await handleVerification(updatedData);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          idPhoto: file,
          idPhotoDataUri: event.target?.result as string,
        });
        setCurrentStep(3);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLivePhotoCapture = (dataUri: string) => {
    setFormData({ ...formData, livePhotoDataUri: dataUri });
  };

  const handleVerification = async (data: Partial<FormData>) => {
    if (!data.idPhotoDataUri || !data.livePhotoDataUri) {
      toast({
        title: "Error",
        description: "Both ID photo and live photo are required.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setCurrentStep(4);

    try {
      const result = await verifyUserIdentity({
        idPhotoDataUri: data.idPhotoDataUri,
        livePhotoDataUri: data.livePhotoDataUri,
      });
      setVerificationResult(result);
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setVerificationResult({ isMatch: false, confidence: 0, reason: "API error" });
    } finally {
      setIsVerifying(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/30">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline">
            Create Your LendEase Account
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <Form {...form}>
              <form
                id="personal-info-form"
                onSubmit={form.handleSubmit(handleNext)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 12345 67890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">Upload Your ID</h3>
              <p className="mb-4 text-muted-foreground">
                Please upload a clear picture of your government-issued ID.
              </p>
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {idPlaceholder && (
                <Image
                  src={idPlaceholder.imageUrl}
                  width={250}
                  height={158}
                  alt="ID card example"
                  data-ai-hint={idPlaceholder.imageHint}
                  className="mx-auto mt-4 rounded-md"
                />
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Live Facial Capture
              </h3>
              <p className="text-center text-muted-foreground">
                Position your face in the center of the frame and take a
                picture.
              </p>
              <CameraCapture onCapture={handleLivePhotoCapture} />
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-center text-center">
              {isVerifying ? (
                <>
                  <Loader2 className="w-16 h-16 mb-4 animate-spin text-primary" />
                  <h3 className="text-xl font-semibold">Verifying Identity...</h3>
                  <p className="text-muted-foreground">
                    Our AI is comparing your photos. This may take a moment.
                  </p>
                </>
              ) : verificationResult?.isMatch ? (
                <>
                  <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold">Verification Successful!</h3>
                  <p className="text-muted-foreground">
                    Confidence Score:{" "}
                    {(verificationResult.confidence * 100).toFixed(2)}%
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {verificationResult.reason}
                  </p>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full mt-6">Go to Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 mb-4 text-destructive" />
                  <h3 className="text-xl font-semibold">Verification Failed</h3>
                  <p className="text-muted-foreground">
                    We couldn't match your photos. Please try again.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {verificationResult?.reason}
                  </p>
                  <Button
                    onClick={() => setCurrentStep(1)}
                    className="w-full mt-6"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 && currentStep < 4 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : (
            <div></div>
          )}
          {currentStep === 1 && (
            <Button type="submit" form="personal-info-form">
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {currentStep === 3 && (
            <Button
              onClick={() => handleVerification(formData)}
              disabled={!formData.livePhotoDataUri}
            >
              Verify Identity <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
      <p className="mt-4 text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/" className="underline text-accent">
          Sign In
        </Link>
      </p>
    </div>
  );
}
