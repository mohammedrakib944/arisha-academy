import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeacherCardProps {
  id: string;
  href: string;
  image: string | null;
  name: string;
  bio?: string | null;
  subjects: string[];
}

export function TeacherCard({
  id,
  href,
  image,
  name,
  bio,
  subjects,
}: TeacherCardProps) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        {image && (
          <div className="relative w-full h-48">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        )}

        {image && (
          <div className="relative w-24 h-24 -mt-12 ml-4">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover rounded-full border-2 border-primary p-0.5"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {bio && (
            <CardDescription className="line-clamp-3">{bio}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, idx) => (
                <Badge key={idx} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
