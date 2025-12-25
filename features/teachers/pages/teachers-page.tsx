import { Navbar } from '@/features/common/components/navbar'
import { getTeachers } from '@/features/teachers/actions/teachers'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Teachers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Link key={teacher.id} href={`/teachers/${teacher.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                {teacher.image && (
                  <div className="relative w-full h-64">
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{teacher.name}</CardTitle>
                  {teacher.bio && (
                    <CardDescription className="line-clamp-3">
                      {teacher.bio}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {teacher.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {teachers.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No teachers available yet.
          </p>
        )}
      </main>
    </div>
  )
}

