"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Users2,
    Gift,
    BarChart,
    Settings,
    ShieldCheck,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const navItems = [
    { href: "/dashboard-tamil", label: "முகப்பு", icon: LayoutGrid },
    { href: "/loans/new-tamil", label: "கடன் விவரங்கள்", icon: Users2 },
    { href: "/diwali-scheme/new", label: "தீபாவளி சிட்", icon: Gift },
    { href: "#", label: "அறிக்கைகள்", icon: BarChart },
    { href: "#", label: "அமைப்புகள்", icon: Settings },
];

export function TamilAppLayout({ children, showFloatingNav = true }: { children: React.ReactNode, showFloatingNav?: boolean }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={false}>
        <Sidebar>
            <SidebarHeader>
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="font-headline">வைப்புத்தொகை 360</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                         <SidebarMenuItem key={`${item.href}-${item.label}`}>
                             <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    tooltip={item.label}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                             </Link>
                         </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
             <header className="flex items-center justify-between p-4 border-b bg-muted/40 md:hidden">
                <div className="flex items-center gap-2">
                    <SidebarTrigger>
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </SidebarTrigger>
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="font-headline">வைப்புத்தொகை 360</span>
                    </Link>
                </div>
             </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background relative">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
