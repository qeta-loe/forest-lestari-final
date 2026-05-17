import { supabase } from "@/lib/supabase"

export const updateProfilKomunitas = async (
  informasiKomunitas: string,
  visiMisi: string,
  sejarah: string,
  strukturOrganisasi: string
): Promise<void> => {
  const { error } = await supabase.from("profil_komunitas").upsert([
    {
      id: 1,
      informasi_komunitas: informasiKomunitas,
      visi_misi: visiMisi,
      sejarah,
      struktur_organisasi: strukturOrganisasi,
    },
  ])

  if (error) throw new Error(error.message)
}