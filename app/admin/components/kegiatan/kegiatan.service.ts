import { supabase } from "@/lib/supabase"

export type Kegiatan = {
  id: number
  nama: string
  deskripsi: string
  image_url: string
}

export const fetchKegiatan = async (): Promise<Kegiatan[]> => {
  const { data, error } = await supabase
    .from("kegiatan")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Kegiatan[]
}

export const uploadKegiatan = async (
  nama: string,
  deskripsi: string,
  file: File
): Promise<void> => {
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`

  const { error: uploadError } = await supabase.storage
    .from("kegiatan")
    .upload(fileName, file)

  if (uploadError) throw new Error(uploadError.message)

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kegiatan/${fileName}`

  const { error } = await supabase.from("kegiatan").insert([{ nama, deskripsi, image_url: imageUrl }])
  if (error) throw new Error(error.message)
}

export const updateKegiatan = async (
  id: number,
  nama: string,
  deskripsi: string,
  currentImageUrl: string,
  file: File | null
): Promise<void> => {
  let imageUrl = currentImageUrl

  if (file) {
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("kegiatan")
      .upload(fileName, file)

    if (uploadError) throw new Error(uploadError.message)

    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kegiatan/${fileName}`
  }

  const { error } = await supabase
    .from("kegiatan")
    .update({ nama, deskripsi, image_url: imageUrl })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteKegiatan = async (
  ids: number[],
  kegiatan: Kegiatan[]
): Promise<void> => {
  const selectedItems = kegiatan.filter((item) => ids.includes(item.id))
  const imagePaths = selectedItems
    .map((item) => item.image_url?.split("/kegiatan/")[1])
    .filter(Boolean) as string[]

  if (imagePaths.length > 0) {
    await supabase.storage.from("kegiatan").remove(imagePaths)
  }

  const { error } = await supabase.from("kegiatan").delete().in("id", ids)
  if (error) throw new Error(error.message)
}