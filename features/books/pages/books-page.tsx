import { getBooks } from "@/features/books/actions/books";
import { ContentCard } from "@/features/common/components/content-card";

export async function BooksPage() {
  let books = [];

  try {
    books = await getBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
    // Continue with empty array
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">সব বই</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <ContentCard
              key={book.id}
              id={book.id}
              href={`/books/${book.id}`}
              thumbnail={book.thumbnail}
              title={book.title}
              description={book.description}
              price={book.price}
              currency="৳"
              showArrowIcon={true}
            />
          ))}
        </div>
        {books.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            এখনও কোন বই নেই।
          </p>
        )}
      </main>
    </div>
  );
}
