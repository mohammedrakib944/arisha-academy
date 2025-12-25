import { Navbar } from "@/features/common/components/navbar";
import { getCourses } from "@/features/courses/actions/courses";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
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
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  {course.description && (
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${course.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {course.totalClasses} Classes
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No courses available yet.
          </p>
        )}
      </main>
    </div>
  );
}

