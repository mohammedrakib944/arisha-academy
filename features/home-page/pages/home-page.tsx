import { getCourses } from "@/features/courses/actions/courses";
import { getBooks } from "@/features/books/actions/books";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/features/common/components/content-card";

export async function HomePage() {
  const courses = await getCourses();
  const books = await getBooks();

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Arisha Academy</h1>
          <p className="text-muted-foreground text-lg">
            Discover our courses and books
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Link href="/courses">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <ContentCard
                key={course.id}
                id={course.id}
                href={`/courses/${course.id}`}
                thumbnail={course.thumbnail}
                title={course.title}
                description={course.description}
                price={course.price}
                currency="৳"
                metadata={`${course.totalClasses} Classes`}
                imageHeight="h-48"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Books</h2>
            <Link href="/books">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.slice(0, 6).map((book) => (
              <ContentCard
                key={book.id}
                id={book.id}
                href={`/books/${book.id}`}
                thumbnail={book.thumbnail}
                title={book.title}
                description={book.description}
                price={book.price}
                currency="$"
                imageHeight="h-48"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
