import { redirect } from "next/navigation"
import { LoginForm } from "@/components/admin/LoginForm"
import { getSession } from "@/lib/admin/auth"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session) redirect("/admin")

  return (
    <div className="grid min-h-svh place-items-center px-6">
      <LoginForm />
    </div>
  )
}
