
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { CourseCurriculum } from "@/features/courses/components/course-curriculum";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function MyCoursesPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: "APPROVED",
        },
        include: {
            course: {
                include: {
                    subjects: {
                        include: {
                            lessons: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <h1 className="text-3xl font-bold mb-8">আমার কোর্সসমূহ</h1>

                {enrollments.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            <p>আপনার কোন সক্রিয় কোর্স নেই।</p>
                            <Link href="/courses" className="mt-4 inline-block">
                                <Button variant="outline">কোর্সগুলো দেখুন</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-12">
                        {enrollments.map(({ course }) => (
                            <div key={course.id} className="border rounded-xl overflow-hidden bg-card shadow-sm">
                                {/* Course Header */}
                                <div className="grid md:grid-cols-3 gap-6 p-6 border-b bg-muted/20">
                                    <div className="md:col-span-1">
                                        {course.thumbnail ? (
                                            <div className="relative aspect-video rounded-lg overflow-hidden border">
                                                <Image
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2 flex flex-col justify-center">
                                        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                                        {course.description && (
                                            <p className="text-muted-foreground mb-4 line-clamp-2">
                                                {course.description}
                                            </p>
                                        )}

                                        {/* Separate Group Joining Section */}
                                        {course.courseOutlineUrl && (
                                            <Alert className="bg-primary/5 border-primary/20 mt-auto">
                                                <Users className="h-4 w-4" />
                                                <AlertTitle>প্রাইভেট গ্রুপ</AlertTitle>
                                                <AlertDescription className="mt-2 flex items-center justify-between gap-4 flex-wrap">
                                                    <span>
                                                        কোর্সের আপডেট এবং আলোচনার জন্য আমাদের প্রাইভেট গ্রুপে জয়েন করুন।
                                                    </span>
                                                    <Link
                                                        href={course.courseOutlineUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button size="sm">
                                                            গ্রুপে জয়েন করুন <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* Full Curriculum Section */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-4">কোর্স কারিকুলাম</h3>
                                    <CourseCurriculum subjects={course.subjects} hasAccess={true} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
