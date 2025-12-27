import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const user = await getCurrentUser();

  return <NavbarClient user={user} />;
}
