import { Navbar } from '@/features/common/components/navbar'
import { getBooks } from '@/features/books/actions/books'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function BooksPage() {
  const books = await getBooks()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
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
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${book.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {books.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No books available yet.
          </p>
        )}
      </main>
    </div>
  )
}

