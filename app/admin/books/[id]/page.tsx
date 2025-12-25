import { EditBookPage } from "@/features/admin/books";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditBookPage id={id} />;
}

