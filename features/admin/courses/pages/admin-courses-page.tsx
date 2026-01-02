import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getCourses } from "@/features/courses/actions/courses";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DeleteCourseButton } from "@/features/admin/courses/components/delete-course-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function AdminCoursesPage() {
  try {
    const user = await getCurrentUser();
    if (!user || !(await isAdmin())) {
      redirect("/");
    }

    let courses: Awaited<ReturnType<typeof getCourses>> = [];
    try {
      courses = await getCourses();
    } catch (error) {
      console.error("Error fetching courses in AdminCoursesPage:", error);
      // Continue with empty array
    }

    return (
      <div className="min-h-screen">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">কোর্স পরিচালনা</h1>
            <Link href="/admin/courses/new">
              <Button>নতুন কোর্স তৈরি করুন</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden flex flex-col justify-between"
              >
                {course.thumbnail && (
                  <div className="relative w-full h-48">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle>{course.title}</CardTitle>
                  {course.description && (
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <div>
                  <CardContent className="pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        ${course.price}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full" size="sm">
                        আপডেট
                      </Button>
                    </Link>
                    <DeleteCourseButton courseId={course.id} />
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          {courses.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              এখনও কোন কোর্স নেই। আপনার প্রথম কোর্স তৈরি করুন!
            </p>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in AdminCoursesPage:", error);
    redirect("/");
  }
}
