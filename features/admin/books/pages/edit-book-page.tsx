import { getCurrentUser, isAdmin } from '@/lib/auth'
import { getBook } from '@/features/books/actions/books'
import { redirect, notFound } from 'next/navigation'
import { BookForm } from '@/features/admin/books/components/book-form'

export async function EditBookPage({ id }: { id: string }) {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect('/')
  }

  const book = await getBook(id)

  if (!book) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Edit Book</h1>
        <BookForm book={book} />
      </main>
    </div>
  )
}

