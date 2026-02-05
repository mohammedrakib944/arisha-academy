import { LoginPage } from "@/features/auth";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  console.log("[Auth Debug] LoginPage loaded. User:", user ? "Found" : "Not Found");

  if (user) {
    console.log("[Auth Debug] LoginPage redirecting to profile");
    redirect("/profile");
  }
  return <LoginPage />;
}
