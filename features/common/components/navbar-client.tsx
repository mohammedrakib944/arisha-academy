"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";

type User = {
  id: string;
  username: string;
  phoneNumber: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
} | null;

interface NavbarClientProps {
  user: User;
}

const adminLinks = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/admin/courses", label: "কোর্স পরিচালনা", icon: GraduationCap },
  { href: "/admin/books", label: "বই পরিচালনা", icon: BookOpen },
  { href: "/admin/teachers", label: "শিক্ষক পরিচালনা", icon: Users },
];

const mainLinks = [
  { href: "/courses", label: "কোর্স", icon: GraduationCap },
  { href: "/books", label: "বই", icon: BookOpen },
  { href: "/teachers", label: "শিক্ষক", icon: Users },
];

export function NavbarClient({ user }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold transition-colors hover:text-primary"
          >
            <GraduationCap className="h-6 w-6" />
            <span>আরিশা একাডেমি</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-primary font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-sm font-medium"
                      >
                        অ্যাডমিন
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>অ্যাডমিন প্যানেল</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {adminLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                          <DropdownMenuItem key={link.href} asChild>
                            <Link
                              href={link.href}
                              className={`flex items-center gap-2 cursor-pointer ${
                                active ? "text-primary font-semibold" : ""
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isActive("/profile") ? "text-primary font-semibold" : ""
                    }
                  >
                    প্রোফাইল
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                >
                  লগআউট
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    isActive("/login") ? "text-primary font-semibold" : ""
                  }
                >
                  লগইন
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  আরিশা একাডেমি
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col pl-2">
                {mainLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-2 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent ${
                        active
                          ? "text-primary font-semibold bg-accent"
                          : "hover:text-primary"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    {user.role === "ADMIN" && (
                      <>
                        <div className="border-t pt-4 mt-2">
                          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            অ্যাডমিন
                          </p>
                          {adminLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-2 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent ${
                                  active
                                    ? "text-primary font-semibold bg-accent"
                                    : "hover:text-primary"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Icon className="h-4 w-4" />
                                {link.label}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                    <div className="border-t pt-4 pl-2 pr-5 mt-2">
                      <Link
                        href="/profile"
                        className="block text-sm font-medium transition-colors hover:text-primary flex items-center gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          size="sm"
                          className={
                            isActive("/profile")
                              ? "text-primary font-semibold"
                              : ""
                          }
                        >
                          <User className="h-4 w-4" /> প্রোফাইল
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full justify-start mt-5"
                        onClick={async () => {
                          await logout();
                          window.location.href = "/";
                        }}
                      >
                        লগআউট <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="border-t pt-4 pr-2 mt-2">
                    <Link
                      href="/login"
                      className="block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="default" size="sm" className="w-full">
                        লগইন
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
