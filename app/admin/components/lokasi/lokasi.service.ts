import { supabase } from "@/lib/supabase"

export type PolygonCoordinate = {
  lat: number
  lng: number
}

export type LokasiPenanaman = {
  id: number
  nama_lokasi: string
  latitude: number
  longitude: number
  deskripsi: string | null
  polygon_coordinates: PolygonCoordinate[] | null
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
  slug: string
  deskripsi: string
  provinsi: string
  kabupaten_kota: string
  alamat_lengkap: string
  latitude: number
  longitude: number
  luas_area: number
  jumlah_bibit: number
  tanggal_tanam: string
  gambar_utama: string
  gambar_1: string
  gambar_2: string
  gambar_3: string
  status_lokasi: string
  polygon_coordinates: { lat: number; lng: number }[]
}): Promise<void> => {
  if (data.polygon_coordinates.length < 3) throw new Error("Polygon minimal harus memiliki 3 titik")

  const hasInvalid = data.polygon_coordinates.some((p) => isNaN(p.lat) || isNaN(p.lng))
  if (hasInvalid) throw new Error("Latitude dan longitude harus berupa angka")

  const { error } = await supabase.from("lokasi_penanaman").insert([
    {
      nama_lokasi: data.nama_lokasi,
      slug: data.slug,
      latitude: data.latitude,
      longitude: data.longitude,
      deskripsi: data.deskripsi || null,
      provinsi: data.provinsi,
      kabupaten_kota: data.kabupaten_kota,
      alamat_lengkap: data.alamat_lengkap,
      luas_area: data.luas_area,
      jumlah_bibit: data.jumlah_bibit,
      tanggal_tanam: data.tanggal_tanam,
      gambar_utama: data.gambar_utama,
      gambar_1: data.gambar_1,
      gambar_2: data.gambar_2,
      gambar_3: data.gambar_3,
      status_lokasi: data.status_lokasi,
      polygon_coordinates: data.polygon_coordinates,
    },
  ])

  if (error) throw new Error(error.message)
}