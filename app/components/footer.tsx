"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link";

export default function Footer() {

  const [open, setOpen] = useState(false)

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/admin"
      }
    })
  }

  return (
    <footer className="mt-auto bg-[#F7F6EF] border-t border-[#E3E8E1]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-10">
        <div className="flex items-center justify-between text-sm">
          {/* Left - Copyright */}
          <div className="flex items-center gap-2 text-[#48755e]">
            <span>©</span>
            <span>Komunitas Forest Lestari - Bogor</span>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-8 text-[#31513E] font-medium">
            <a href="#hubungi" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
              Hubungi Kami
            </a>
            <a href="#kerjasama" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
              Kerjasama
            </a>
             
             <button
              onClick={() => setOpen(true)}
              className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
              Login Admin
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] text-center shadow-lg">
            <h2 className="text-[#0F5139] font-semibold mb-3">
              Login Admin
            </h2>
            <p className="text-[#0F5139] mb-4">
              Login menggunakan akun Google
            </p>

            <div className="space-y-3">
              <button
                onClick={loginWithGoogle}
                className="w-full border border-[#0F5139] text-[#0F5139] py-2 rounded-md transition-all duration-150 hover:bg-emerald-900 hover:text-white active:bg-emerald-950 active:text-white active:scale-95"
                >
                Login dengan Google
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full border border-[#0F5139] text-[#0F5139] py-2 rounded-md transition-all duration-150 hover:bg-gray-100 active:bg-gray-200 active:scale-95"
                >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}