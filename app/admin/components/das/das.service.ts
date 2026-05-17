import { supabase } from "@/lib/supabase"

export type PolygonCoordinate = {
  lat: number
  lng: number
}

export type Das = {
  id: number
  nama_das: string
  koordinat_hulu: string | null
  koordinat_muara: string | null
  luas_ha: number
  luas_tutupan_ha: number
  tutupan_hutan_persen: number
  panjang_sungai_km: string | null
  jenis_tanah: string | null
  kemiringan_min: number
  kemiringan_max: number
  kondisi: string
  polygon_coordinates: PolygonCoordinate[] | null
  created_at?: string
  updated_at?: string
}

// ─── Helpers ────────────────────────────────────────────────

const TANAH_TIDAK_PEKA = ["latosol", "aluvial"]
const TANAH_PEKA = ["regosol", "andosol", "grumosol", "litosol"]

export const hitungTutupan = (luas_tutupan_ha: number, luas_ha: number): number => {
  if (!luas_ha || luas_ha === 0) return 0
  return parseFloat(((luas_tutupan_ha / luas_ha) * 100).toFixed(2))
}

export const hitungKondisi = (
  tutupan_persen: number,
  kemiringan_max: number,
  jenis_tanah: string
): string => {
  const tanahLower = jenis_tanah.toLowerCase()

  const adaTanahAman = TANAH_TIDAK_PEKA.some((t) => tanahLower.includes(t))
  const didominasiTanahPeka =
    TANAH_PEKA.filter((t) => tanahLower.includes(t)).length >
    TANAH_TIDAK_PEKA.filter((t) => tanahLower.includes(t)).length

  const tanahAman = adaTanahAman && !didominasiTanahPeka

  const tutupanOk = tutupan_persen >= 30
  const kemiringanOk = kemiringan_max < 14

  return tutupanOk && kemiringanOk && tanahAman ? "baik" : "kritis"
}

// ─── CRUD ───────────────────────────────────────────────────

export const fetchDas = async (): Promise<Das[]> => {
  const { data, error } = await supabase
    .from("das")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Das[]
}

export type DasInput = {
  nama_das: string
  koordinat_hulu: string
  koordinat_muara: string
  luas_ha: number
  luas_tutupan_ha: number
  panjang_sungai_km: string
  jenis_tanah: string
  kemiringan_min: number
  kemiringan_max: number
  polygon_coordinates: PolygonCoordinate[]
}

export const createDas = async (input: DasInput): Promise<void> => {
  const tutupan_hutan_persen = hitungTutupan(input.luas_tutupan_ha, input.luas_ha)
  const kondisi = hitungKondisi(tutupan_hutan_persen, input.kemiringan_max, input.jenis_tanah)

  const { error } = await supabase.from("das").insert([
    {
      ...input,
      tutupan_hutan_persen,
      kondisi,
    },
  ])

  if (error) throw new Error(error.message)
}

export const updateDas = async (id: number, input: DasInput): Promise<void> => {
  const tutupan_hutan_persen = hitungTutupan(input.luas_tutupan_ha, input.luas_ha)
  const kondisi = hitungKondisi(tutupan_hutan_persen, input.kemiringan_max, input.jenis_tanah)

  const { error } = await supabase
    .from("das")
    .update({ ...input, tutupan_hutan_persen, kondisi })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteDas = async (id: number): Promise<void> => {
  const { error } = await supabase.from("das").delete().eq("id", id)
  if (error) throw new Error(error.message)
}