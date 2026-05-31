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
  is_draft: boolean
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
  provinsi: string
  kabupaten_kota: string
  alamat: string
  latitude: number
  longitude: number
  luas_area: number
  jumlah_bibit: number
  tanggal_tanam: string
  is_draft: boolean
  polygon_coordinates: PolygonCoordinate[]
}): Promise<void> => {
  if (data.polygon_coordinates.length < 3) {
    throw new Error("Polygon minimal harus memiliki 3 titik")
  }

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
        provinsi: data.provinsi,
        kabupaten_kota: data.kabupaten_kota,
        alamat: data.alamat || null,
        latitude: data.latitude,
        longitude: data.longitude,
        luas_area: data.luas_area,
        jumlah_bibit: data.jumlah_bibit,
        tanggal_tanam: data.tanggal_tanam,
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
    is_draft: boolean
    polygon_coordinates: PolygonCoordinate[]
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
      tanggal_tanam: data.tanggal_tanam,
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