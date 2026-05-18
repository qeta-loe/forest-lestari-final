"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")

      if (!code) {
        router.replace("/?adminError=auth_failed")
        return
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error || !data.session) {
        console.error("OAuth exchange error:", error?.message)
        router.replace("/?adminError=auth_failed")
        return
      }

      const userEmail = data.session.user.email

      if (!userEmail) {
        await supabase.auth.signOut()
        router.replace("/?adminError=invalid_email")
        return
      }

      const { data: isAdmin, error: adminError } = await supabase.rpc(
        "is_admin_email",
        {
          check_email: userEmail,
        }
      )

      if (adminError) {
        console.error("Admin check error:", adminError.message)
      }

      if (adminError || !isAdmin) {
        await supabase.auth.signOut()
        router.replace("/?adminError=invalid_email")
        return
      }

      router.replace("/admin")
    }

    checkAdminAccess()
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6EF] px-4 text-[#0F5139]">
      Memeriksa akses admin...
    </main>
  )
}