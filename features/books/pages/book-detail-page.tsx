import { getBook } from '@/features/books/actions/books'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { BookPurchaseForm } from '@/features/books/components/purchase-form'

export async function BookDetailPage({ id }: { id: string }) {
  const book = await getBook(id)

  if (!book) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {book.thumbnail && (
              <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={book.thumbnail}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
            <p className="text-muted-foreground text-lg mb-6">
              {book.description}
            </p>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">মূল্য</h2>
              <p className="text-4xl font-bold text-primary">৳{book.price}</p>
            </div>
          </div>
          <div>
            <BookPurchaseForm bookId={book.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

