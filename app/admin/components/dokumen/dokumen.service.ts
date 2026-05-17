import { supabase } from "@/lib/supabase"

export type Dokumen = {
  id: number
  judul: string
  file_url: string
}

export const fetchDokumen = async (): Promise<Dokumen[]> => {
  const { data, error } = await supabase
    .from("dokumen")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Dokumen[]
}

export const uploadDokumen = async (judul: string, file: File): Promise<void> => {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Ekstensi file harus .pdf")
  }

  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`

  const { error: uploadError } = await supabase.storage
    .from("dokumen")
    .upload(fileName, file)

  if (uploadError) throw new Error(uploadError.message)

  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dokumen/${fileName}`

  const { error } = await supabase.from("dokumen").insert([{ judul, file_url: fileUrl }])
  if (error) throw new Error(error.message)
}