import { Navbar } from "@/features/common/components/navbar";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getTeachers } from "@/features/teachers/actions/teachers";
import { redirect } from "next/navigation";
import { CourseForm } from "@/features/admin/courses/components/course-form";

export async function NewCoursePage() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    redirect("/");
  }

  const teachers = await getTeachers();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-center font-bold mb-8">
          Create New Course
        </h1>
        <CourseForm teachers={teachers} />
      </main>
    </div>
  );
}
