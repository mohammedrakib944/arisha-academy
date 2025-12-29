import { getTeacher } from '@/features/teachers/actions/teachers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export async function TeacherDetailPage({ id }: { id: string }) {
  const teacher = await getTeacher(id)

  if (!teacher) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teacher.image && (
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-4">{teacher.name}</h1>
              {teacher.bio && (
                <p className="text-muted-foreground text-lg mb-6">
                  {teacher.bio}
                </p>
              )}
              {teacher.subjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">শিক্ষাদান করা বিষয়</h2>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {teacher.courses && teacher.courses.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">কোর্স</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacher.courses.map((ct) => (
                  <a key={ct.course.id} href={`/courses/${ct.course.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      {ct.course.thumbnail && (
                        <div className="relative w-full h-48">
                          <Image
                            src={ct.course.thumbnail}
                            alt={ct.course.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{ct.course.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

