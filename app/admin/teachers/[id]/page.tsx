import { EditTeacherPage } from "@/features/admin/teachers";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditTeacherPage id={id} />;
}

