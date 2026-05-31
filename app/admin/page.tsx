"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import AdminSidebar from "./components/sidebar"
import AdminContent from "./components/adminContent"

import { fetchKegiatan, Kegiatan, deleteKegiatan } from "./components/kegiatan/kegiatan.service"
import { fetchArtikel, Artikel } from "./components/artikel/artikel.service"
import { deleteLokasiPenanaman, fetchLokasiPenanaman, LokasiPenanaman } from "./components/lokasi/lokasi.service"
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
  const [adminEmail, setAdminEmail] = useState("")
  const [menu, setMenu] = useState<MenuKey>("upload")

  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [artikel, setArtikel] = useState<Artikel[]>([])
  const [lokasiPenanaman, setLokasiPenanaman] = useState<LokasiPenanaman[]>([])
  const [editingLokasi, setEditingLokasi] = useState<LokasiPenanaman | null>(null)

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

  const [editingTonggak, setEditingTonggak] = useState<TonggakPencapaian | null>(null)
  const [editingMitra, setEditingMitra] = useState<Mitra | null>(null)
  const [editingLaporan, setEditingLaporan] = useState<LaporanTahunan | null>(null)
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

  const handleDeleteKegiatan = async (id: number) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus kegiatan ini?"
    )

    if (!confirmDelete) return

    try {
      await deleteKegiatan(id)

      alert("Kegiatan berhasil dihapus")

      await loadKegiatan()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menghapus kegiatan"

      alert(message)
    }
  }

  const handleDeleteLokasi = async (id: number) => {
    const confirmDelete = confirm(
      "Apakah yakin ingin menghapus lokasi ini?"
    )

    if (!confirmDelete) return

    try {
      await deleteLokasiPenanaman(id)

      alert("Lokasi berhasil dihapus")

      await loadLokasi()
    } catch (err: any) {
      alert(err.message)
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

      setAdminEmail(userEmail)

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
    <div className="min-h-screen bg-[#F7F6EF]">

      <div className="flex items-center justify-between border-b bg-white px-8 py-5">
        <div>
          <h2 className="text-2xl font-bold text-[#0F5139]">
            Admin Dashboard
          </h2>

          <p className="text-sm text-gray-500">
            Forest Lestari Management System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5139] text-sm font-semibold text-white">
            {adminEmail.charAt(0).toUpperCase()}
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-[#0F5139]">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              {adminEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="flex">
        <AdminSidebar
          menu={menu}
          setMenu={setMenu}
          onLogout={handleLogout}

          setEditingKegiatan={setEditingKegiatan}
          setEditingArtikel={setEditingArtikel}
          setEditingLokasi={setEditingLokasi}
          setEditingDas={setEditingDas}
          setEditingPohon={setEditingPohon}
          setEditingTonggak={setEditingTonggak}
          setEditingMitra={setEditingMitra}
          setEditingLaporan={setEditingLaporan}
          setEditingRelawan={setEditingRelawan}
          setEditingProgram={setEditingProgram}
        />
        <AdminContent
          adminEmail={adminEmail}
          menu={menu}
          setMenu={setMenu}
          kegiatan={kegiatan}
          editingKegiatan={editingKegiatan}
          onDeleteKegiatan={handleDeleteKegiatan}
          onCancelEditKegiatan={() => {
            setEditingKegiatan(null)
            setMenu("list")
          }}
          artikel={artikel}
          lokasiPenanaman={lokasiPenanaman}
          editingLokasi={editingLokasi}
          onEditLokasi={setEditingLokasi}
          onCancelEditLokasi={() => setEditingLokasi(null)}
          onDeleteLokasi={handleDeleteLokasi}
          editingArtikel={editingArtikel}
          onRefreshKegiatan={loadKegiatan}
          onRefreshArtikel={loadArtikel}
          onRefreshLokasi={loadLokasi}
          onEditArtikel={setEditingArtikel}
          onCancelEditArtikel={() => {
            setEditingArtikel(null)
            setMenu("artikelList")
          }}
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
    </div>
  )
}