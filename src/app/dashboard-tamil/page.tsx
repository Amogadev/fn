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
  Users2,
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
  <Card
    className={cn(
      "flex h-full flex-col items-center justify-center bg-gray-50 p-6 text-center hover:bg-gray-100",
      className
    )}
  >
    <Icon className="mb-2 h-8 w-8 text-gray-600" />
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

export default function DashboardTamilPage() {
  const navItems = [
    { label: "முகப்பு", icon: LayoutGrid, active: true },
    { label: "கடன் விவரங்கள்", icon: Users2, active: false },
    { label: "தீபாவளி சிட்", icon: Gift, active: false },
    { label: "அறிக்கைகள்", icon: BarChart, active: false },
    { label: "அமைப்புகள்", icon: Settings, active: false },
  ];
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4 mx-auto max-w-7xl">
          <h1 className="text-xl font-bold">வணக்கம்.</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>30 அக்டோபர், 2025</span>
          </div>
        </div>
        <nav className="p-2 md:hidden bg-gray-50">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                href="#"
                key={item.label}
                className={cn(
                  "flex flex-col items-center justify-center text-center text-xs w-16",
                  item.active ? "text-slate-800" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="space-y-8 p-6 pb-24 md:pb-8">
        <Card className="bg-[#2d3748] text-white">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-sm font-normal">
                மொத்த கை இருப்பு
              </CardTitle>
              <p className="text-4xl font-bold">₹73,000</p>
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
              className="md:row-span-2"
            />
            <Card className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  வழங்கப்பட்ட மொத்தக் கடன்கள்
                </p>
                <p className="text-2xl font-bold">₹30,000</p>
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
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">
                  கடன் பெற்ற பயனர்கள்
                </p>
              </div>
              <Users2 className="h-8 w-8 text-gray-300" />
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">தீபாவளி சேமிப்புத் திட்டம்</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <ActionCard
              title="தீபாவளி சேமிப்புத் திட்டத்தில் சேரவும்"
              description="சேமித்து பண்டிகை போனஸ் பெறுங்கள்"
              icon={Gift}
              className="md:row-span-2"
            />
            <Card className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">மொத்த சேமிப்பு</p>
                <p className="text-2xl font-bold">₹1,000</p>
                <p className="text-xs text-muted-foreground">பயனர்கள் சேமித்தவை</p>
              </div>
              <Gift className="h-8 w-8 text-gray-300" />
            </Card>
            <Card className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  சேமிப்புத் திட்ட பயனர்கள்
                </p>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">
                  திட்டத்தில் பங்கேற்கும் பயனர்கள்
                </p>
              </div>
              <Users2 className="h-8 w-8 text-gray-300" />
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
