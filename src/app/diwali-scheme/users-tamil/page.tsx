
"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Search, FilePenLine, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect, use } from "react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type DiwaliUser = {
    id: string;
    name: string;
    avatarUrl: string;
    contribution: number;
    frequency: 'weekly' | 'monthly';
    totalSaved: number;
    transactions?: { id: string; date: string; description: string; amount: number }[];
};


export default function DiwaliSchemeUsersPage() {
  const [currentDate, setCurrentDate] = useState('');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [transactionsUser, setTransactionsUser] = useState<DiwaliUser | null>(null);
  const [paymentUser, setPaymentUser] = useState<DiwaliUser | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const diwaliUsersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'diwali-users');
  }, [firestore, user]);
  
  const { data: diwaliSchemeUsers, isLoading: isDiwaliUsersLoading, error } = useCollection<DiwaliUser>(diwaliUsersQuery);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date().toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  const handleDelete = async (userId: string, userName: string) => {
    if (!firestore) return;
    if (confirm(`'${userName}' என்ற பயனரை நீக்க விரும்புகிறீர்களா?`)) {
      try {
        await deleteDoc(doc(firestore, "diwali-users", userId));
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
  

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ta-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCardClick = (user: DiwaliUser) => {
    setTransactionsUser(user);
  };

  const handleAddPaymentClick = (e: React.MouseEvent, user: DiwaliUser) => {
      e.stopPropagation();
      setPaymentUser(user);
  }

  const handleSavePayment = async () => {
    if (!paymentUser || !firestore) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "தவறான தொகை",
        description: "சரியான தொகையை உள்ளிடவும்.",
      });
      return;
    }

    const userDocRef = doc(firestore, "diwali-users", paymentUser.id);
    
    const newTransaction = {
      id: `txn_${Date.now()}`,
      date: new Date().toLocaleDateString('ta-IN'),
      description: "பங்களிப்பு செய்யப்பட்டது",
      amount: amount,
    };

    const updatedTotalSaved = (paymentUser.totalSaved || 0) + amount;
    const updatedTransactions = [...(paymentUser.transactions || []), newTransaction];

    try {
      await updateDoc(userDocRef, {
        totalSaved: updatedTotalSaved,
        transactions: updatedTransactions,
      });

      toast({
        title: "பணம் சேமிக்கப்பட்டது",
        description: `${paymentUser.name} க்கான ${formatCurrency(amount)} வெற்றிகரமாக சேர்க்கப்பட்டது.`,
      });

      setPaymentUser(null);
      setPaymentAmount('');
    } catch (e) {
      console.error("Error updating payment: ", e);
      toast({
        variant: "destructive",
        title: "பிழை",
        description: "பணம் சேமிக்கும்போது ஒரு பிழை ஏற்பட்டது.",
      });
    }
  };
  
  const isLoading = isDiwaliUsersLoading;

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
            <h2 className="text-3xl font-bold mb-4 font-headline">தீபாவளி சிட் பயனர்கள்</h2>
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
                    <Link href="/diwali-scheme/new">
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
                                <TableHead>பங்களிப்பு</TableHead>
                                <TableHead>மொத்த சேமிப்பு</TableHead>
                                <TableHead>நிலை</TableHead>
                                <TableHead className="text-right">செயல்கள்</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        பயனர்களை ஏற்றுகிறது...
                                    </TableCell>
                                </TableRow>
                            ) : diwaliSchemeUsers && diwaliSchemeUsers.length > 0 ? (
                                diwaliSchemeUsers.map((user) => (
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
                                        <TableCell>{formatCurrency(user.contribution)} / {user.frequency === 'weekly' ? 'வாராந்திர' : 'மாதாந்திர'}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(user.totalSaved)}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">செயலில்</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="icon" onClick={(e) => handleAddPaymentClick(e, user)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>செயல்கள்</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleCardClick(user)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            பரிவர்த்தனைகளைப் பார்க்க
                                                        </DropdownMenuItem>
                                                        <Link href={`/diwali-scheme/users-tamil/${user.id}/edit`}>
                                                            <DropdownMenuItem>
                                                                <FilePenLine className="mr-2 h-4 w-4" />
                                                                திருத்து
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(user.id, user.name)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            நீக்கு
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
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
          {!isLoading && diwaliSchemeUsers && diwaliSchemeUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">பயனர்கள் யாரும் இல்லை.</p>
            </div>
          ) : (
            diwaliSchemeUsers && diwaliSchemeUsers.map((user) => (
              <Card key={user.id} className="flex flex-col text-center">
                 <CardContent className="flex-1 p-6 space-y-4" onClick={() => handleCardClick(user)}>
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <div className="space-y-1 text-sm text-left">
                        <div className="flex justify-between"><span>பங்களிப்பு:</span> <span className="font-medium">{formatCurrency(user.contribution)} ({user.frequency === 'weekly' ? 'வாராந்திர' : 'மாதாந்திர'})</span></div>
                        <div className="flex justify-between font-bold"><span>மொத்த சேமிப்பு:</span> <span>{formatCurrency(user.totalSaved)}</span></div>
                    </div>
                 </CardContent>
                 <CardFooter className="p-2 border-t bg-muted/20">
                    <div className="flex justify-between w-full">
                        <Button variant="ghost" size="icon" onClick={(e) => handleAddPaymentClick(e, user)}>
                            <Plus className="h-5 w-5"/>
                        </Button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuLabel>செயல்கள்</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCardClick(user)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>பரிவர்த்தனைகளைப் பார்க்க</span>
                                </DropdownMenuItem>
                                <Link href={`/diwali-scheme/users-tamil/${user.id}/edit`}>
                                     <DropdownMenuItem>
                                        <FilePenLine className="mr-2 h-4 w-4" />
                                        <span>திருத்து</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={() => handleDelete(user.id, user.name)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>நீக்கு</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Transactions Modal */}
      {transactionsUser && (
        <Dialog open={!!transactionsUser} onOpenChange={(isOpen) => !isOpen && setTransactionsUser(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{transactionsUser.name} - பரிவர்த்தனை வரலாறு</DialogTitle>
                    <DialogDescription>
                        {transactionsUser.name} க்கான அனைத்து பரிவர்த்தனைகளின் பட்டியல்.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>தேதி</TableHead>
                                <TableHead>விளக்கம்</TableHead>
                                <TableHead className="text-right">தொகை</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionsUser.transactions && transactionsUser.transactions.length > 0 ? (
                                transactionsUser.transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{tx.date}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">
                                            + {formatCurrency(tx.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">
                                        பரிவர்த்தனைகள் எதுவும் இல்லை.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
      )}

      {/* Add Payment Modal */}
      {paymentUser && (
        <Dialog open={!!paymentUser} onOpenChange={(isOpen) => !isOpen && setPaymentUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{paymentUser.name} க்கான புதிய கட்டணம்</DialogTitle>
              <DialogDescription>
                புதிய பங்களிப்பு தொகையை உள்ளிடவும்.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-amount">தொகை</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="₹1000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentUser(null)}>
                ரத்துசெய்
              </Button>
              <Button onClick={handleSavePayment}>பணத்தைச் சேமி</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </TamilAppLayout>
  );
}
 

    