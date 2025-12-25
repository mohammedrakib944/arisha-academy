import { EditCoursePage } from "@/features/admin/courses";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditCoursePage id={id} />;
}

