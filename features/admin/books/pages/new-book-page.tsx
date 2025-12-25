import { Navbar } from '@/features/common/components/navbar'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BookForm } from '@/features/admin/books/components/book-form'

export async function NewBookPage() {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect('/')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Create New Book</h1>
        <BookForm />
      </main>
    </div>
  )
}

