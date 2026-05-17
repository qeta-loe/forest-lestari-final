import { supabase } from "@/lib/supabase"

export type LaporanTahunan = {
  id: number
  tahun: number
  judul: string
  deskripsi: string | null
  tanggal_publikasi: string
  file_url: string
  created_at?: string
}

export type LaporanStats = {
  pohon_ditanam: number
  relawan_aktif: number
  program_berjalan: number
}

export const fetchLaporan = async (): Promise<LaporanTahunan[]> => {
  const { data, error } = await supabase
    .from("laporan_tahunan")
    .select("*")
    .order("tahun", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as LaporanTahunan[]
}

export const fetchStatsByTahun = async (tahun: number): Promise<LaporanStats> => {
  // pohon ditanam: SUM jumlah pohon yang created_at di tahun tersebut
  const { data: pohonData } = await supabase
    .from("pohon")
    .select("jumlah, created_at")

  const pohon_ditanam = (pohonData || [])
    .filter((p) => new Date(p.created_at).getFullYear() === tahun)
    .reduce((sum, p) => sum + (p.jumlah || 0), 0)

  // relawan aktif: tahun_bergabung <= tahun AND status = aktif
  const { count: relawan_aktif } = await supabase
    .from("relawan")
    .select("*", { count: "exact", head: true })
    .lte("tahun_bergabung", tahun)
    .eq("status", "aktif")

  // program berjalan di tahun tersebut
  const { count: program_berjalan } = await supabase
    .from("program")
    .select("*", { count: "exact", head: true })
    .eq("tahun", tahun)
    .eq("status", "berjalan")

  return {
    pohon_ditanam,
    relawan_aktif: relawan_aktif || 0,
    program_berjalan: program_berjalan || 0,
  }
}

export const createLaporan = async (
  input: Omit<LaporanTahunan, "id" | "file_url" | "created_at">,
  file: File
): Promise<void> => {
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`

  const { error: uploadError } = await supabase.storage
    .from("laporan")
    .upload(fileName, file)

  if (uploadError) throw new Error(uploadError.message)

  const file_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laporan/${fileName}`

  const { error } = await supabase
    .from("laporan_tahunan")
    .insert([{ ...input, file_url }])

  if (error) throw new Error(error.message)
}

export const updateLaporan = async (
  id: number,
  input: Omit<LaporanTahunan, "id" | "file_url" | "created_at">,
  file: File | null,
  currentFileUrl: string
): Promise<void> => {
  let file_url = currentFileUrl

  if (file) {
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("laporan")
      .upload(fileName, file)

    if (uploadError) throw new Error(uploadError.message)
    file_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laporan/${fileName}`
  }

  const { error } = await supabase
    .from("laporan_tahunan")
    .update({ ...input, file_url })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteLaporan = async (
  id: number,
  file_url: string
): Promise<void> => {
  const path = file_url.split("/laporan/")[1]
  if (path) await supabase.storage.from("laporan").remove([path])

  const { error } = await supabase
    .from("laporan_tahunan")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}