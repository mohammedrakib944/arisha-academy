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
import { Button } from "@/components/ui/button";

interface ContentCardProps {
  id: string;
  href: string;
  thumbnail: string | null;
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  metadata?: string;
  imageHeight?: "h-48" | "h-64";
  showArrowIcon?: boolean;
}

export function ContentCard({
  id,
  href,
  thumbnail,
  title,
  description,
  price,
  currency = "৳",
  metadata,
  imageHeight = "h-48",
  showArrowIcon = false,
}: ContentCardProps) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group flex flex-col justify-between">
        {thumbnail ? (
          <div className="relative w-full aspect-square">
            <Image src={thumbnail} alt={title} fill className="object-cover" />
          </div>
        ) : (
          <div className="relative w-full aspect-square">
            <Image
              src="/placeholder.png"
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {currency}
              {price} {currency === "৳" ? "tk" : ""}
            </span>
            {metadata && (
              <span className="text-sm text-muted-foreground">{metadata}</span>
            )}
            {showArrowIcon && !metadata && (
              <ArrowUpRight className="group-hover:scale-110 transition-transform" />
            )}
          </div>
          <Button className="w-full mt-4">Enroll Now</Button>
        </CardContent>
      </Card>
    </Link>
  );
}
