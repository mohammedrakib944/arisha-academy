import { Navbar } from "@/features/common/components/navbar";
import { getCourses } from "@/features/courses/actions/courses";
import { getBooks } from "@/features/books/actions/books";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function HomePage() {
  const courses = await getCourses();
  const books = await getBooks();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
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
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {course.thumbnail && (
                    <div className="relative w-full h-48">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    {course.description && (
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${course.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course.totalClasses} Classes
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
        </section>
      </main>
    </div>
  );
}

