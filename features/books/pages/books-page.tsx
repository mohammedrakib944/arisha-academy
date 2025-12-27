import { getBooks } from "@/features/books/actions/books";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
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

                {book.thumbnail && (
                  <div className="relative w-24 h-24 -mt-12 ml-6 shadow-lg">
                    <Image
                      src={book.thumbnail}
                      alt={book.title}
                      fill
                      className="object-cover rounded"
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

                    <ArrowUpRight className="group-hover:scale-120 transition-transform" />
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
  );
}
