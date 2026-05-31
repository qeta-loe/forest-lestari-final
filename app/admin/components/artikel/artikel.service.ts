import { supabase } from "@/lib/supabase"

export type ArtikelSection = {
  title: string
  content: string
  quote: string
}

export type Artikel = {
  id: number
  judul: string
  deskripsi_singkat: string
  kategori: string
  penulis: string
  tanggal_publikasi: string
  image_url: string
  sections: ArtikelSection[]
  is_draft: boolean
  created_at?: string
  updated_at?: string
}

export const fetchArtikel = async (): Promise<Artikel[]> => {
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Artikel[]
}

type ArtikelPayload = Omit<Artikel, "id" | "created_at" | "updated_at">

export const createArtikel = async (
  payload: Omit<ArtikelPayload, "image_url">,
  gambar: File
): Promise<void> => {
  const fileName = `${Date.now()}-${gambar.name.replaceAll(" ", "-")}`

  const { error: uploadError } = await supabase.storage
    .from("artikel")
    .upload(fileName, gambar)

  if (uploadError) throw new Error(uploadError.message)

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artikel/${fileName}`

  const { error } = await supabase.from("artikel").insert([{ ...payload, image_url: imageUrl }])
  if (error) throw new Error(error.message)
}

export const updateArtikel = async (
  id: number,
  payload: Omit<ArtikelPayload, "image_url">,
  gambar: File | null
): Promise<void> => {
  let imageUrl: string | undefined

  if (gambar) {
    const fileName = `${Date.now()}-${gambar.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("artikel")
      .upload(fileName, gambar)

    if (uploadError) throw new Error(uploadError.message)
    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artikel/${fileName}`
  }

  const { error } = await supabase
    .from("artikel")
    .update({ ...payload, ...(imageUrl && { image_url: imageUrl }) })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteArtikel = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("artikel")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}