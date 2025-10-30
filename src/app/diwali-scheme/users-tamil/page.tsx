"use client";

import { TamilAppLayout } from "@/components/layout/TamilAppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const diwaliSchemeUsers = [
  {
    id: "ds_user_001",
    name: "சுனிதா",
    contribution: "₹1,000",
    frequency: "மாதாந்திர",
    totalSaved: "₹5,000",
    joinDate: "2024-03-10",
  },
  {
    id: "ds_user_002",
    name: "ரவி",
    contribution: "₹500",
    frequency: "வாராந்திர",
    totalSaved: "₹8,000",
    joinDate: "2024-02-20",
  },
];

export default function DiwaliSchemeUsersPage() {
  return (
    <TamilAppLayout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">
                    தீபாவளி சிட் பயனர் பட்டியல்
                </h1>
                <p className="text-muted-foreground">
                    தீபாவளி சேமிப்புத் திட்டத்தில் பங்கேற்கும் பயனர்களைக் காண்க.
                </p>
            </div>
             <div className="flex gap-4">
                <Link href="/dashboard-tamil">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        முகப்புக்குத் திரும்பு
                    </Button>
                </Link>
                <Link href="/diwali-scheme/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        புதிய பயனரைச் சேர்
                    </Button>
                </Link>
            </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>பங்கேற்பாளர்கள்</CardTitle>
            <CardDescription>
              தீபாவளி சேமிப்புத் திட்டத்தில் பதிவுசெய்யப்பட்ட பயனர்களின் பட்டியல்.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>பெயர்</TableHead>
                  <TableHead>பங்களிப்பு</TableHead>
                  <TableHead>கால இடைவெளி</TableHead>
                  <TableHead>மொத்த சேமிப்பு</TableHead>
                  <TableHead>சேர்ந்த தேதி</TableHead>
                  <TableHead className="text-right">செயல்கள்</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diwaliSchemeUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.contribution}</TableCell>
                    <TableCell>{user.frequency}</TableCell>
                    <TableCell>{user.totalSaved}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        பார்வையிடு
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TamilAppLayout>
  );
}
