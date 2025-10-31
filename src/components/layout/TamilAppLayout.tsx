
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart,
    Gift,
    LayoutGrid,
    LogOut,
    PanelLeft,
    Settings,
    ShieldCheck,
    Sun,
    Users2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const navItems = [
    { href: "/dashboard-tamil", label: "முகப்பு", icon: LayoutGrid },
    { href: "/loans/users-tamil", label: "கடன் விவரங்கள்", icon: Users2 },
    { href: "/diwali-scheme/users-tamil", label: "தீபாவளி சிட்", icon: Gift },
];

export function TamilAppLayout({ children, showFloatingNav }: { children: React.ReactNode, showFloatingNav?: boolean }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  }

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
                                    isActive={pathname === item.href || (item.href !== '/dashboard-tamil' && pathname.startsWith(item.href))}
                                    tooltip={item.label}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                             </Link>
                         </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton tooltip="அமைப்புகள்">
                                    <Settings />
                                    <span>அமைப்புகள்</span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" side="right" align="start" sideOffset={8}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Label htmlFor="dark-mode-toggle" className="flex items-center gap-2 cursor-pointer">
                                        <Sun className="w-4 h-4" />
                                        <span>இருண்ட பயன்முறை</span>
                                    </Label>
                                    <Switch
                                        id="dark-mode-toggle"
                                        className="ml-auto"
                                        checked={isDarkMode}
                                        onCheckedChange={toggleTheme}
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <Link href="/">
                                    <DropdownMenuItem>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>வெளியேறு</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
             <header className="flex items-center justify-between p-4 border-b bg-muted/40 md:hidden">
                <SidebarTrigger>
                    <PanelLeft />
                </SidebarTrigger>
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="font-headline">வைப்புத்தொகை 360</span>
                </Link>
             </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background relative">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
