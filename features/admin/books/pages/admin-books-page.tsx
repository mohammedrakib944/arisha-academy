import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getBooks } from "@/features/books/actions/books";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DeleteBookButton } from "@/features/admin/books/components/delete-book-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function AdminBooksPage() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    redirect("/");
  }

  const books = await getBooks();

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">বই পরিচালনা</h1>
          <Link href="/admin/books/new">
            <Button>নতুন বই তৈরি করুন</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden shadow-none hover:shadow-lg transition-shadow h-full"
            >
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
                <div className="relative w-24 h-24 -mt-12 ml-4">
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <CardHeader className="p-4">
                <CardTitle>{book.title}</CardTitle>
                {book.description && (
                  <CardDescription className="line-clamp-2">
                    {book.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pl-4 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    ৳ {book.price} tk
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 px-4 pb-4">
                <Link href={`/admin/books/${book.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      সম্পাদনা
                    </Button>
                </Link>
                <DeleteBookButton bookId={book.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
        {books.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            এখনও কোন বই নেই। আপনার প্রথম বই তৈরি করুন!
          </p>
        )}
      </main>
    </div>
  );
}
