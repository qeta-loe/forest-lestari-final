import { supabase } from "@/lib/supabase"

export type Pohon = {
  id: number
  nama_umum: string
  nama_ilmiah: string | null
  jumlah: number
  lokasi_penanaman_id: number | null
  das_id: number | null
  created_at?: string
  updated_at?: string
}

export type PohonWithRelasi = Pohon & {
  lokasi_penanaman?: { nama_lokasi: string } | null
  das?: { nama_das: string } | null
}

export const fetchPohon = async (): Promise<PohonWithRelasi[]> => {
  const { data, error } = await supabase
    .from("pohon")
    .select(`
      *,
      lokasi_penanaman (nama_lokasi),
      das (nama_das)
    `)
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as PohonWithRelasi[]
}

export type PohonInput = {
  nama_umum: string
  nama_ilmiah: string
  jumlah: number
  lokasi_penanaman_id: number | null
  das_id: number | null
}

export const createPohon = async (input: PohonInput): Promise<void> => {
  const { error } = await supabase.from("pohon").insert([input])
  if (error) throw new Error(error.message)
}

export const updatePohon = async (id: number, input: PohonInput): Promise<void> => {
  const { error } = await supabase.from("pohon").update(input).eq("id", id)
  if (error) throw new Error(error.message)
}

export const deletePohon = async (id: number): Promise<void> => {
  const { error } = await supabase.from("pohon").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// Untuk dropdown di form
export const fetchLokasiOptions = async () => {
  const { data, error } = await supabase
    .from("lokasi_penanaman")
    .select("id, nama_lokasi")
    .order("nama_lokasi")

  if (error) throw new Error(error.message)
  return (data || []) as { id: number; nama_lokasi: string }[]
}

export const fetchDasOptions = async () => {
  const { data, error } = await supabase
    .from("das")
    .select("id, nama_das")
    .order("nama_das")

  if (error) throw new Error(error.message)
  return (data || []) as { id: number; nama_das: string }[]
}