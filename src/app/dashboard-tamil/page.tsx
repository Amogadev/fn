
"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Copy,
  Users2,
  Gift,
  UserPlus,
  LayoutGrid,
  BarChart,
  Settings,
  Sun,
  LogOut,
  Landmark,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCollection, useFirestore, useMemoFirebase, useUser, useAuth } from "@/firebase";
import { collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";


const ActionCard = ({
  title,
  description,
  icon: Icon,
  className,
  href,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  href?: string;
}) => {
  const CardInnerContent = (
    <Card
      className={cn(
        "flex h-full flex-col items-center justify-center bg-card p-6 text-center hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <Icon className="mb-4 h-10 w-10 text-primary" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </Card>
  );

  if (href) {
    return <Link href={href}>{CardInnerContent}</Link>;
  }

  return CardInnerContent;
};

const navItems = [
    { href: "/dashboard-tamil", label: "முகப்பு", icon: LayoutGrid },
    { href: "/loans/users-tamil", label: "கடன் விவரங்கள்", icon: Users2 },
    { href: "/diwali-scheme/users-tamil", label: "தீபாவளி சிட்", icon: Gift },
];


export default function DashboardTamilPage() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsDarkMode(theme === 'dark');
  }, [theme]);
  
  const loanUsersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'loan-users');
  }, [firestore, user]);
  const { data: loanUsers, isLoading: loanUsersLoading } = useCollection(loanUsersQuery);

  const diwaliUsersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'diwali-users');
  }, [firestore, user]);

  const { data: diwaliUsers, isLoading: diwaliUsersLoading } = useCollection(diwaliUsersQuery);
  
  const [dashboardData, setDashboardData] = useState({
      loanWallet: 0,
      diwaliWallet: 0,
      totalLoansGiven: 0,
      loanUsersCount: 0,
      totalDiwaliSavings: 0,
      diwaliUsersCount: 0,
  });

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ta-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }));

    if (loanUsers && diwaliUsers) {
      const initialLoanCapital = 100000;
      const loanUsersCount = loanUsers.length;
      const diwaliUsersCount = diwaliUsers.length;
    
      const totalLoansGiven = loanUsers.reduce((acc, user) => acc + (user.loanAmount || 0), 0);
      const totalDiwaliSavings = diwaliUsers.reduce((acc, user) => acc + (user.totalSaved || 0), 0);
      
      const loanWallet = initialLoanCapital - totalLoansGiven;
      const diwaliWallet = totalDiwaliSavings;

      setDashboardData({
          loanWallet,
          diwaliWallet,
          totalLoansGiven,
          loanUsersCount,
          totalDiwaliSavings,
          diwaliUsersCount,
      })
    }

  }, [loanUsers, diwaliUsers]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/');
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
  
  const isLoading = isUserLoading || loanUsersLoading || diwaliUsersLoading;

  return (
    <TamilAppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight font-headline">லக்கி சிட் பண்ட்</h1>
          <div className="text-right">
            <p className="text-lg font-semibold">{isClient ? currentDate : '...'}</p>
          </div>
        </header>

        <Card>
            <CardContent className="p-2">
                <nav className="flex items-center space-x-1">
                    {navItems.map((item) => (
                        <Button key={item.label} asChild variant="ghost" className="flex-1 justify-start gap-2">
                            <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        </Button>
                    ))}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex-1 justify-start gap-2">
                          <Settings className="h-4 w-4" />
                          அமைப்புகள்
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Label htmlFor="dark-mode-toggle-main" className="flex items-center gap-2 cursor-pointer">
                                  <Sun className="w-4 h-4" />
                                  <span>இருண்ட பயன்முறை</span>
                              </Label>
                              <Switch
                                  id="dark-mode-toggle-main"
                                  className="ml-auto"
                                  checked={isDarkMode}
                                  onCheckedChange={toggleTheme}
                              />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                              <LogOut className="w-4 h-4 mr-2" />
                              <span>வெளியேறு</span>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-primary text-primary-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">கடன் நிதி</CardTitle>
                    <Landmark className="w-5 h-5 text-primary-foreground/80"/>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-4xl font-bold">₹...</p>
                    ) : (
                        <p className="text-4xl font-bold">{formatCurrency(dashboardData.loanWallet)}</p>
                    )}
                    <p className="text-xs text-primary-foreground/80 mt-1">கடன் வழங்குவதற்கு கிடைக்கும் இருப்பு</p>
                </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">தீபாவளி நிதி</CardTitle>
                    <PiggyBank className="w-5 h-5 text-secondary-foreground/80"/>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-4xl font-bold">₹...</p>
                    ) : (
                        <p className="text-4xl font-bold">{formatCurrency(dashboardData.diwaliWallet)}</p>
                    )}
                    <p className="text-xs text-secondary-foreground/80 mt-1">மொத்த சேமிப்பு வசூல்</p>
                </CardContent>
            </Card>
        </div>


        <section>
          <h2 className="text-2xl font-semibold mb-4 font-headline">கடன்</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="புதிய கடன் பதிவு"
              description="ஒரு புதிய பயனரைச் சேர்க்கவும்"
              icon={UserPlus}
              className="lg:row-span-2"
              href="/loans/new-tamil"
            />
            <Card className="flex flex-col justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  வழங்கப்பட்ட மொத்தக் கடன்கள்
                </p>
                 {isLoading ? (
                    <p className="text-3xl font-bold">₹...</p>
                 ) : (
                    <p className="text-3xl font-bold">{formatCurrency(dashboardData.totalLoansGiven)}</p>
                 )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                வழங்கப்பட்ட அசல் தொகை
              </p>
            </Card>
            <Card className="flex flex-col justify-between p-6">
               <div>
                <p className="text-sm text-muted-foreground">
                  மொத்த கடன் பயனர்கள்
                </p>
                <p className="text-3xl font-bold">{isLoading ? '...' : dashboardData.loanUsersCount}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                கடன் பெற்ற பயனர்கள்
              </p>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 font-headline">தீபாவளி சேமிப்புத் திட்டம்</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="திட்டத்தில் சேரவும்"
              description="சேமித்து பண்டிகை போனஸ் பெறுங்கள்"
              icon={Gift}
              className="lg:row-span-2"
              href="/diwali-scheme/new"
            />
            <Card className="flex flex-col justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">மொத்த சேமிப்பு</p>
                {isLoading ? (
                    <p className="text-3xl font-bold">₹...</p>
                ) : (
                    <p className="text-3xl font-bold">{formatCurrency(dashboardData.totalDiwaliSavings)}</p>
                )}
              </div>
               <p className="text-xs text-muted-foreground mt-2">பயனர்கள் சேமித்தவை</p>
            </Card>
            <Card className="flex flex-col justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  சேமிப்புத் திட்ட பயனர்கள்
                </p>
                <p className="text-3xl font-bold">{isLoading ? '...' : dashboardData.diwaliUsersCount}</p>
              </div>
               <p className="text-xs text-muted-foreground mt-2">
                திட்டத்தில் பங்கேற்கும் பயனர்கள்
              </p>
            </Card>
          </div>
        </section>
      </div>
    </TamilAppLayout>
  );
}
