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

export const uploadLokasiPenanaman = async (
  namaLokasi: string,
  deskripsi: string,
  polygonPoints: { lat: string; lng: string }[]
): Promise<void> => {
  if (polygonPoints.length < 3) throw new Error("Polygon minimal harus memiliki 3 titik")

  const parsedPoints = polygonPoints.map((p) => ({
    lat: Number(p.lat),
    lng: Number(p.lng),
  }))

  const hasInvalid = parsedPoints.some((p) => isNaN(p.lat) || isNaN(p.lng))
  if (hasInvalid) throw new Error("Latitude dan longitude harus berupa angka")

  const { error } = await supabase.from("lokasi_penanaman").insert([
    {
      nama_lokasi: namaLokasi,
      latitude: parsedPoints[0].lat,
      longitude: parsedPoints[0].lng,
      deskripsi: deskripsi || null,
      polygon_coordinates: parsedPoints,
    },
  ])

  if (error) throw new Error(error.message)
}