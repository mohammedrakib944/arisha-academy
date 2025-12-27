import { getCourses } from "@/features/courses/actions/courses";
import { ContentCard } from "@/features/common/components/content-card";

export async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <ContentCard
              key={course.id}
              id={course.id}
              href={`/courses/${course.id}`}
              thumbnail={course.thumbnail}
              title={course.title}
              description={course.description}
              price={course.price}
              currency="৳"
              metadata={`${course.totalClasses} Classes`}
              imageHeight="h-64"
            />
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
