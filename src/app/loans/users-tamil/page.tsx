
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
import { ArrowLeft, Plus, Search, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

type LoanUser = {
    id: string;
    name: string;
    avatarUrl: string;
    loanAmount: number;
    paidAmount: number;
    status: string;
    idProof?: string;
    transactions?: { id: string; date: string; description: string; type: 'credit' | 'debit'; amount: number }[];
};


export default function LoanUsersPage() {
    const [currentDate, setCurrentDate] = useState('');
    const firestore = useFirestore();
    const { user } = useUser();
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();
    const [transactionsUser, setTransactionsUser] = useState<LoanUser | null>(null);
    const [repaymentUser, setRepaymentUser] = useState<LoanUser | null>(null);
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [userToDelete, setUserToDelete] = useState<LoanUser | null>(null);


    useEffect(() => {
        setIsClient(true);
        setCurrentDate(new Date().toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
    }, []);

    const loanUsersQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'loan-users');
    }, [firestore, user]);
    const { data: loanUsers, isLoading: isLoanUsersLoading } = useCollection<LoanUser>(loanUsersQuery);

    const filteredUsers = useMemo(() => {
        if (!loanUsers) return [];
        return loanUsers.filter((user) => {
            const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            const idProofMatch = user.idProof ? user.idProof.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            return nameMatch || idProofMatch;
        });
    }, [loanUsers, searchTerm]);


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ta-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
    };

    const confirmDelete = async () => {
        if (!userToDelete || !firestore) return;

        try {
            await deleteDoc(doc(firestore, "loan-users", userToDelete.id));
            toast({
                title: "பயனர் நீக்கப்பட்டார்",
                description: `${userToDelete.name} என்பவர் நீக்கப்பட்டுவிட்டார்.`,
            });
        } catch (e) {
            console.error("Error deleting user: ", e);
            toast({
                variant: "destructive",
                title: "பிழை",
                description: "பயனரை நீக்கும்போது ஒரு பிழை ஏற்பட்டது.",
            });
        } finally {
            setUserToDelete(null);
        }
    };

    const handleViewClick = (e: React.MouseEvent, user: LoanUser) => {
        e.stopPropagation();
        setTransactionsUser(user);
    };

    const handleAddRepaymentClick = (e: React.MouseEvent, user: LoanUser) => {
        e.stopPropagation();
        setRepaymentUser(user);
    };

    const handleSaveRepayment = async () => {
        if (!repaymentUser || !firestore) return;

        const amount = parseFloat(repaymentAmount);
        if (isNaN(amount) || amount <= 0) {
          toast({
            variant: "destructive",
            title: "தவறான தொகை",
            description: "சரியான தொகையை உள்ளிடவும்.",
          });
          return;
        }

        const userDocRef = doc(firestore, "loan-users", repaymentUser.id);
        
        const newTransaction = {
          id: `txn_${Date.now()}`,
          date: new Date().toLocaleDateString('ta-IN'),
          description: "EMI செலுத்தியது",
          type: 'credit' as const,
          amount: amount,
        };
        
        const updatedPaidAmount = (repaymentUser.paidAmount || 0) + amount;
        const updatedTransactions = [...(repaymentUser.transactions || []), newTransaction];
        const newStatus = updatedPaidAmount >= repaymentUser.loanAmount ? "முடிந்தது" : "செயலில்";

        try {
          await updateDoc(userDocRef, {
            paidAmount: updatedPaidAmount,
            transactions: updatedTransactions,
            status: newStatus
          });

          toast({
            title: "பணம் சேமிக்கப்பட்டது",
            description: `${repaymentUser.name} க்கான ${formatCurrency(amount)} வெற்றிகரமாக சேர்க்கப்பட்டது.`,
          });

          setRepaymentUser(null);
          setRepaymentAmount('');
        } catch (e) {
          console.error("Error updating repayment: ", e);
          toast({
            variant: "destructive",
            title: "பிழை",
            description: "பணம் சேமிக்கும்போது ஒரு பிழை ஏற்பட்டது.",
          });
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
                    <Input
                      placeholder="பெயர் / ரோல் எண் மூலம் தேடு..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                            ) : filteredUsers && filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{user.idProof}</p>
                                                    <p className="font-medium">{user.name}</p>
                                                </div>
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
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="icon" onClick={(e) => handleAddRepaymentClick(e, user)}>
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
                                                         <DropdownMenuItem onClick={(e) => handleViewClick(e, user)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            பரிவர்த்தனைகளைப் பார்க்க
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setUserToDelete(user)}
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
          {!isLoading && filteredUsers && filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">பயனர்கள் யாரும் இல்லை.</p>
            </div>
          ) : (
            filteredUsers && filteredUsers.map((user) => (
              <Card key={user.id} className="flex flex-col text-center">
                 <CardContent className="flex-1 p-6 space-y-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground">{user.idProof}</p>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <div className="space-y-1 text-sm text-left">
                        <div className="flex justify-between"><span>கடன்:</span> <span className="font-medium">{formatCurrency(user.loanAmount)}</span></div>
                        <div className="flex justify-between"><span>செலுத்தியது:</span> <span className="font-medium">{formatCurrency(user.paidAmount)}</span></div>
                        <div className="flex justify-between font-bold"><span>நிலுவை:</span> <span>{formatCurrency(user.loanAmount - user.paidAmount)}</span></div>
                    </div>
                 </CardContent>
                 <CardFooter className="p-2 border-t bg-muted/20">
                    <div className="flex justify-end w-full gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => handleAddRepaymentClick(e, user)}>
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
                                <DropdownMenuItem onClick={(e) => handleViewClick(e, user)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>பார்வை</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setUserToDelete(user)} className="text-destructive">
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
                                        <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : ''} {formatCurrency(tx.amount)}
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

      {/* Add Repayment Modal */}
      {repaymentUser && (
        <Dialog open={!!repaymentUser} onOpenChange={(isOpen) => !isOpen && setRepaymentUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{repaymentUser.name} க்கான புதிய கட்டணம்</DialogTitle>
              <DialogDescription>
                புதிய திருப்பிச் செலுத்தும் தொகையை உள்ளிடவும்.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="repayment-amount">தொகை</Label>
                <Input
                  id="repayment-amount"
                  type="number"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  placeholder="₹1000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRepaymentUser(null)}>
                ரத்துசெய்
              </Button>
              <Button onClick={handleSaveRepayment}>பணத்தைச் சேமி</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>நீக்குவதை உறுதிப்படுத்தவும்</AlertDialogTitle>
            <AlertDialogDescription>
              நீங்கள் '{userToDelete?.name}' என்ற பயனரை நிரந்தரமாக நீக்க உள்ளீர்கள். இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>ரத்துசெய்</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              நீக்கு
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </TamilAppLayout>
  );
}
