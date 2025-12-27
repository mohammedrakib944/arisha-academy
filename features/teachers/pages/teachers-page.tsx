import { getTeachers } from "@/features/teachers/actions/teachers";
import { TeacherCard } from "@/features/common/components/teacher-card";

export async function TeachersPage() {
  const teachers = await getTeachers();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Teachers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
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
        {teachers.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No teachers available yet.
          </p>
        )}
      </main>
    </div>
  );
}
