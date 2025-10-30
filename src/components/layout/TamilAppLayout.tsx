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
    Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard-tamil", label: "முகப்பு", icon: LayoutGrid },
    { href: "/loans/new-tamil", label: "கடன் விவரங்கள்", icon: Users2 },
    { href: "#", label: "தீபாவளி சிட்", icon: Gift },
    { href: "#", label: "அறிக்கைகள்", icon: BarChart },
    { href: "#", label: "அமைப்புகள்", icon: Settings },
];

const NavLink = ({ href, label, icon: Icon, isActive }: { href: string, label: string, icon: React.ElementType, isActive: boolean}) => (
    <Link href={href} className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "text-primary bg-muted"
    )}>
        <Icon className="h-4 w-4" />
        {label}
    </Link>
);

const FloatingNavItem = ({ href, label, icon: Icon, isActive }: { href: string, label: string, icon: React.ElementType, isActive: boolean}) => (
    <Link href={href} className={cn(
        "flex flex-col items-center justify-center gap-1 p-2 rounded-md text-xs font-medium",
        isActive ? "text-primary" : "text-muted-foreground"
    )}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
    </Link>
);


export function TamilAppLayout({ children, showFloatingNav = true }: { children: React.ReactNode, showFloatingNav?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="font-headline">வைப்புத்தொகை 360</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <NavLink key={`${item.href}-${item.label}`} {...item} isActive={pathname === item.href} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center gap-2 font-semibold md:hidden">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="font-headline">வைப்புத்தொகை 360</span>
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="sr-only">வைப்புத்தொகை 360</span>
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        className={cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                            pathname === item.href && "bg-muted text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          {/* This empty div is for spacing on desktop */}
          <div className="hidden md:block"></div>
           <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="sr-only">வைப்புத்தொகை 360</span>
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        className={cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                            pathname === item.href && "bg-muted text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
        </main>
        {showFloatingNav && (
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t shadow-lg z-10">
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => (
                        <FloatingNavItem key={`${item.href}-${item.label}`} {...item} isActive={pathname === item.href} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
