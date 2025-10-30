"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  HandCoins,
  History,
  Landmark,
  Users,
  LogOut,
  LandmarkIcon,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "../ui/button";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/loans/new",
    icon: HandCoins,
    label: "New Loan",
  },
  {
    href: "/loans/history",
    icon: History,
    label: "History",
  },
  {
    href: "/repayments",
    icon: Landmark,
    label: "Repayments",
  },
  {
    href: "/admin",
    icon: Users,
    label: "Admin",
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const avatarImage = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <LandmarkIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-headline">LendEase</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
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
        <SidebarFooter className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                {avatarImage && (
                  <AvatarImage
                    src={avatarImage.imageUrl}
                    alt={avatarImage.description}
                  />
                )}
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Admin User</span>
            </div>
            <Link href="/" legacyBehavior passHref>
              <Button variant="ghost" size="icon" asChild>
                <a><LogOut className="w-5 h-5" /></a>
              </Button>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-2">
             <LandmarkIcon className="w-6 h-6 text-primary" />
             <h1 className="text-lg font-bold font-headline">LendEase</h1>
          </div>
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
