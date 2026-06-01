import { supabase } from "@/lib/supabase"

export type OrganisasiSection = {
  id: number
  nama_section: string
  urutan: number
}

export type AnggotaOrganisasi = {
  id: number
  section_id: number
  nama: string
  jabatan: string
  urutan: number
  foto_url: string | null
  linkedin_url: string | null
}

export type SectionWithAnggota = OrganisasiSection & {
  anggota: AnggotaOrganisasi[]
}

export type TonggakPencapaian = {
  id: number
  judul: string
  ringkasan: string
  tanggal: string
  kategori: string
  highlights: { label: string; nilai: string }[]
  galeri_urls: string[]
}

export type Mitra = {
  id: number
  nama: string
  logo_url: string | null
}

export type LaporanTahunan = {
  id: number
  tahun: number
  judul: string
  deskripsi: string | null
  tanggal_publikasi: string | null
  file_url: string | null
}

export type GlobalStats = {
  pohon_ditanam: number
  total_relawan: number
  area_ha: number
  das_aktif: number
}

export async function getOrganisasi(): Promise<SectionWithAnggota[]> {
  const { data: sections, error: sErr } = await supabase
    .from("organisasi_section")
    .select("*")
    .order("urutan", { ascending: true })

  if (sErr || !sections) return []

  const { data: anggota, error: aErr } = await supabase
    .from("anggota_organisasi")
    .select("*")
    .order("urutan", { ascending: true })

  if (aErr) return []

  return sections.map((s) => ({
    ...s,
    anggota: (anggota || []).filter((a) => a.section_id === s.id),
  }))
}

export async function getTonggak(
  kategori?: string
): Promise<TonggakPencapaian[]> {
  let query = supabase
    .from("tonggak_pencapaian")
    .select("*")
    .order("tanggal", { ascending: false })

  if (kategori) {
    query = query.eq("kategori", kategori)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as TonggakPencapaian[]
}

export async function getMitra(): Promise<Mitra[]> {
  const { data, error } = await supabase
    .from("mitra")
    .select("id, nama, logo_url")
    .order("created_at", { ascending: true })

  if (error || !data) return []
  return data as Mitra[]
}

export async function getLaporanTahunan(): Promise<LaporanTahunan[]> {
  const { data, error } = await supabase
    .from("laporan_tahunan")
    .select("id, tahun, judul, deskripsi, tanggal_publikasi, file_url")
    .order("tahun", { ascending: false })

  if (error || !data) return []
  return data as LaporanTahunan[]
}

export async function getLaporanByTahun(
  tahun: number
): Promise<LaporanTahunan | null> {
  const { data, error } = await supabase
    .from("laporan_tahunan")
    .select("id, tahun, judul, deskripsi, tanggal_publikasi, file_url")
    .eq("tahun", tahun)
    .single()

  if (error || !data) return null
  return data as LaporanTahunan
}

export async function getGlobalStats(): Promise<GlobalStats> {
  const [pohonRes, relawanRes, lokasiRes, dasRes] = await Promise.all([
  supabase.from("pohon").select("jumlah"),
  supabase.from("relawan").select("jumlah_relawan"),
  supabase.from("lokasi_penanaman").select("luas_area"),
  supabase.from("das").select("id", { count: "exact", head: true }),
])

  const pohon_ditanam = (pohonRes.data || []).reduce(
    (sum, p) => sum + (p.jumlah || 0),
    0
  )

  const total_relawan = (relawanRes.data || []).reduce(
    (sum, r) => sum + (r.jumlah_relawan || 0),
    0
  )

  const area_ha = (lokasiRes.data || []).reduce(
    (sum, l) => sum + (l.luas_area || 0),
    0
  )

  const das_aktif = dasRes.count || 0

  return { pohon_ditanam, total_relawan, area_ha, das_aktif }
}

export async function getStatsByTahun(tahun: number) {
  const [pohonRes, relawanRes, programRes] = await Promise.all([
    supabase.from("pohon").select("jumlah, created_at"),
    supabase
      .from("relawan")
      .select("jumlah_relawan")
      .lte("tahun_bergabung", tahun)
      .eq("status", "aktif"),
    supabase
      .from("program")
      .select("id", { count: "exact", head: true })
      .eq("tahun", tahun)
      .eq("status", "berjalan"),
  ])

  const pohon_ditanam = (pohonRes.data || [])
    .filter((p) => new Date(p.created_at).getFullYear() === tahun)
    .reduce((sum, p) => sum + (p.jumlah || 0), 0)

  return {
    pohon_ditanam,
    relawan_aktif: relawanRes.count || 0,
    program_berjalan: programRes.count || 0,
  }
}