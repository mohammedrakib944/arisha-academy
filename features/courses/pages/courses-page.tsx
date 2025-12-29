import { getCourses } from "@/features/courses/actions/courses";
import { ContentCard } from "@/features/common/components/content-card";

export async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">সব কোর্স</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <ContentCard
              key={course.id}
              id={course.id}
              href={`/courses/${course.id}`}
              thumbnail={course.thumbnail}
              title={course.title}
              price={course.price}
              currency="৳"
              metadata={`${course.totalClasses} ক্লাস`}
            />
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            এখনও কোন কোর্স নেই।
          </p>
        )}
      </main>
    </div>
  );
}
