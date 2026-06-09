import { supabase } from "@/lib/supabase"

export type KontenHalaman = {
  id: number
  halaman: string
  hero_image_url: string | null
  badge_text: string | null
  judul: string | null
  deskripsi: string | null
  tujuan_strategis: string | null
  tujuan_image_url: string | null
  is_published: boolean
  updated_at: string | null
}

export const fetchKontenHalaman = async (): Promise<KontenHalaman[]> => {
  const { data, error } = await supabase
    .from("konten_halaman")
    .select("*")
    .order("halaman", { ascending: true })

  if (error) throw new Error(error.message)
  return (data || []) as KontenHalaman[]
}

export const fetchKontenByHalaman = async (
  halaman: string
): Promise<KontenHalaman | null> => {
  const { data, error } = await supabase
    .from("konten_halaman")
    .select("*")
    .eq("halaman", halaman)
    .single()

  if (error || !data) return null
  return data as KontenHalaman
}

type KontenInput = {
  halaman: string
  badge_text: string
  judul: string
  deskripsi: string
  tujuan_strategis?: string
  is_published: boolean
}

async function uploadKontenImage(file: File, prefix: string): Promise<string> {
  const fileName = `${prefix}-${Date.now()}-${file.name.replaceAll(" ", "-")}`
  const { error } = await supabase.storage.from("konten").upload(fileName, file)
  if (error) throw new Error(error.message)
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/konten/${fileName}`
}

export const upsertKonten = async (
  existing: KontenHalaman,
  input: KontenInput,
  heroFile: File | null,
  tujuanFile: File | null
): Promise<void> => {
  let hero_image_url = existing.hero_image_url
  let tujuan_image_url = existing.tujuan_image_url

  if (heroFile) {
    hero_image_url = await uploadKontenImage(heroFile, `hero-${input.halaman}`)
  }

  if (tujuanFile && input.halaman === "tentang_kami") {
    tujuan_image_url = await uploadKontenImage(tujuanFile, "tujuan")
  }

  const { error } = await supabase
    .from("konten_halaman")
    .update({
      badge_text: input.badge_text,
      judul: input.judul,
      deskripsi: input.deskripsi,
      tujuan_strategis: input.tujuan_strategis ?? null,
      hero_image_url,
      tujuan_image_url,
      is_published: input.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("halaman", input.halaman)

  if (error) throw new Error(error.message)
}