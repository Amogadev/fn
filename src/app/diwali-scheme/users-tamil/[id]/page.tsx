
import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Gift } from "lucide-react";
import Link from "next/link";

const diwaliUser = {
    id: "ds_user_001",
    name: "பயனர்",
    contribution: 0,
    frequency: "மாதாந்திர",
    totalSaved: 0,
    avatarUrl: "https://picsum.photos/seed/201/100/100",
    joinDate: "2024-06-01",
    estimatedBonus: 0,
    transactions: []
};

export default function DiwaliUserDetailPage({ params }: { params: { id: string } }) {
    const user = diwaliUser; // In a real app, you would fetch user by params.id
    const estimatedDiwaliAmount = user.totalSaved + user.estimatedBonus;

    return (
        <TamilAppLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/diwali-scheme/users-tamil">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold font-headline">தீபாவளி சிட் பயனர் விவரங்கள்</h1>
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
                        <Badge variant="secondary">செயலில் உள்ள திட்டம்</Badge>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                         <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">பங்களிப்பு</p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(user.contribution)} / {user.frequency}</p>
                        </div>
                        <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">மொத்த சேமிப்பு</p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(user.totalSaved)}</p>
                        </div>
                        <div className="p-4 text-center border rounded-lg bg-muted/50">
                             <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Gift className="w-4 h-4"/> தீபாவளி வருமானம்</p>
                            <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(estimatedDiwaliAmount)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>பங்களிப்பு வரலாறு</CardTitle>
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
                                {user.transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">பரிவர்த்தனைகள் எதுவும் இல்லை.</TableCell>
                                    </TableRow>
                                ) : user.transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{tx.date}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">
                                            + {new Intl.NumberFormat('ta-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
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
