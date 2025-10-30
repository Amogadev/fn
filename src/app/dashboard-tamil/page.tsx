"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  Copy,
  Users,
  Gift,
  LayoutGrid,
  BarChart,
  Settings,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";


const ActionCard = ({
  title,
  description,
  icon: Icon,
  className,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}) => (
  <Card className={cn("text-center flex flex-col justify-center items-center p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer", className)}>
    <Icon className="w-8 h-8 mb-2 text-gray-600" />
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);


export default function DashboardTamilPage() {
  const navItems = [
    { label: "முகப்பு", icon: LayoutGrid, active: true },
    { label: "கடன் விவரங்கள்", icon: Users, active: false },
    { label: "தீபாவளி சிட்", icon: Gift, active: false },
    { label: "அறிக்கைகள்", icon: BarChart, active: false },
    { label: "அமைப்புகள்", icon: Settings, active: false },
  ];
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold">வணக்கம்.</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          <span>30 அக்டோபர், 2025</span>
        </div>
      </header>

      <main className="p-6 space-y-8 pb-24 md:pb-8">
        <Card className="bg-[#2d3748] text-white">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-sm font-normal">
                மொத்த கை இருப்பு
              </CardTitle>
              <p className="text-4xl font-bold">₹0</p>
            </div>
            <Copy className="cursor-pointer" />
          </CardHeader>
        </Card>

        <section>
          <h2 className="mb-4 text-lg font-semibold">கடன்</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <ActionCard
              title="புதிய கடன் பதிவு"
              description="ஒரு புதிய பயனரைச் சேர்க்கவும்"
              icon={UserPlus}
              className="md:col-span-1"
            />
            <div className="space-y-6 md:col-span-2">
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    வழங்கப்பட்ட மொத்தக் கடன்கள்
                  </p>
                  <p className="text-2xl font-bold">₹0</p>
                  <p className="text-xs text-muted-foreground">
                    வழங்கப்பட்ட அசல் தொகை
                  </p>
                </div>
                <div className="text-3xl font-bold text-gray-300">₹</div>
              </Card>
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    மொத்த கடன் பயனர்கள்
                  </p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    கடன் பெற்ற பயனர்கள்
                  </p>
                </div>
                <Users className="w-8 h-8 text-gray-300" />
              </Card>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">தீபாவளி சேமிப்புத் திட்டம்</h2>
          <div className="grid gap-6 md:grid-cols-3">
             <ActionCard
              title="தீபாவளி சேமிப்புத் திட்டத்தில் சேரவும்"
              description="சேமித்து பண்டிகை போனஸ் பெறுங்கள்"
              icon={Gift}
               className="md:col-span-1"
            />
             <div className="space-y-6 md:col-span-2">
                 <Card className="flex items-center justify-between p-4">
                     <div>
                         <p className="text-sm text-muted-foreground">மொத்த சேமிப்பு</p>
                         <p className="text-2xl font-bold">₹0</p>
                         <p className="text-xs text-muted-foreground">பயனர்கள் சேமித்தவை</p>
                     </div>
                     <Gift className="w-8 h-8 text-gray-300"/>
                 </Card>
                 <Card className="flex items-center justify-between p-4">
                     <div>
                         <p className="text-sm text-muted-foreground">சேமிப்புத் திட்ட பயனர்கள்</p>
                         <p className="text-2xl font-bold">0</p>
                         <p className="text-xs text-muted-foreground">திட்டத்தில் பங்கேற்கும் பயனர்கள்</p>
                     </div>
                     <Users className="w-8 h-8 text-gray-300" />
                 </Card>
             </div>
          </div>
        </section>
      </main>

       <footer className="fixed bottom-4 left-4 right-4 md:hidden">
            <div className="flex items-center justify-around max-w-md mx-auto h-full px-4 py-3 bg-white rounded-2xl shadow-lg">
                 {navItems.map((item) => (
                    <Link href="#" key={item.label} className={cn(
                        "flex flex-col items-center justify-center text-xs w-16",
                        item.active ? "text-slate-800" : "text-muted-foreground"
                    )}>
                        <item.icon className="w-6 h-6 mb-1" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </footer>
    </div>
  );
}