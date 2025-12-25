import { Navbar } from '@/features/common/components/navbar'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { getTeacher } from '@/features/teachers/actions/teachers'
import { redirect, notFound } from 'next/navigation'
import { TeacherForm } from '@/features/admin/teachers/components/teacher-form'

export async function EditTeacherPage({ id }: { id: string }) {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect('/')
  }

  const teacher = await getTeacher(id)

  if (!teacher) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Edit Teacher</h1>
        <TeacherForm teacher={teacher} />
      </main>
    </div>
  )
}

