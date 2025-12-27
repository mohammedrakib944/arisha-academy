import { getCurrentUser, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeacherForm } from "@/features/admin/teachers/components/teacher-form";

export async function NewTeacherPage() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Create New Teacher
        </h1>
        <TeacherForm />
      </main>
    </div>
  );
}
