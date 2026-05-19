"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import { supabase } from "@/lib/supabase"

const stats = [
  {
    value: "6",
    label: "Lokasi aktif",
  },
  {
    value: "1.840",
    label: "Total bibit ditanam",
  },
  {
    value: "47,2",
    label: "Total luas (ha)",
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
  latitude: number | null
  longitude: number | null
  luas_area: number | null
  jumlah_bibit: number | null
  tanggal_tanam: string | null
  polygon_coordinates: PolygonPoint[] | string | null
  created_at: string | null
  kabupaten_kota: string | null
  provinsi: string | null
  alamat: string | null
}

function TabButton({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-950 px-5 py-2 text-sm transition active:scale-95 sm:text-base ${
        active
          ? "bg-emerald-900 text-stone-50 hover:bg-emerald-950"
          : "bg-stone-50 text-emerald-900 hover:bg-emerald-50"
      }`}
    >
      {children}
    </Link>
  )
}

function isValidLatLng(lat: number, lng: number) {
  return (
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
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

  if (!Array.isArray(polygonData)) return []

  return polygonData
    .map((point) => {
      const lat = Number(point.lat)
      const lng = Number(point.lng)

      return { lat, lng }
    })
    .filter((point) => isValidLatLng(point.lat, point.lng))
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function popupContent(item: LokasiPenanaman) {
  return `
    <div style="
      min-width: 240px;
      max-width: 280px;
      font-family: Inter, Arial, sans-serif;
      color: #0F5139;
    ">
      <strong style="
        display: block;
        margin-bottom: 8px;
        font-size: 16px;
        line-height: 1.3;
      ">
        ${escapeHtml(item.nama_lokasi || "Lokasi Penanaman")}
      </strong>

      <div style="
        display: grid;
        gap: 5px;
        font-size: 13px;
        line-height: 1.5;
      ">
        <div>
          <strong>Status:</strong> ${escapeHtml(item.status_lokasi || "-")}
        </div>

        <div>
          <strong>Alamat:</strong> ${escapeHtml(item.alamat || "-")}
        </div>

        <div>
          <strong>Wilayah:</strong> ${escapeHtml(item.kabupaten_kota || "-")}, ${escapeHtml(item.provinsi || "-")}
        </div>

        <div>
          <strong>Jumlah bibit:</strong> ${escapeHtml(item.jumlah_bibit ?? 0)}
        </div>

        <div>
          <strong>Luas area:</strong> ${escapeHtml(item.luas_area ?? 0)} ha
        </div>
      </div>
    </div>
  `
}

function createMarkerContent() {
  const wrapper = document.createElement("div")

  wrapper.innerHTML = `
    <div style="
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      background: #0F5139;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "></div>
  `

  return wrapper
}

function PetaLestari() {
  const mapRef = useRef<HTMLDivElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadMap = async () => {
      try {
        setLoading(true)
        setErrorMessage("")

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

        const firstValidMarker = lokasi.find((item) => {
          const lat = Number(item.latitude)
          const lng = Number(item.longitude)

          return isValidLatLng(lat, lng)
        })

        const center = firstPolygon?.[0]
          ? firstPolygon[0]
          : firstValidMarker
            ? {
                lat: Number(firstValidMarker.latitude),
                lng: Number(firstValidMarker.longitude),
              }
            : defaultCenter

        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          v: "weekly",
        })

        const { Map, Polygon, InfoWindow } = (await importLibrary(
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
        const infoWindow = new InfoWindow({
          maxWidth: 320,
        })

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
              clickable: true,
            })

            polygon.setMap(map)

            polygon.addListener("click", (event: google.maps.MapMouseEvent) => {
              infoWindow.close()
              infoWindow.setContent(popupContent(item))
              infoWindow.setPosition(event.latLng || polygonPoints[0])
              infoWindow.open({
                map,
              })
            })

            const marker = new AdvancedMarkerElement({
              map,
              position: polygonPoints[0],
              title: item.nama_lokasi,
              content: createMarkerContent(),
            })

            marker.addListener("click", () => {
              infoWindow.close()
              infoWindow.setContent(popupContent(item))
              infoWindow.setPosition(polygonPoints[0])
              infoWindow.open({
                map,
              })
            })

            return
          }

          const markerPosition = {
            lat: Number(item.latitude),
            lng: Number(item.longitude),
          }

          if (isValidLatLng(markerPosition.lat, markerPosition.lng)) {
            bounds.extend(markerPosition)
            hasBounds = true

            const marker = new AdvancedMarkerElement({
              map,
              position: markerPosition,
              title: item.nama_lokasi,
              content: createMarkerContent(),
            })

            marker.addListener("click", () => {
              infoWindow.close()
              infoWindow.setContent(popupContent(item))
              infoWindow.setPosition(markerPosition)
              infoWindow.open({
                map,
              })
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
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-gray-400 sm:h-[560px] lg:h-[720px]">
      <div ref={mapRef} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-gray-400 text-sm font-semibold text-white">
          Memuat peta...
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-gray-400 px-6 text-center text-sm font-semibold text-white">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default function DatabasePetaPage() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <style jsx global>{`
        .gm-style .gm-style-iw-c {
          border-radius: 18px !important;
          padding: 12px !important;
        }

        .gm-style .gm-style-iw-d {
          overflow: hidden !important;
        }

        .gm-ui-hover-effect {
          top: 4px !important;
          right: 4px !important;
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {/* Tabs */}
        <section className="flex flex-wrap gap-3 border-b border-black/10 pb-8">
          <TabButton href="/database/peta" active>
            Peta Lestari
          </TabButton>

          <TabButton href="/database/pohon">Pohon Lestari</TabButton>

          <TabButton href="/database/DAS">DAS Lestari</TabButton>
        </section>

        {/* Stats */}
        <section className="grid gap-4 border-b border-black/10 pb-8 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="p-6 text-center">
              <p className="text-3xl font-bold text-emerald-900 sm:text-4xl">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-emerald-900">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        {/* Peta Lestari */}
        <section className="rounded-3xl border border-black bg-stone-50 p-5 sm:p-8 lg:p-10">
          <PetaLestari />
        </section>
      </div>
    </main>
  )
}