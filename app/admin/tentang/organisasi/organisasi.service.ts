import { supabase } from "@/lib/supabase"

export type OrganisasiSection = {
  id: number
  nama_section: string
  urutan: number
  created_at?: string
}

export type AnggotaOrganisasi = {
  id: number
  section_id: number
  nama: string
  jabatan: string
  urutan: number
  foto_url: string | null
  linkedin_url: string | null
  created_at?: string
}

export type SectionWithAnggota = OrganisasiSection & {
  anggota: AnggotaOrganisasi[]
}

export const fetchOrganisasi = async (): Promise<SectionWithAnggota[]> => {
  const { data: sections, error: sErr } = await supabase
    .from("organisasi_section")
    .select("*")
    .order("urutan", { ascending: true })

  if (sErr) throw new Error(sErr.message)

  const { data: anggota, error: aErr } = await supabase
    .from("anggota_organisasi")
    .select("*")
    .order("urutan", { ascending: true })

  if (aErr) throw new Error(aErr.message)

  return (sections || []).map((s) => ({
    ...s,
    anggota: (anggota || []).filter((a) => a.section_id === s.id),
  }))
}

export const createSection = async (
  nama_section: string,
  urutan: number
): Promise<void> => {
  // geser section lain ke bawah
  const { data: existing } = await supabase
    .from("organisasi_section")
    .select("id, urutan")
    .gte("urutan", urutan)

  if (existing && existing.length > 0) {
    for (const s of existing) {
      await supabase
        .from("organisasi_section")
        .update({ urutan: s.urutan + 1 })
        .eq("id", s.id)
    }
  }

  const { error } = await supabase
    .from("organisasi_section")
    .insert([{ nama_section, urutan }])

  if (error) throw new Error(error.message)
}

export const updateSection = async (
  id: number,
  nama_section: string
): Promise<void> => {
  const { error } = await supabase
    .from("organisasi_section")
    .update({ nama_section })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteSection = async (id: number): Promise<void> => {
  // hapus semua anggota di section ini dulu
  const { data: anggota } = await supabase
    .from("anggota_organisasi")
    .select("foto_url")
    .eq("section_id", id)

  const fotoPaths = (anggota || [])
    .map((a) => a.foto_url?.split("/anggota/")[1])
    .filter(Boolean) as string[]

  if (fotoPaths.length > 0) {
    await supabase.storage.from("anggota_organisasi").remove(fotoPaths)
  }

  await supabase.from("anggota_organisasi").delete().eq("section_id", id)

  const { error } = await supabase
    .from("organisasi_section")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const reorderSections = async (
  sections: { id: number; urutan: number }[]
): Promise<void> => {
  for (const s of sections) {
    await supabase
      .from("organisasi_section")
      .update({ urutan: s.urutan })
      .eq("id", s.id)
  }
}

// ─── Anggota ────────────────────────────────────────────────

export const createAnggota = async (
  section_id: number,
  nama: string,
  jabatan: string,
  urutan: number,
  linkedin_url: string,
  foto: File
): Promise<void> => {
  const fileName = `${Date.now()}-${foto.name.replaceAll(" ", "-")}`
  const { error: uploadError } = await supabase.storage
    .from("anggota_organisasi")
    .upload(fileName, foto)

  if (uploadError) throw new Error(uploadError.message)

  const foto_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anggota/${fileName}`

  const { error } = await supabase.from("anggota_organisasi").insert([{
    section_id, nama, jabatan, urutan, linkedin_url, foto_url,
  }])

  if (error) throw new Error(error.message)
}

export const updateAnggota = async (
  id: number,
  data: {
    nama: string
    jabatan: string
    linkedin_url: string
    section_id: number
  },
  foto: File | null,
  currentFotoUrl: string | null
): Promise<void> => {
  let foto_url = currentFotoUrl

  if (foto) {
    const fileName = `${Date.now()}-${foto.name.replaceAll(" ", "-")}`
    const { error: uploadError } = await supabase.storage
      .from("anggota_organisasi")
      .upload(fileName, foto)

    if (uploadError) throw new Error(uploadError.message)
    foto_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/anggota/${fileName}`
  }

  const { error } = await supabase
    .from("anggota_organisasi")
    .update({ ...data, foto_url })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteAnggota = async (
  id: number,
  foto_url: string | null
): Promise<void> => {
  if (foto_url) {
    const path = foto_url.split("/anggota/")[1]
    if (path) await supabase.storage.from("anggota_organisasi").remove([path])
  }

  const { error } = await supabase
    .from("anggota_organisasi")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const reorderAnggota = async (
  anggota: { id: number; urutan: number }[]
): Promise<void> => {
  for (const a of anggota) {
    await supabase
      .from("anggota_organisasi")
      .update({ urutan: a.urutan })
      .eq("id", a.id)
  }
}