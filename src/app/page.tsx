"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, initiateAnonymousSignIn } from "@/firebase";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const signInAttempted = useRef(false);

  useEffect(() => {
    // If we're done loading and there's no user, and we haven't tried to sign in yet
    if (!isUserLoading && !user && auth && !signInAttempted.current) {
      // Mark that we are attempting to sign in
      signInAttempted.current = true;
      initiateAnonymousSignIn(auth);
    }

    // When user object becomes available, redirect to dashboard
    if (user) {
      router.push("/dashboard-tamil");
    }
  }, [user, isUserLoading, auth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm mx-auto shadow-xl">
        <CardHeader className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6 text-foreground" />
                <CardTitle className="text-2xl font-bold font-headline">
                    வைப்புத்தொகை 360
                </CardTitle>
            </div>
          <CardDescription>
            பாதுகாப்பான நிதி மேலாண்மை
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">உள்நுழைகிறது...</p>
        </CardContent>
      </Card>
    </div>
  );
}
