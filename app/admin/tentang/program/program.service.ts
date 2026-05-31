import { supabase } from "@/lib/supabase"

export type Program = {
  id: number
  nama_program: string
  tanggal: string
  lokasi: string | null
  penerima_manfaat: string | null
  realisasi: string | null
  status: string
  tahun: number
  is_draft: boolean
  created_at?: string
}

export const fetchProgram = async (): Promise<Program[]> => {
  const { data, error } = await supabase
    .from("program")
    .select("*")
    .order("tanggal", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Program[]
}

export type ProgramInput = {
  nama_program: string
  tanggal: string
  lokasi: string | null
  penerima_manfaat: string | null
  realisasi: string | null
  status: string
  tahun: number
  is_draft: boolean
}

export const createProgram = async (
  input: ProgramInput
): Promise<void> => {
  const { error } = await supabase.from("program").insert([input])
  if (error) throw new Error(error.message)
}

export const updateProgram = async (
  id: number,
  input: ProgramInput
): Promise<void> => {
  const { error } = await supabase.from("program").update(input).eq("id", id)
  if (error) throw new Error(error.message)
}

export const deleteProgram = async (id: number): Promise<void> => {
  const { error } = await supabase.from("program").delete().eq("id", id)
  if (error) throw new Error(error.message)
}