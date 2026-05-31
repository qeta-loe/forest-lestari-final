"use client"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import Footer from "./footer"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isAdminPage = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Navbar />}

      {children}

      {!isAdminPage && <Footer />}
    </>
  )
}