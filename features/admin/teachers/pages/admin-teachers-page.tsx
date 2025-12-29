import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getTeachers } from "@/features/teachers/actions/teachers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DeleteTeacherButton } from "@/features/admin/teachers/components/delete-teacher-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function AdminTeachersPage() {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    redirect("/");
  }

  const teachers = await getTeachers();

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">শিক্ষক পরিচালনা</h1>
          <Link href="/admin/teachers/new">
            <Button>নতুন শিক্ষক তৈরি করুন</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="overflow-hidden shadow-none hover:shadow-lg transition-shadow h-fullsh flex flex-col justify-between"
            >
              {teacher.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {teacher.image && (
                <div className="relative w-24 h-24 -mt-12 ml-4">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    className="object-cover rounded-full border-2 border-primary p-0.5"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{teacher.name}</CardTitle>
                {teacher.bio && (
                  <CardDescription className="line-clamp-2">
                    {teacher.bio}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-0">
                {teacher.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {teacher.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/admin/teachers/${teacher.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      সম্পাদনা
                    </Button>
                </Link>
                <DeleteTeacherButton teacherId={teacher.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
        {teachers.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            এখনও কোন শিক্ষক নেই। আপনার প্রথম শিক্ষক তৈরি করুন!
          </p>
        )}
      </main>
    </div>
  );
}
