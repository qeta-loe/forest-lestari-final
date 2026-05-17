"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import AdminSidebar from "./components/sidebar"
import AdminContent from "./components/adminContent"

import { fetchKegiatan, Kegiatan } from "./components/kegiatan/kegiatan.service"
import { fetchDokumen, Dokumen } from "./components/dokumen/dokumen.service"
import { fetchArtikel, Artikel } from "./components/artikel/artikel.service"
import { fetchLokasiPenanaman, LokasiPenanaman } from "./components/lokasi/lokasi.service"

type MenuKey =
  | "upload" | "list"
  | "dokumen" | "dokumenList"
  | "artikel" | "artikelList"
  | "database"
  | "lokasiPenanaman" | "daftarLokasiPenanaman"
  | "das" | "daftarDas"
  | "pohon" | "daftarPohon"
  | "profil"

export default function AdminPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [menu, setMenu] = useState<MenuKey>("upload")

  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [dokumen, setDokumen] = useState<Dokumen[]>([])
  const [artikel, setArtikel] = useState<Artikel[]>([])
  const [lokasiPenanaman, setLokasiPenanaman] = useState<LokasiPenanaman[]>([])
  const [editingArtikel, setEditingArtikel] = useState<Artikel | null>(null)

  const loadKegiatan = async () => setKegiatan(await fetchKegiatan())
  const loadDokumen = async () => setDokumen(await fetchDokumen())
  const loadArtikel = async () => setArtikel(await fetchArtikel())
  const loadLokasi = async () => setLokasiPenanaman(await fetchLokasiPenanaman())

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.push("/login"); return }
      setCheckingAuth(false)
      await Promise.all([loadKegiatan(), loadDokumen(), loadArtikel(), loadLokasi()])
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6EF] text-[#0F5139]">
        Memeriksa akses admin...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6EF]">
      <AdminSidebar menu={menu} setMenu={setMenu} onLogout={handleLogout} />
      <AdminContent
        menu={menu}
        setMenu={setMenu}
        kegiatan={kegiatan}
        dokumen={dokumen}
        artikel={artikel}
        lokasiPenanaman={lokasiPenanaman}
        editingArtikel={editingArtikel}
        onRefreshKegiatan={loadKegiatan}
        onRefreshDokumen={loadDokumen}
        onRefreshArtikel={loadArtikel}
        onRefreshLokasi={loadLokasi}
        onEditArtikel={setEditingArtikel}
        onArtikelFormSuccess={() => { loadArtikel(); setEditingArtikel(null) }}
      />
    </div>
  )
}