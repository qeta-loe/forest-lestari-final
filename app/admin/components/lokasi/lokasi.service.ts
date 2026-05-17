import { supabase } from "@/lib/supabase"

export type PolygonCoordinate = {
  lat: number
  lng: number
}

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
  }[]
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
  status_lokasi: "aktif" | "tidak_aktif"
  provinsi: string
  kabupaten_kota: string
  alamat: string
  latitude: number
  longitude: number
  luas_area: number
  jumlah_bibit: number
  tanggal_tanam: string
  polygon_coordinates: PolygonCoordinate[]
}): Promise<void> => {
  // validasi polygon minimal 3 titik
  if (data.polygon_coordinates.length < 3) {
    throw new Error("Polygon minimal harus memiliki 3 titik")
  }

  // validasi koordinat
  const hasInvalidCoordinate =
    data.polygon_coordinates.some(
      (point) =>
        isNaN(point.lat) ||
        isNaN(point.lng)
    )

  if (hasInvalidCoordinate) {
    throw new Error(
      "Latitude dan longitude polygon harus berupa angka"
    )
  }

  const { error } = await supabase
    .from("lokasi_penanaman")
    .insert([
      {
        nama_lokasi: data.nama_lokasi,
        status_lokasi: data.status_lokasi,
        provinsi: data.provinsi,
        kabupaten_kota: data.kabupaten_kota,
        alamat: data.alamat || null,
        latitude: data.latitude,
        longitude: data.longitude,
        luas_area: data.luas_area,
        jumlah_bibit: data.jumlah_bibit,
        tanggal_tanam: data.tanggal_tanam,
        polygon_coordinates:
          data.polygon_coordinates,
      },
    ])

  if (error) {
    throw new Error(error.message)
  }
}