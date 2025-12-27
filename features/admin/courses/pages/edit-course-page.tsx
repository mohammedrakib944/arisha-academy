import { getCurrentUser, isAdmin } from '@/lib/auth'
import { getCourse } from '@/features/courses/actions/courses'
import { getTeachers } from '@/features/teachers/actions/teachers'
import { redirect, notFound } from 'next/navigation'
import { CourseForm } from '@/features/admin/courses/components/course-form'

export async function EditCoursePage({ id }: { id: string }) {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect('/')
  }

  const course = await getCourse(id)
  const teachers = await getTeachers()

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Edit Course</h1>
        <CourseForm course={course} teachers={teachers} />
      </main>
    </div>
  )
}

