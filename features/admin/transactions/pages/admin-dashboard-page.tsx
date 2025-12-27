import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionList } from "@/features/admin/transactions/components/transaction-list";
import { getTransactions } from "@/features/transactions/actions/transactions";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    redirect("/");
  }

  const transactions = await getTransactions();

  const adminCards = [
    {
      color: "#daf6ff",
      href: "/admin/courses",
      title: "Manage Courses",
      description: "Create, edit, and delete courses",
    },
    {
      color: "#ffe5e4",
      href: "/admin/books",
      title: "Manage Books",
      description: "Create, edit, and delete books",
    },
    {
      color: "#ceffd3",
      href: "/admin/teachers",
      title: "Manage Teachers",
      description: "Create, edit, and delete teachers",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {adminCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card
                style={{ backgroundColor: card.color }}
                className="shadow-none hover:shadow-lg transition-shadow h-full relative group"
              >
                <div className="absolute top-4 right-4">
                  <ArrowUpRight className="h-5 w-5 group-hover:scale-150 transition-transform text-muted-foreground" />
                </div>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
