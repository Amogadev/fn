
"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Eye, FilePenLine, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";


export default function LoanUsersPage() {
    const { toast } = useToast();
    const [currentDate, setCurrentDate] = useState('');
    const firestore = useFirestore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentDate(new Date().toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
    }, []);

    const loanUsersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'loan-users');
    }, [firestore]);
    const { data: loanUsers, isLoading } = useCollection(loanUsersQuery);

    const handleDeleteUser = (userId: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'loan-users', userId);
        deleteDocumentNonBlocking(userDocRef);
        toast({
            title: "பயனர் நீக்கப்பட்டார்",
            description: "தேர்ந்தெடுக்கப்பட்ட பயனர் வெற்றிகரமாக நீக்கப்பட்டார்.",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ta-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
    <TamilAppLayout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
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

        <div>
            <h2 className="text-3xl font-bold mb-4 font-headline">கடன் பயனர்கள்</h2>
            <div className="flex justify-between items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="பயனரைத் தேடு..." className="pl-10" />
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard-tamil">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            பின்செல்
                        </Button>
                    </Link>
                    <Link href="/loans/new-tamil">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            புதிய பயனர்
                        </Button>
                    </Link>
                </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">பயனர்களை ஏற்றுகிறது...</p>
            </div>
          )}
          {!isLoading && loanUsers && loanUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">பயனர்கள் யாரும் இல்லை.</p>
            </div>
          ) : (
            loanUsers && loanUsers.map((user) => (
              <Card key={user.id} className="flex flex-col text-center">
                <CardContent className="flex-1 p-6 space-y-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    {user.status === 'முடிந்தது' ? (
                         <div>
                            <p className="text-muted-foreground">கடைசி கடன்: {formatCurrency(user.loanAmount)}</p>
                            <Badge variant="default" className="mt-2">முழுதும் செலுத்தப்பட்டது</Badge>
                         </div>
                    ) : user.status === 'கடன் இல்லை' ? (
                         <Badge variant="secondary">கடன்கள் இல்லை</Badge>
                    ) : (
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span>கடன்:</span> <span className="font-medium">{formatCurrency(user.loanAmount)}</span></div>
                            <div className="flex justify-between"><span>செலுத்தியது:</span> <span className="font-medium">{formatCurrency(user.paidAmount)}</span></div>
                            <div className="flex justify-between font-bold"><span>நிலுவை:</span> <span>{formatCurrency(user.loanAmount - user.paidAmount)}</span></div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <div className="flex justify-around w-full">
                        <Link href={`/loans/users-tamil/${user.id}`}>
                            <Button variant="ghost" size="icon"><Eye className="w-5 h-5 text-muted-foreground" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon"><FilePenLine className="w-5 h-5 text-muted-foreground" /></Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="w-5 h-5 text-destructive" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user <span className="font-bold">{user.name}</span>.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </TamilAppLayout>
  );
}
