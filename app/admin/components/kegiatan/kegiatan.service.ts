import { supabase } from "@/lib/supabase"

export type TargetKegiatan = {
  nama_target: string
  isi_target: string
}

export type Kegiatan = {
  id: number

  nama_kegiatan: string
  slug?: string

  alamat: string
  kabupaten_kota: string
  provinsi: string

  tanggal_mulai: string
  jam_mulai: string
  jam_selesai: string

  kategori:
    | "Penanaman"
    | "Survei"
    | "Bersih Lingkungan"
    | "Edukasi"

  status_kegiatan: "upcoming" | "completed"

  thumbnail_url: string

  deskripsi_kegiatan?: string | null
  tujuan_kegiatan?: string | null
  link_pendaftaran?: string | null

  targets?: TargetKegiatan[] | null

  hasil_kegiatan?: string | null
  press_release?: string | null

  is_draft: boolean

  created_at?: string
  updated_at?: string
}

export const fetchKegiatan = async (): Promise<Kegiatan[]> => {
  const { data, error } = await supabase
    .from("kegiatan")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []) as Kegiatan[]
}

type KegiatanPayload = Omit<
  Kegiatan,
  "id" | "created_at" | "updated_at" | "thumbnail_url"
>

export const createKegiatan = async (
  payload: KegiatanPayload,
  gambar: File
): Promise<void> => {
  const fileName = `${Date.now()}-${gambar.name.replaceAll(" ", "-")}`

  const { error: uploadError } = await supabase.storage
    .from("kegiatan")
    .upload(fileName, gambar)

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const thumbnailUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kegiatan/${fileName}`

  const slug = payload.nama_kegiatan
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\w-]+/g, "")

  const finalPayload = {
    ...payload,
    slug,
    thumbnail_url: thumbnailUrl,
  }

  const { error } = await supabase
    .from("kegiatan")
    .insert([finalPayload])

  if (error) {
    throw new Error(error.message)
  }
}

export const updateKegiatan = async (
  id: number,
  payload: KegiatanPayload,
  gambar: File | null
): Promise<void> => {
  let thumbnailUrl: string | undefined

  if (gambar) {
    const fileName = `${Date.now()}-${gambar.name.replaceAll(" ", "-")}`

    const { error: uploadError } = await supabase.storage
      .from("kegiatan")
      .upload(fileName, gambar)

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    thumbnailUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kegiatan/${fileName}`
  }

  const slug = payload.nama_kegiatan
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\w-]+/g, "")

  const updatePayload = {
    ...payload,
    slug,
    ...(thumbnailUrl && { thumbnail_url: thumbnailUrl }),
  }

  const { error } = await supabase
    .from("kegiatan")
    .update(updatePayload)
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export const deleteKegiatan = async (
  ids: number[]
): Promise<void> => {
  const { error } = await supabase
    .from("kegiatan")
    .delete()
    .in("id", ids)

  if (error) {
    throw new Error(error.message)
  }
}