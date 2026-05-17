import { supabase } from "@/lib/supabase"

export type Highlight = {
  label: string
  nilai: string
}

export type TonggakPencapaian = {
  id: number
  judul: string
  ringkasan: string
  tanggal: string
  kategori: string
  highlights: Highlight[]
  galeri_urls: string[]
  created_at?: string
}

export const fetchTonggak = async (): Promise<TonggakPencapaian[]> => {
  const { data, error } = await supabase
    .from("tonggak_pencapaian")
    .select("*")
    .order("tanggal", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as TonggakPencapaian[]
}

export type TonggakInput = {
  judul: string
  ringkasan: string
  tanggal: string
  kategori: string
  highlights: Highlight[]
}

export const createTonggak = async (
  input: TonggakInput,
  galeriFiles: File[]
): Promise<void> => {
  const galeri_urls: string[] = []

  for (const file of galeriFiles) {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("tonggak")
      .upload(fileName, file)

    if (uploadError) throw new Error(uploadError.message)
    galeri_urls.push(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tonggak/${fileName}`
    )
  }

  const { error } = await supabase
    .from("tonggak_pencapaian")
    .insert([{ ...input, galeri_urls }])

  if (error) throw new Error(error.message)
}

export const updateTonggak = async (
  id: number,
  input: TonggakInput,
  newFiles: File[],
  existingUrls: string[]
): Promise<void> => {
  const newUrls: string[] = []

  for (const file of newFiles) {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("tonggak")
      .upload(fileName, file)

    if (uploadError) throw new Error(uploadError.message)
    newUrls.push(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tonggak/${fileName}`
    )
  }

  const galeri_urls = [...existingUrls, ...newUrls]

  const { error } = await supabase
    .from("tonggak_pencapaian")
    .update({ ...input, galeri_urls })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteTonggak = async (
  id: number,
  galeri_urls: string[]
): Promise<void> => {
  const paths = galeri_urls
    .map((url) => url.split("/tonggak/")[1])
    .filter(Boolean)

  if (paths.length > 0) {
    await supabase.storage.from("tonggak").remove(paths)
  }

  const { error } = await supabase
    .from("tonggak_pencapaian")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}