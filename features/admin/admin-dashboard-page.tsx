import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionList } from "@/features/admin/transactions/components/transaction-list";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    redirect("/");
  }

  const adminCards = [
    {
      color: "#daf6ff",
      href: "/admin/courses",
      title: "কোর্স পরিচালনা",
      description: "কোর্স তৈরি, সম্পাদনা এবং মুছুন",
    },
    {
      color: "#ffe5e4",
      href: "/admin/books",
      title: "বই পরিচালনা",
      description: "বই তৈরি, সম্পাদনা এবং মুছুন",
    },
    {
      color: "#ceffd3",
      href: "/admin/teachers",
      title: "শিক্ষক পরিচালনা",
      description: "শিক্ষক তৈরি, সম্পাদনা এবং মুছুন",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">অ্যাডমিন ড্যাশবোর্ড</h1>
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
          <TransactionList />
        </div>
      </main>
    </div>
  );
}
