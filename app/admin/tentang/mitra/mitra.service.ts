import { supabase } from "@/lib/supabase"

export type Mitra = {
  id: number
  nama: string
  logo_url: string | null
  created_at?: string
}

export const fetchMitra = async (): Promise<Mitra[]> => {
  const { data, error } = await supabase
    .from("mitra")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Mitra[]
}

export const createMitra = async (
  nama: string,
  logo: File
): Promise<void> => {
  const fileName = `${Date.now()}-${logo.name.replaceAll(" ", "-")}`

  const { error: uploadError } = await supabase.storage
    .from("mitra")
    .upload(fileName, logo)

  if (uploadError) throw new Error(uploadError.message)

  const logo_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mitra/${fileName}`

  const { error } = await supabase.from("mitra").insert([{ nama, logo_url }])
  if (error) throw new Error(error.message)
}

export const updateMitra = async (
  id: number,
  nama: string,
  logo: File | null,
  currentLogoUrl: string | null
): Promise<void> => {
  let logo_url = currentLogoUrl

  if (logo) {
    const fileName = `${Date.now()}-${logo.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("mitra")
      .upload(fileName, logo)

    if (uploadError) throw new Error(uploadError.message)
    logo_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mitra/${fileName}`
  }

  const { error } = await supabase
    .from("mitra")
    .update({ nama, logo_url })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteMitra = async (
  id: number,
  logo_url: string | null
): Promise<void> => {
  if (logo_url) {
    const path = logo_url.split("/mitra/")[1]
    if (path) await supabase.storage.from("mitra").remove([path])
  }

  const { error } = await supabase.from("mitra").delete().eq("id", id)
  if (error) throw new Error(error.message)
}