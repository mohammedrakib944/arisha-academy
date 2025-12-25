import { BookDetailPage } from "@/features/books";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookDetailPage id={id} />;
}

