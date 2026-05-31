import { supabase } from "@/lib/supabase"

export type TargetKegiatan = {
  nama_target: string
  isi_target: string
}

export type Kegiatan = {
  id: number
  nama_kegiatan: string
  alamat: string | null
  kabupaten_kota: string | null
  provinsi: string | null
  tanggal_mulai: string | null
  jam_mulai: string | null
  jam_selesai: string | null
  kategori: "Penanaman" | "Survei" | "Bersih Lingkungan" | "Edukasi" | string
  status_kegiatan: "upcoming" | "completed" | string
  deskripsi_kegiatan: string | null
  tujuan_kegiatan: string | null
  link_pendaftaran: string | null
  targets: TargetKegiatan[] | null
  hasil_kegiatan: string | null
  press_release: string | null
  is_draft: boolean | null
  updated_at: string | null
  thumbnail_url: string | null
  draft_status: string | null
  slug: string | null
}

export type KegiatanPayload = {
  nama_kegiatan: string
  alamat: string
  kabupaten_kota: string
  provinsi: string
  tanggal_mulai: string
  jam_mulai: string
  jam_selesai: string
  kategori: string
  status_kegiatan: string
  deskripsi_kegiatan: string
  tujuan_kegiatan: string
  link_pendaftaran: string
  hasil_kegiatan: string
  press_release: string
  targets: TargetKegiatan[]
  is_draft: boolean
}

const BUCKET_NAME = "kegiatan"

export const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const uploadThumbnail = async (file: File) => {
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file)

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

  return data.publicUrl
}

export const fetchKegiatan = async () => {
  const { data, error } = await supabase
    .from("kegiatan")
    .select(
      "id, nama_kegiatan, alamat, kabupaten_kota, provinsi, tanggal_mulai, jam_mulai, jam_selesai, kategori, status_kegiatan, deskripsi_kegiatan, tujuan_kegiatan, link_pendaftaran, targets, hasil_kegiatan, press_release, is_draft, updated_at, thumbnail_url, draft_status, slug"
    )
    .order("updated_at", { ascending: false, nullsFirst: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as Kegiatan[]
}

export const createKegiatan = async (
  payload: KegiatanPayload,
  thumbnail: File
) => {
  const thumbnailUrl = await uploadThumbnail(thumbnail)

  const { error } = await supabase.from("kegiatan").insert([
    {
      nama_kegiatan: payload.nama_kegiatan,
      alamat: payload.alamat,
      kabupaten_kota: payload.kabupaten_kota,
      provinsi: payload.provinsi,
      tanggal_mulai: payload.tanggal_mulai,
      jam_mulai: payload.jam_mulai,
      jam_selesai: payload.jam_selesai,
      kategori: payload.kategori,
      status_kegiatan: payload.status_kegiatan,
      deskripsi_kegiatan: payload.deskripsi_kegiatan,
      tujuan_kegiatan: payload.tujuan_kegiatan,
      link_pendaftaran: payload.link_pendaftaran,
      targets: payload.targets,
      hasil_kegiatan: payload.hasil_kegiatan,
      press_release: payload.press_release,
      is_draft: payload.is_draft,
      draft_status: payload.is_draft ? "draft" : "published",
      thumbnail_url: thumbnailUrl,
      slug: createSlug(payload.nama_kegiatan),
      updated_at: new Date().toISOString(),
    },
  ])

  if (error) {
    throw new Error(error.message)
  }
}

export const updateKegiatan = async (
  id: number,
  payload: KegiatanPayload,
  thumbnail?: File | null
) => {
  let thumbnailUrl: string | undefined

  if (thumbnail) {
    thumbnailUrl = await uploadThumbnail(thumbnail)
  }

  const updateData: Record<string, unknown> = {
    nama_kegiatan: payload.nama_kegiatan,
    alamat: payload.alamat,
    kabupaten_kota: payload.kabupaten_kota,
    provinsi: payload.provinsi,
    tanggal_mulai: payload.tanggal_mulai,
    jam_mulai: payload.jam_mulai,
    jam_selesai: payload.jam_selesai,
    kategori: payload.kategori,
    status_kegiatan: payload.status_kegiatan,
    deskripsi_kegiatan: payload.deskripsi_kegiatan,
    tujuan_kegiatan: payload.tujuan_kegiatan,
    link_pendaftaran: payload.link_pendaftaran,
    targets: payload.targets,
    hasil_kegiatan: payload.hasil_kegiatan,
    press_release: payload.press_release,
    is_draft: payload.is_draft,
    draft_status: payload.is_draft ? "draft" : "published",
    slug: createSlug(payload.nama_kegiatan),
    updated_at: new Date().toISOString(),
  }

  if (thumbnailUrl) {
    updateData.thumbnail_url = thumbnailUrl
  }

  const { error } = await supabase
    .from("kegiatan")
    .update(updateData)
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export const deleteKegiatan = async (id: number) => {
  const { data: kegiatan, error: fetchError } = await supabase
    .from("kegiatan")
    .select("thumbnail_url")
    .eq("id", id)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const { error } = await supabase
    .from("kegiatan")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  if (kegiatan?.thumbnail_url) {
    const fileName = kegiatan.thumbnail_url.split("/").pop()

    if (fileName) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])
    }
  }
}