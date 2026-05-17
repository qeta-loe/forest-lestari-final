"use client"

import { useEffect, useRef, useState } from "react"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import { supabase } from "@/lib/supabase"

type DatabaseCardItem = {
  title: string
  icon: string
  type: "das" | "pohon"
}

const databaseCards: DatabaseCardItem[] = [
  {
    title: "DAS Lestari",
    icon: "🌊",
    type: "das",
  },
  {
    title: "Pohon Lestari",
    icon: "🌳",
    type: "pohon",
  },
]

type PolygonPoint = {
  lat: number
  lng: number
}

type LokasiPenanaman = {
  id: number
  nama_lokasi: string
  status_lokasi: string | null
  latitude: number
  longitude: number
  luas_area: number | null
  jumlah_bibit: number | null
  tanggal_tanam: string | null
  polygon_coordinates: PolygonPoint[] | string | null
  created_at: string | null
  kabupaten_kota: string | null
  provinsi: string | null
  alamat: string | null
}

function DatabaseCard({
  title,
  icon,
  totalData,
  loading,
}: {
  title: string
  icon: string
  totalData?: number
  loading?: boolean
}) {
  return (
    <article className="group flex min-h-96 flex-col justify-between rounded-3xl bg-gray-400 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-300 text-xl text-emerald-900">
            {icon}
          </div>

          <h2 className="text-2xl font-bold text-emerald-900">{title}</h2>
        </div>

        {typeof totalData === "number" && (
          <div className="mt-8">
            <p className="text-5xl font-bold text-emerald-900">
              {loading ? "..." : totalData}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              Total data tersimpan
            </p>
          </div>
        )}
      </div>

      <button className="flex w-fit items-center gap-2 text-xs font-bold text-white transition hover:underline active:scale-95">
        Eksplorasi Data
        <span className="text-base leading-none">→</span>
      </button>
    </article>
  )
}

function getPolygonPoints(item: LokasiPenanaman): PolygonPoint[] {
  let polygonData = item.polygon_coordinates

  if (typeof polygonData === "string") {
    try {
      polygonData = JSON.parse(polygonData) as PolygonPoint[]
    } catch {
      return []
    }
  }

  if (Array.isArray(polygonData)) {
    return polygonData
      .map((point) => ({
        lat: Number(point.lat),
        lng: Number(point.lng),
      }))
      .filter((point) => !Number.isNaN(point.lat) && !Number.isNaN(point.lng))
  }

  return []
}

function PetaLestari() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadMap = async () => {
      try {
        const { data, error } = await supabase
          .from("lokasi_penanaman")
          .select(
            "id, nama_lokasi, status_lokasi, latitude, longitude, luas_area, jumlah_bibit, tanggal_tanam, polygon_coordinates, created_at, kabupaten_kota, provinsi, alamat"
          )
          .order("id", { ascending: false })

        if (error) {
          setErrorMessage(error.message)
          setLoading(false)
          return
        }

        const lokasi = (data || []) as LokasiPenanaman[]

        const defaultCenter = {
          lat: -6.5971,
          lng: 106.806,
        }

        const firstPolygon = lokasi
          .map((item) => getPolygonPoints(item))
          .find((points) => points.length >= 3)

        const center = firstPolygon?.[0]
          ? firstPolygon[0]
          : lokasi.length > 0
            ? {
                lat: Number(lokasi[0].latitude),
                lng: Number(lokasi[0].longitude),
              }
            : defaultCenter

        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          v: "weekly",
        })

        const { Map, Polygon } = (await importLibrary(
          "maps"
        )) as google.maps.MapsLibrary

        const { LatLngBounds } = (await importLibrary(
          "core"
        )) as google.maps.CoreLibrary

        const { AdvancedMarkerElement } = (await importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary

        if (!mapRef.current || cancelled) return

        const map = new Map(mapRef.current, {
          center,
          zoom: lokasi.length > 0 ? 12 : 10,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
        })

        const bounds = new LatLngBounds()
        let hasBounds = false

        lokasi.forEach((item) => {
          const polygonPoints = getPolygonPoints(item)

          if (polygonPoints.length >= 3) {
            polygonPoints.forEach((point) => {
              bounds.extend(point)
              hasBounds = true
            })

            const polygon = new Polygon({
              paths: polygonPoints,
              strokeColor: "#0F5139",
              strokeOpacity: 0.9,
              strokeWeight: 2,
              fillColor: "#0F5139",
              fillOpacity: 0.25,
            })

            polygon.setMap(map)

            new AdvancedMarkerElement({
              map,
              position: polygonPoints[0],
              title: item.nama_lokasi,
            })

            return
          }

          const markerPosition = {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          }

          if (
            !Number.isNaN(markerPosition.lat) &&
            !Number.isNaN(markerPosition.lng)
          ) {
            bounds.extend(markerPosition)
            hasBounds = true

            new AdvancedMarkerElement({
              map,
              position: markerPosition,
              title: item.nama_lokasi,
            })
          }
        })

        if (hasBounds) {
          map.fitBounds(bounds)
        }

        setLoading(false)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat peta"

        setErrorMessage(message)
        setLoading(false)
      }
    }

    loadMap()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative mt-8 aspect-[16/9] min-h-72 w-full overflow-hidden rounded-3xl bg-gray-400 sm:min-h-96 lg:aspect-[21/9]">
      <div ref={mapRef} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-400 text-sm font-semibold text-white">
          Memuat peta...
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-400 px-6 text-center text-sm font-semibold text-white">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default function DatabasePage() {
  const [totalDas, setTotalDas] = useState(0)
  const [loadingDas, setLoadingDas] = useState(true)

  const [totalPohon, setTotalPohon] = useState(0)
  const [loadingPohon, setLoadingPohon] = useState(true)

  const fetchDasCount = async () => {
    setLoadingDas(true)

    const { count, error } = await supabase
      .from("das")
      .select("id", {
        count: "exact",
        head: true,
      })

    if (error) {
      console.error(error.message)
      setLoadingDas(false)
      return
    }

    setTotalDas(count || 0)
    setLoadingDas(false)
  }

  const fetchPohonCount = async () => {
    setLoadingPohon(true)

    const { count, error } = await supabase
      .from("pohon")
      .select("id", {
        count: "exact",
        head: true,
      })

    if (error) {
      console.error(error.message)
      setLoadingPohon(false)
      return
    }

    setTotalPohon(count || 0)
    setLoadingPohon(false)
  }

  useEffect(() => {
    fetchDasCount()
    fetchPohonCount()
  }, [])

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
        {/* Header */}
        <section className="space-y-3">
          <h1 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            Database Lestari
          </h1>

          <p className="max-w-4xl text-base leading-7 text-emerald-900 sm:text-xl sm:leading-8">
            Akses komprehensif terhadap lingkungan hidup, peta lokasi penanaman,
            dan inventarisasi biodiversitas Nusantara untuk mendukung pengambilan
            keputusan berbasis data.
          </p>
        </section>

        {/* Cards */}
        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
          {databaseCards.map((card) => (
            <DatabaseCard
              key={card.title}
              title={card.title}
              icon={card.icon}
              totalData={card.type === "das" ? totalDas : totalPohon}
              loading={card.type === "das" ? loadingDas : loadingPohon}
            />
          ))}
        </section>

        {/* Peta */}
        <section className="rounded-3xl border border-black bg-stone-50 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
              Peta Lestari
            </h2>

            <button className="flex w-fit items-center gap-2 rounded-2xl border border-teal-950 bg-white px-5 py-3 text-xs text-teal-950 transition hover:bg-emerald-50 active:scale-95">
              <span className="inline-block h-3 w-2.5 rounded-sm border border-emerald-900" />
              Buka Peta
            </button>
          </div>

          <PetaLestari />
        </section>
      </div>
    </main>
  )
}