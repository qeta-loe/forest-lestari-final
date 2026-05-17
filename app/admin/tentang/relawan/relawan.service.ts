import { supabase } from "@/lib/supabase"

export type Relawan = {
  id: number
  nama: string
  status: string
  divisi: string | null
  nomor_kontak: string | null
  tahun_bergabung: number
  created_at?: string
}

export const fetchRelawan = async (): Promise<Relawan[]> => {
  const { data, error } = await supabase
    .from("relawan")
    .select("*")
    .order("tahun_bergabung", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Relawan[]
}

export const createRelawan = async (
  input: Omit<Relawan, "id" | "created_at">
): Promise<void> => {
  const { error } = await supabase.from("relawan").insert([input])
  if (error) throw new Error(error.message)
}

export const updateRelawan = async (
  id: number,
  input: Omit<Relawan, "id" | "created_at">
): Promise<void> => {
  const { error } = await supabase
    .from("relawan")
    .update(input)
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteRelawan = async (id: number): Promise<void> => {
  const { error } = await supabase.from("relawan").delete().eq("id", id)
  if (error) throw new Error(error.message)
}