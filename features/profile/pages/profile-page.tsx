import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          teachers: {
            include: { teacher: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter out enrollments with null courses (in case course was deleted)
  const validEnrollments = enrollments.filter((e) => e.course !== null);

  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: {
      book: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter out purchases with null books (in case book was deleted)
  const validPurchases = purchases.filter((p) => p.book !== null);

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">আমার প্রোফাইল</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">তথ্য</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2">
                <strong>ব্যবহারকারীর নাম:</strong> {user.username}
              </p>
              <p>
                <strong>ফোন নম্বর:</strong> {user.phoneNumber}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">নিবন্ধিত কোর্স</h2>
          {validEnrollments.length === 0 ? (
            <p className="text-muted-foreground">এখনও কোন নিবন্ধিত কোর্স নেই।</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validEnrollments.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  className="overflow-hidden flex flex-col justify-between"
                >
                  {enrollment.course.thumbnail && (
                    <div className="relative w-full h-48">
                      <Image
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-lg">
                      {enrollment.course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 relative">
                    {enrollment.status === "PENDING" ||
                    enrollment.status === "REJECTED" ? (
                      <div className="flex items-center justify-center">
                        <Badge
                          variant={getStatusVariant(enrollment.status)}
                          className={cn(
                            "w-fit py-2 px-4 hover:bg-initial hover:text-initial",
                            enrollment.status === "PENDING"
                              ? "bg-blue-100 text-blue-500"
                              : enrollment.status === "REJECTED"
                              ? "bg-red-100 text-red-500"
                              : ""
                          )}
                        >
                          {enrollment.status === "PENDING"
                            ? "অনুমোদনের জন্য অপেক্ষা করছে"
                            : enrollment.status}
                        </Badge>
                      </div>
                    ) : (
                      <Link
                        href={enrollment.course.courseOutlineUrl || "#"}
                        target="_blank"
                      >
                        <Button
                          className="w-full"
                          disabled={!enrollment.course.courseOutlineUrl}
                        >
                          গ্রুপে যোগ দিন <ArrowRight />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">ক্রয়কৃত বই</h2>
          {validPurchases.length === 0 ? (
            <p className="text-muted-foreground">এখনও কোন ক্রয়কৃত বই নেই।</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validPurchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden">
                  {purchase.book.thumbnail && (
                    <div className="relative w-full h-48">
                      <Image
                        src={purchase.book.thumbnail}
                        alt={purchase.book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {purchase.book.title}
                      </CardTitle>
                      <Badge variant={getStatusVariant(purchase.status)}>
                        {purchase.status === "PENDING"
                          ? "অনুমোদনের জন্য অপেক্ষা করছে"
                          : purchase.status}
                      </Badge>
                    </div>
                    {purchase.book.description && (
                      <CardDescription>
                        {purchase.book.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Link href={`/books/${purchase.book.id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        বিস্তারিত দেখুন →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
