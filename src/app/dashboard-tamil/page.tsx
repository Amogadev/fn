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
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  const CardContent = (
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
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
};


export default function DashboardTamilPage() {
  return (
    <TamilAppLayout>
      <div className="space-y-8">
        <header className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight font-headline">வணக்கம்.</h1>
          <p className="text-muted-foreground">30 அக்டோபர், 2025</p>
        </header>
          
        <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  மொத்த கை இருப்பு
                </CardTitle>
                <p className="text-4xl font-bold">₹1,00,000</p>
              </div>
              <Copy className="cursor-pointer" />
            </CardHeader>
        </Card>

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
                <p className="text-3xl font-bold">₹30,000</p>
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
                <p className="text-3xl font-bold">3</p>
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
            />
            <Card className="flex flex-col justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">மொத்த சேமிப்பு</p>
                <p className="text-3xl font-bold">₹1,000</p>
              </div>
               <p className="text-xs text-muted-foreground mt-2">பயனர்கள் சேமித்தவை</p>
            </Card>
            <Card className="flex flex-col justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  சேமிப்புத் திட்ட பயனர்கள்
                </p>
                <p className="text-3xl font-bold">1</p>
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