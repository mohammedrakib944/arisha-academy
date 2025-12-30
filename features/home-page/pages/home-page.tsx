import { getCourses } from "@/features/courses/actions/courses";
import { getTeachers } from "@/features/teachers/actions/teachers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/features/common/components/content-card";
import { TeacherCard } from "@/features/common/components/teacher-card";

export async function HomePage() {
  const courses = await getCourses();
  const teachers = await getTeachers();

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 pt-8 pb-24">
        <div className="bg-gradient-to-bl from-blue-600 to-primary p-6 lg:min-h-80 bg-cover bg-top mb-12 text-center rounded-lg bg-blend-overlay flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white ">
            আরিশা একাডেমিতে স্বাগতম
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            আমাদের কোর্স এবং বই দেখুন
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">বিশেষ কোর্স</h2>
            <Link href="/courses">
              <Button variant="ghost">সব দেখুন</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <ContentCard
                key={course.id}
                id={course.id}
                href={`/courses/${course.id}`}
                thumbnail={course.thumbnail}
                title={course.title}
                price={course.price}
                currency="৳"
                metadata={`${course.totalClasses} ক্লাস`}
                imageHeight="h-48"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">বিশেষ শিক্ষক</h2>
            <Link href="/teachers">
              <Button variant="ghost">সব দেখুন</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.slice(0, 6).map((teacher) => (
              <TeacherCard
                key={teacher.id}
                id={teacher.id}
                href={`/teachers/${teacher.id}`}
                image={teacher.image}
                name={teacher.name}
                bio={teacher.bio}
                subjects={teacher.subjects}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
