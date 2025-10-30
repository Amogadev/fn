
import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const loanUser = {
    id: "user_001",
    name: "குமார்",
    loanAmount: 10000,
    paidAmount: 3000,
    status: "செயலில்",
    avatarUrl: "https://picsum.photos/seed/101/100/100",
    joinDate: "2024-07-01",
    transactions: [
        { id: 't1', date: '2024-07-01', description: 'கடன் வழங்கப்பட்டது', amount: -10000, type: 'debit' },
        { id: 't2', date: '2024-08-01', description: 'மாதாந்திரத் தவணை', amount: 1000, type: 'credit' },
        { id: 't3', date: '2024-09-01', description: 'மாதாந்திரத் தவணை', amount: 1000, type: 'credit' },
        { id: 't4', date: '2024-10-01', description: 'மாதாந்திரத் தவணை', amount: 1000, type: 'credit' },
    ]
};


export default function LoanUserDetailPage({ params }: { params: { id: string } }) {
    const user = loanUser; // In a real app, you would fetch user by params.id
    const balance = user.loanAmount - user.paidAmount;

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
                            <p className="text-sm text-muted-foreground">சேர்ந்த நாள்: {user.joinDate}</p>
                        </div>
                         {user.status === 'முடிந்தது' ? (
                            <Badge variant="default">முழுதும் செலுத்தப்பட்டது</Badge>
                         ) : (
                            <Badge variant="secondary">{user.status}</Badge>
                         )}
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                         <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">மொத்தக் கடன்</p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(user.loanAmount)}</p>
                        </div>
                        <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">செலுத்தியது</p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(user.paidAmount)}</p>
                        </div>
                        <div className="p-4 text-center border rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">நிலுவை</p>
                            <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(balance)}</p>
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
                                {user.transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{tx.date}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : '-'} {new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(Math.abs(tx.amount))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </TamilAppLayout>
    )
}
