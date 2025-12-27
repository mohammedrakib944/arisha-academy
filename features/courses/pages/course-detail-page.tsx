import { getCourse } from "@/features/courses/actions/courses";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PurchaseForm } from "@/features/courses/components/purchase-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function CourseDetailPage({ id }: { id: string }) {
  const course = await getCourse(id);

  console.log("Course Detail Page: ", course);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="col-span-3">
            {course.thumbnail && (
              <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground text-lg mb-6">
              {course.description}
            </p>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Price</h2>
              <p className="text-4xl font-bold text-primary">${course.price}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Course Details</h2>
              <div className="space-y-2">
                <p>
                  <strong>Total Classes:</strong> {course.totalClasses}
                </p>
                <p>
                  <strong>Total Exams:</strong> {course.totalExams}
                </p>
              </div>
            </div>
            {course.teachers.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Teachers</h2>
                <div className="flex flex-wrap gap-2">
                  {course.teachers.map((ct) => (
                    <Badge key={ct.teacherId} variant="secondary">
                      {ct.teacher.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {course.subjects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Subjects & Lessons</h2>
                <div className="space-y-4">
                  {course.subjects.map((subject) => (
                    <Card key={subject.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {subject.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                          {subject.lessons.map((lesson) => (
                            <li key={lesson.id} className="text-sm">
                              {lesson.title}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {course.overview && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <div
                  className="course-overview"
                  dangerouslySetInnerHTML={{ __html: course.overview }}
                />
              </div>
            )}
            {course.routineImage && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Routine</h2>
                <div className="relative w-full h-auto">
                  <Image
                    src={course.routineImage}
                    alt="Course Routine"
                    width={800}
                    height={600}
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
            {/* {course.courseOutlineUrl && (
              <div className="mb-6">
                <a
                  href={course.courseOutlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Download Course Outline</Button>
                </a>
              </div>
            )} */}
          </div>
          <div className="col-span-2">
            <PurchaseForm courseId={course.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
