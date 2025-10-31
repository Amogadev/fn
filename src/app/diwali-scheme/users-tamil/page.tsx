
"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Search, FilePenLine, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [selectedUser, setSelectedUser] = useState<DiwaliUser | null>(null);

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
    setSelectedUser(user);
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <Card key={user.id} className="flex flex-col text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick(user)}>
                 <CardContent className="flex-1 p-6 space-y-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>பங்களிப்பு:</span> <span className="font-medium">{formatCurrency(user.contribution)} ({user.frequency === 'weekly' ? 'வாராந்திர' : 'மாதாந்திர'})</span></div>
                        <div className="flex justify-between font-bold"><span>மொத்த சேமிப்பு:</span> <span>{formatCurrency(user.totalSaved)}</span></div>
                    </div>
                 </CardContent>
                 <CardFooter className="p-2 border-t bg-muted/20">
                    <div className="flex justify-end w-full">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuLabel>செயல்கள்</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href={`/diwali-scheme/users-tamil/${user.id}`}>
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>பார்வை</span>
                                    </DropdownMenuItem>
                                </Link>
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
      
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{selectedUser.name} - பரிவர்த்தனை வரலாறு</DialogTitle>
                    <DialogDescription>
                        {selectedUser.name} க்கான அனைத்து பரிவர்த்தனைகளின் பட்டியல்.
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
                            {selectedUser.transactions && selectedUser.transactions.length > 0 ? (
                                selectedUser.transactions.map((tx) => (
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

    </TamilAppLayout>
  );
}
 