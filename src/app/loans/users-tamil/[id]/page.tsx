
"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";


export default function LoanUserDetailPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const id = params.id;

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !authUser || !id) return null;
        return doc(firestore, 'loan-users', id);
    }, [firestore, authUser, id]);

    const { data: user, isLoading: isDocLoading } = useDoc(userDocRef);

    const isLoading = isAuthLoading || isDocLoading;

    if (isLoading) {
        return <TamilAppLayout><div>ஏற்றுகிறது...</div></TamilAppLayout>;
    }

    if (!user) {
        return notFound();
    }

    const balance = user.loanAmount - user.paidAmount;

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
                <div className="flex items-center gap-4">
                    <Link href="/loans/users-tamil">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold font-headline">பயனர் விவரங்கள்</h1>
                </div>

                <Card>
                    <CardHeader className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="w-24 h-24 border-4 border-primary">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <p className="text-muted-foreground">பயனர் ஐடி: {user.id}</p>
                            <p className="text-sm text-muted-foreground">சேர்ந்த நாள்: {new Date(user.joinDate).toLocaleDateString('ta-IN')}</p>
                        </div>
                         {user.status === 'முடிந்தது' ? (
                            <Badge variant="default">முழுதும் செலுத்தப்பட்டது</Badge>
                         ) : user.status === 'கடன் இல்லை' ? (
                            <Badge variant="outline">கடன் இல்லை</Badge>
                         ) : (
                            <Badge variant="secondary">{user.status}</Badge>
                         )}
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                         <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">மொத்தக் கடன்</p>
                            <p className="text-2xl font-bold">{formatCurrency(user.loanAmount)}</p>
                        </div>
                        <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">செலுத்தியது</p>
                            <p className="text-2xl font-bold">{formatCurrency(user.paidAmount)}</p>
                        </div>
                        <div className="p-4 text-center border rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">நிலுவை</p>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(balance)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>பரிவர்த்தனை வரலாறு</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>தேதி</TableHead>
                                    <TableHead>விளக்கம்</TableHead>
                                    <TableHead className="text-right">தொகை</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.transactions && user.transactions.length > 0 ? (
                                    user.transactions.map((tx: any) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{tx.date}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : ''} {formatCurrency(tx.amount)}
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">பரிவர்த்தனைகள் எதுவும் இல்லை.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </TamilAppLayout>
    )
}
