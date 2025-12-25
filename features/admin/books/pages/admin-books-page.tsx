import { Navbar } from '@/features/common/components/navbar'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { getBooks } from '@/features/books/actions/books'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteBookButton } from '@/features/admin/books/components/delete-book-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export async function AdminBooksPage() {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect('/')
  }

  const books = await getBooks()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Manage Books</h1>
          <Link href="/admin/books/new">
            <Button>Create New Book</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              {book.thumbnail && (
                <div className="relative w-full h-48">
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                {book.description && (
                  <CardDescription className="line-clamp-2">
                    {book.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">
                    ${book.price}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/admin/books/${book.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteBookButton bookId={book.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
        {books.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No books yet. Create your first book!
          </p>
        )}
      </main>
    </div>
  )
}

