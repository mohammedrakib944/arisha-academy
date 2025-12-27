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

  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: {
      book: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Information</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2">
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Phone Number:</strong> {user.phoneNumber}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
          {enrollments.length === 0 ? (
            <p className="text-muted-foreground">No enrolled courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden">
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
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {enrollment.course.title}
                      </CardTitle>
                      <Badge variant={getStatusVariant(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                    </div>
                    {enrollment.course.description && (
                      <CardDescription>
                        {enrollment.course.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Link href={`/courses/${enrollment.course.id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        View Details →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Purchased Books</h2>
          {purchases.length === 0 ? (
            <p className="text-muted-foreground">No purchased books yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
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
                        {purchase.status}
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
                        View Details →
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
