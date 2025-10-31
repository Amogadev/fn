
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
import { ArrowLeft, Plus, Search, FilePenLine, Trash2, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function LoanUsersPage() {
    const [currentDate, setCurrentDate] = useState('');
    const firestore = useFirestore();
    const { user } = useUser();
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        setCurrentDate(new Date().toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
    }, []);

    const loanUsersQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'loan-users');
    }, [firestore, user]);
    const { data: loanUsers, isLoading: isLoanUsersLoading } = useCollection(loanUsersQuery);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ta-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = async (userId: string, userName: string) => {
      if (!firestore) return;
      if (confirm(`'${userName}' என்ற பயனரை நீக்க விரும்புகிறீர்களா?`)) {
        try {
          await deleteDoc(doc(firestore, "loan-users", userId));
          toast({
            title: "பயனர் நீக்கப்பட்டார்",
            description: `${userName} என்பவர் நீக்கப்பட்டுவிட்டார்.`,
          });
        } catch (e) {
          console.error("Error deleting user: ", e);
          toast({
            variant: "destructive",
            title: "பிழை",
            description: "பயனரை நீக்கும்போது ஒரு பிழை ஏற்பட்டது.",
          });
        }
      }
    };

    const isLoading = isLoanUsersLoading;

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

        {/* Desktop Table View */}
        <div className="hidden md:block">
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>பயனர்</TableHead>
                                <TableHead>மொத்த கடன்</TableHead>
                                <TableHead>செலுத்தியது</TableHead>
                                <TableHead>நிலுவை</TableHead>
                                <TableHead>நிலை</TableHead>
                                <TableHead className="text-right">செயல்கள்</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        பயனர்களை ஏற்றுகிறது...
                                    </TableCell>
                                </TableRow>
                            ) : loanUsers && loanUsers.length > 0 ? (
                                loanUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(user.loanAmount)}</TableCell>
                                        <TableCell>{formatCurrency(user.paidAmount)}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(user.loanAmount - user.paidAmount)}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'முடிந்தது' ? 'default' : 'secondary'}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/loans/users-tamil/${user.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/loans/users-tamil/${user.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <FilePenLine className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id, user.name)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        பயனர்கள் யாரும் இல்லை.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        {/* Mobile Card View */}
        <div className="grid gap-4 md:hidden">
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
                    <div className="space-y-1 text-sm text-left">
                        <div className="flex justify-between"><span>கடன்:</span> <span className="font-medium">{formatCurrency(user.loanAmount)}</span></div>
                        <div className="flex justify-between"><span>செலுத்தியது:</span> <span className="font-medium">{formatCurrency(user.paidAmount)}</span></div>
                        <div className="flex justify-between font-bold"><span>நிலுவை:</span> <span>{formatCurrency(user.loanAmount - user.paidAmount)}</span></div>
                    </div>
                 </CardContent>
                 <CardFooter className="p-2 border-t bg-muted/20">
                    <div className="flex justify-around w-full">
                        <Link href={`/loans/users-tamil/${user.id}`}>
                            <Button variant="ghost" size="icon">
                                <Eye className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href={`/loans/users-tamil/${user.id}/edit`}>
                            <Button variant="ghost" size="icon">
                                <FilePenLine className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id, user.name)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
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
