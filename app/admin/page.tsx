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
  | "upload"
  | "list"
  | "dokumen"
  | "dokumenList"
  | "artikel"
  | "artikelList"
  | "database"
  | "lokasiPenanaman"
  | "daftarLokasiPenanaman"
  | "das"
  | "daftarDas"
  | "pohon"
  | "daftarPohon"
  | "profil"
  | "organisasi"
  | "tonggak"
  | "tonggakList"
  | "mitra"
  | "mitraList"
  | "laporan"
  | "laporanList"
  | "relawan"
  | "relawanList"
  | "program"
  | "programList"

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

  const [dasList, setDasList] = useState<Das[]>([])
  const [pohonList, setPohonList] = useState<PohonWithRelasi[]>([])

  const [editingDas, setEditingDas] = useState<Das | null>(null)
  const [editingPohon, setEditingPohon] = useState<PohonWithRelasi | null>(null)

  const [tonggakList, setTonggakList] = useState<TonggakPencapaian[]>([])
  const [mitraList, setMitraList] = useState<Mitra[]>([])
  const [laporanList, setLaporanList] = useState<LaporanTahunan[]>([])
  const [relawanList, setRelawanList] = useState<Relawan[]>([])
  const [programList, setProgramList] = useState<Program[]>([])

  const [editingTonggak, setEditingTonggak] =
    useState<TonggakPencapaian | null>(null)
  const [editingMitra, setEditingMitra] = useState<Mitra | null>(null)
  const [editingLaporan, setEditingLaporan] =
    useState<LaporanTahunan | null>(null)
  const [editingRelawan, setEditingRelawan] = useState<Relawan | null>(null)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)

  const loadKegiatan = async () => {
    try {
      const data = await fetchKegiatan()
      setKegiatan(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat kegiatan"
      alert(message)
    }
  }

  const loadDokumen = async () => {
    try {
      const data = await fetchDokumen()
      setDokumen(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat dokumen"
      alert(message)
    }
  }

  const loadArtikel = async () => {
    try {
      const data = await fetchArtikel()
      setArtikel(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat artikel"
      alert(message)
    }
  }

  const loadLokasi = async () => {
    try {
      const data = await fetchLokasiPenanaman()
      setLokasiPenanaman(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat lokasi penanaman"
      alert(message)
    }
  }

  const loadDas = async () => {
    try {
      const data = await fetchDas()
      setDasList(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat DAS"
      alert(message)
    }
  }

  const loadPohon = async () => {
    try {
      const data = await fetchPohon()
      setPohonList(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat pohon"
      alert(message)
    }
  }

  const loadTonggak = async () => {
    try {
      const data = await fetchTonggak()
      setTonggakList(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat tonggak pencapaian"
      alert(message)
    }
  }

  const loadMitra = async () => {
    try {
      const data = await fetchMitra()
      setMitraList(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat mitra"
      alert(message)
    }
  }

  const loadLaporan = async () => {
    try {
      const data = await fetchLaporan()
      setLaporanList(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat laporan"
      alert(message)
    }
  }

  const loadRelawan = async () => {
    try {
      const data = await fetchRelawan()
      setRelawanList(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat relawan"
      alert(message)
    }
  }

  const loadProgram = async () => {
    try {
      const data = await fetchProgram()
      setProgramList(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat program"
      alert(message)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      const session = sessionData.session

      if (sessionError || !session) {
        router.push("/")
        return
      }

      const userEmail = session.user.email

if (!userEmail) {
  await supabase.auth.signOut()
  router.push("/?adminError=invalid_email")
  return
}

const { data: isAdmin, error: adminError } = await supabase.rpc(
  "is_admin_email",
  {
    check_email: userEmail,
  }
)

if (adminError || !isAdmin) {
  await supabase.auth.signOut()
  router.push("/?adminError=invalid_email")
  return
}

      setCheckingAuth(false)

      await Promise.all([
        loadKegiatan(),
        loadDokumen(),
        loadArtikel(),
        loadLokasi(),
        loadDas(),
        loadPohon(),
        loadTonggak(),
        loadMitra(),
        loadLaporan(),
        loadRelawan(),
        loadProgram(),
      ])
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
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
        onArtikelFormSuccess={() => {
          loadArtikel()
          setEditingArtikel(null)
        }}
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