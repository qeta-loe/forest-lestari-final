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
import { fetchDas, Das } from "./components/das/das.service"
import { fetchPohon, PohonWithRelasi } from "./components/pohon/pohon.service"
import { fetchTonggak, TonggakPencapaian } from "./tentang/tonggak/tonggak.service"
import { fetchMitra, Mitra } from "./tentang/mitra/mitra.service"
import { fetchLaporan, LaporanTahunan } from "./tentang/laporan/laporan.service"
import { fetchRelawan, Relawan } from "./tentang/relawan/relawan.service"
import { fetchProgram, Program } from "./tentang/program/program.service"


type MenuKey =
  | "upload" | "list"
  | "dokumen" | "dokumenList"
  | "artikel" | "artikelList"
  | "database"
  | "lokasiPenanaman" | "daftarLokasiPenanaman"
  | "das" | "daftarDas"
  | "pohon" | "daftarPohon"
  | "profil"
  | "organisasi"
  | "tonggak" | "tonggakList"
  | "mitra" | "mitraList"
  | "laporan" | "laporanList"
  | "relawan" | "relawanList"
  | "program" | "programList"

export default function AdminPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [menu, setMenu] = useState<MenuKey>("upload")

  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [dokumen, setDokumen] = useState<Dokumen[]>([])
  const [artikel, setArtikel] = useState<Artikel[]>([])
  const [lokasiPenanaman, setLokasiPenanaman] = useState<LokasiPenanaman[]>([])
  const [editingArtikel, setEditingArtikel] = useState<Artikel | null>(null)
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null)
  const [tonggakList, setTonggakList] = useState<TonggakPencapaian[]>([])
  const [mitraList, setMitraList] = useState<Mitra[]>([])
  const [laporanList, setLaporanList] = useState<LaporanTahunan[]>([])
  const [relawanList, setRelawanList] = useState<Relawan[]>([])
  const [programList, setProgramList] = useState<Program[]>([])
  const [editingTonggak, setEditingTonggak] = useState<TonggakPencapaian | null>(null)
  const [editingMitra, setEditingMitra] = useState<Mitra | null>(null)
  const [editingLaporan, setEditingLaporan] = useState<LaporanTahunan | null>(null)
  const [editingRelawan, setEditingRelawan] = useState<Relawan | null>(null)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)

  const loadKegiatan = async () => {
    try {
      const data = await fetchKegiatan()
      setKegiatan(data)
    } catch (err: any) {
      alert(err.message)
    }
  }
  const loadDokumen = async () => setDokumen(await fetchDokumen())
  const loadArtikel = async () => setArtikel(await fetchArtikel())
  const loadLokasi = async () => setLokasiPenanaman(await fetchLokasiPenanaman())

  const [dasList, setDasList] = useState<Das[]>([])
  const [pohonList, setPohonList] = useState<PohonWithRelasi[]>([])
  const [editingDas, setEditingDas] = useState<Das | null>(null)
  const [editingPohon, setEditingPohon] = useState<PohonWithRelasi | null>(null)
  const loadDas = async () => setDasList(await fetchDas())
  const loadPohon = async () => setPohonList(await fetchPohon())
  const loadTonggak = async () => setTonggakList(await fetchTonggak())
  const loadMitra = async () => setMitraList(await fetchMitra())
  const loadLaporan = async () => setLaporanList(await fetchLaporan())
  const loadRelawan = async () => setRelawanList(await fetchRelawan())
  const loadProgram = async () => setProgramList(await fetchProgram())

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.push("/login"); return }
      setCheckingAuth(false)
      await Promise.all([loadKegiatan(), loadDokumen(), loadArtikel(), loadLokasi(),
        loadDas(), loadPohon(),
        loadTonggak(), loadMitra(), loadLaporan(), loadRelawan(), loadProgram()])
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
        editingKegiatan={editingKegiatan}
        dokumen={dokumen}
        artikel={artikel}
        lokasiPenanaman={lokasiPenanaman}
        editingArtikel={editingArtikel}
        onRefreshKegiatan={loadKegiatan}
        onRefreshDokumen={loadDokumen}
        onRefreshArtikel={loadArtikel}
        onRefreshLokasi={loadLokasi}
        onEditArtikel={setEditingArtikel}
        onEditKegiatan={setEditingKegiatan}
        onArtikelFormSuccess={() => { loadArtikel(); setEditingArtikel(null) }}
        dasList={dasList}
        pohonList={pohonList}
        editingDas={editingDas}
        editingPohon={editingPohon}
        onRefreshDas={loadDas}
        onRefreshPohon={loadPohon}
        onEditDas={setEditingDas}
        onEditPohon={setEditingPohon}
        onCancelEditDas={() => setEditingDas(null)}
        onCancelEditPohon={() => setEditingPohon(null)}
        tonggakList={tonggakList}
        mitraList={mitraList}
        laporanList={laporanList}
        relawanList={relawanList}
        programList={programList}
        editingTonggak={editingTonggak}
        editingMitra={editingMitra}
        editingLaporan={editingLaporan}
        editingRelawan={editingRelawan}
        editingProgram={editingProgram}
        onRefreshTonggak={loadTonggak}
        onRefreshMitra={loadMitra}
        onRefreshLaporan={loadLaporan}
        onRefreshRelawan={loadRelawan}
        onRefreshProgram={loadProgram}
        onEditTonggak={setEditingTonggak}
        onEditMitra={setEditingMitra}
        onEditLaporan={setEditingLaporan}
        onEditRelawan={setEditingRelawan}
        onEditProgram={setEditingProgram}
        onCancelEditTonggak={() => setEditingTonggak(null)}
        onCancelEditMitra={() => setEditingMitra(null)}
        onCancelEditLaporan={() => setEditingLaporan(null)}
        onCancelEditRelawan={() => setEditingRelawan(null)}
        onCancelEditProgram={() => setEditingProgram(null)}
      />
    </div>
  )
}