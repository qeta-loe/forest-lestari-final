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
  lokasi_penanaman?: {
    nama_lokasi: string
  } | null
  das?: {
    nama_das: string
  } | null
}

export type PohonInput = {
  nama_umum: string
  nama_ilmiah: string
  jumlah: number
  lokasi_penanaman_id: number | null
  das_id: number | null
}

type LokasiOption = {
  id: number
  nama_lokasi: string
}

type DasOption = {
  id: number
  nama_das: string
}

export const fetchPohon = async (): Promise<PohonWithRelasi[]> => {
  const { data: pohonData, error: pohonError } = await supabase
    .from("pohon")
    .select(
      "id, nama_umum, nama_ilmiah, jumlah, lokasi_penanaman_id, das_id, created_at, updated_at"
    )
    .order("id", { ascending: false })

  if (pohonError) {
    throw new Error(pohonError.message)
  }

  const { data: lokasiData, error: lokasiError } = await supabase
    .from("lokasi_penanaman")
    .select("id, nama_lokasi")

  if (lokasiError) {
    throw new Error(lokasiError.message)
  }

  const { data: dasData, error: dasError } = await supabase
    .from("das")
    .select("id, nama_das")

  if (dasError) {
    throw new Error(dasError.message)
  }

  const lokasiMap = new Map<number, LokasiOption>()

  ;((lokasiData || []) as LokasiOption[]).forEach((lokasi) => {
    lokasiMap.set(lokasi.id, lokasi)
  })

  const dasMap = new Map<number, DasOption>()

  ;((dasData || []) as DasOption[]).forEach((das) => {
    dasMap.set(das.id, das)
  })

  const result = ((pohonData || []) as Pohon[]).map((pohon) => {
    const lokasi = pohon.lokasi_penanaman_id
      ? lokasiMap.get(pohon.lokasi_penanaman_id)
      : null

    const das = pohon.das_id ? dasMap.get(pohon.das_id) : null

    return {
      ...pohon,
      lokasi_penanaman: lokasi
        ? {
            nama_lokasi: lokasi.nama_lokasi,
          }
        : null,
      das: das
        ? {
            nama_das: das.nama_das,
          }
        : null,
    }
  })

  return result
}

export const createPohon = async (input: PohonInput): Promise<void> => {
  const { error } = await supabase.from("pohon").insert([
    {
      nama_umum: input.nama_umum,
      nama_ilmiah: input.nama_ilmiah || null,
      jumlah: input.jumlah,
      lokasi_penanaman_id: input.lokasi_penanaman_id,
      das_id: input.das_id,
      updated_at: new Date().toISOString(),
    },
  ])

  if (error) {
    throw new Error(error.message)
  }
}

export const updatePohon = async (
  id: number,
  input: PohonInput
): Promise<void> => {
  const { error } = await supabase
    .from("pohon")
    .update({
      nama_umum: input.nama_umum,
      nama_ilmiah: input.nama_ilmiah || null,
      jumlah: input.jumlah,
      lokasi_penanaman_id: input.lokasi_penanaman_id,
      das_id: input.das_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export const deletePohon = async (id: number): Promise<void> => {
  const { error } = await supabase.from("pohon").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export const fetchLokasiOptions = async () => {
  const { data, error } = await supabase
    .from("lokasi_penanaman")
    .select("id, nama_lokasi")
    .order("nama_lokasi", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as LokasiOption[]
}

export const fetchDasOptions = async () => {
  const { data, error } = await supabase
    .from("das")
    .select("id, nama_das")
    .order("nama_das", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as DasOption[]
}