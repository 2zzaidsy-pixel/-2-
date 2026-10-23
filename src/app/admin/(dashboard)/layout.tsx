import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/AdminShell"
import { getSession } from "@/lib/admin/auth"

export const dynamic = "force-dynamic"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return <AdminShell>{children}</AdminShell>
}
