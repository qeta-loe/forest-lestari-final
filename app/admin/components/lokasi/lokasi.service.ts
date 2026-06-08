import { supabase } from "@/lib/supabase"

export type LokasiPenanaman = {
  id: number
  nama_lokasi: string
  status_lokasi: string
  provinsi: string
  kabupaten_kota: string
  alamat: string | null
  latitude: number
  longitude: number
  luas_area: number
  jumlah_bibit: number
  tanggal_tanam: string
  polygon_coordinates: {
    lat: number
    lng: number
  }[] | null
  deskripsi_lokasi: string | null
  is_draft: boolean
  created_at: string
}

export const fetchLokasiPenanaman = async (): Promise<LokasiPenanaman[]> => {
  const { data, error } = await supabase
    .from("lokasi_penanaman")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as LokasiPenanaman[]
}

export const uploadLokasiPenanaman = async (data: {
  nama_lokasi: string
  provinsi: string
  kabupaten_kota: string
  alamat: string
  latitude: number
  longitude: number
  luas_area: number
  jumlah_bibit: number
  tanggal_tanam: string
  status_lokasi: string
  deskripsi_lokasi: string
  is_draft: boolean
  polygon_coordinates: {
    lat: number
    lng: number
  }[] | null
}): Promise<void> => {
  const { error } = await supabase
    .from("lokasi_penanaman")
    .insert([
      {
        nama_lokasi: data.nama_lokasi,
        provinsi: data.provinsi,
        kabupaten_kota: data.kabupaten_kota,
        alamat: data.alamat || null,
        latitude: data.latitude,
        longitude: data.longitude,
        luas_area: data.luas_area,
        jumlah_bibit: data.jumlah_bibit,
        tanggal_tanam: data.tanggal_tanam,
        status_lokasi: data.status_lokasi,
        deskripsi_lokasi: data.deskripsi_lokasi || null,
        is_draft: data.is_draft,
        polygon_coordinates: data.polygon_coordinates,
      },
    ])

  if (error) {
    throw new Error(error.message)
  }
}

export const updateLokasiPenanaman = async (
  id: number,
  data: {
    nama_lokasi: string
    provinsi: string
    kabupaten_kota: string
    alamat: string
    latitude: number
    longitude: number
    luas_area: number
    jumlah_bibit: number
    tanggal_tanam: string
    status_lokasi: string
    deskripsi_lokasi: string
    is_draft: boolean
    polygon_coordinates: {
      lat: number
      lng: number
    }[] | null
  }
): Promise<void> => {
  const { error } = await supabase
    .from("lokasi_penanaman")
    .update({
      nama_lokasi: data.nama_lokasi,
      provinsi: data.provinsi,
      kabupaten_kota: data.kabupaten_kota,
      alamat: data.alamat,
      latitude: data.latitude,
      longitude: data.longitude,
      luas_area: data.luas_area,
      jumlah_bibit: data.jumlah_bibit,
      status_lokasi: data.status_lokasi,
      tanggal_tanam: data.tanggal_tanam,
      deskripsi_lokasi: data.deskripsi_lokasi || null,
      is_draft: data.is_draft,
      polygon_coordinates: data.polygon_coordinates,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteLokasiPenanaman = async (
  id: number
): Promise<void> => {
  const { error } = await supabase
    .from("lokasi_penanaman")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}