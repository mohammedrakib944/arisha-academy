import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Arisha Academy
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/books" className="text-sm font-medium hover:text-primary transition-colors">
              Books
            </Link>
            <Link href="/teachers" className="text-sm font-medium hover:text-primary transition-colors">
              Teachers
            </Link>
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                  Profile
                </Link>
                <form action={logout}>
                  <Button type="submit" variant="ghost" size="sm">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

