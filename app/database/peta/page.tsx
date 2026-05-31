"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import { supabase } from "@/lib/supabase"

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

type DatabaseStats = {
  lokasi_aktif: number
  total_bibit: number
  total_luas: number
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

function formatNumber(value: number): string {
  return value % 1 === 0
    ? value.toLocaleString("id-ID")
    : value.toLocaleString("id-ID", { maximumFractionDigits: 1 })
}

function formatDate(value: string | null) {
  if (!value) return "-"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "-"

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatCoordinate(item: LokasiPenanaman) {
  const lat = Number(item.latitude)
  const lng = Number(item.longitude)

  if (!isValidLatLng(lat, lng)) return "-"

  const latDirection = lat < 0 ? "S" : "N"
  const lngDirection = lng < 0 ? "W" : "E"

  return `${Math.abs(lat).toFixed(4)}°${latDirection}, ${Math.abs(
    lng
  ).toFixed(4)}°${lngDirection}`
}

function popupContent(item: LokasiPenanaman) {
  const status = item.status_lokasi || "Terdokumentasi"
  const wilayah = [item.kabupaten_kota, item.provinsi]
    .filter(Boolean)
    .join(", ")

  const jumlahBibit =
    item.jumlah_bibit !== null && item.jumlah_bibit !== undefined
      ? formatNumber(Number(item.jumlah_bibit))
      : "0"

  const luasArea =
    item.luas_area !== null && item.luas_area !== undefined
      ? `${formatNumber(Number(item.luas_area))} ha`
      : "-"

  const tanggalTanam = formatDate(item.tanggal_tanam)
  const koordinat = formatCoordinate(item)

  return `
    <div style="
      width: 330px;
      border-radius: 24px;
      overflow: hidden;
      background: #0F5139;
      color: #F7F6EF;
      font-family: Inter, Arial, sans-serif;
      box-shadow: 0 18px 40px rgba(0,0,0,0.28);
    ">
      <div style="padding: 22px 22px 18px;">
        <div style="
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        ">
          <div>
            <div style="
              font-size: 20px;
              line-height: 1.25;
              font-weight: 800;
              color: #F7F6EF;
            ">
              ${escapeHtml(item.nama_lokasi || "Lokasi Penanaman")}
            </div>

            <div style="
              margin-top: 8px;
              font-size: 12px;
              line-height: 1.6;
              color: rgba(247,246,239,0.86);
            ">
              ${escapeHtml(item.alamat || "-")}<br/>
              ${escapeHtml(wilayah || "-")}
            </div>
          </div>

          <div style="
            flex-shrink: 0;
            border-radius: 999px;
            background: rgba(255,255,255,0.12);
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 700;
            color: #F7F6EF;
            white-space: nowrap;
          ">
            ${escapeHtml(status)}
          </div>
        </div>

        <div style="
          height: 1px;
          background: rgba(247,246,239,0.25);
          margin: 12px 0 16px;
        "></div>

        <div style="display: grid; gap: 12px;">
          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Tanggal tanam
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(tanggalTanam)}
            </strong>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Jumlah bibit
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(jumlahBibit)}
            </strong>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Luas area
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(luasArea)}
            </strong>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Koordinat
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(koordinat)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  `
}

function StatsSection() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("lokasi_penanaman")
        .select("status_lokasi, jumlah_bibit, luas_area")

      if (error || !data) {
        setLoading(false)
        return
      }

      const lokasi_aktif = data.filter(
        (item) =>
          item.status_lokasi?.toLowerCase() === "aktif" ||
          item.status_lokasi === null
      ).length

      const total_bibit = data.reduce(
        (sum, item) => sum + (item.jumlah_bibit || 0),
        0
      )

      const total_luas = data.reduce(
        (sum, item) => sum + (item.luas_area || 0),
        0
      )

      setStats({ lokasi_aktif, total_bibit, total_luas })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const items = stats
    ? [
        { value: formatNumber(stats.lokasi_aktif), label: "Lokasi aktif" },
        { value: formatNumber(stats.total_bibit), label: "Total bibit ditanam" },
        { value: formatNumber(stats.total_luas), label: "Total luas (ha)" },
      ]
    : [
        { value: "—", label: "Lokasi aktif" },
        { value: "—", label: "Total bibit ditanam" },
        { value: "—", label: "Total luas (ha)" },
      ]

  return (
    <section className="grid gap-4 border-b border-black/10 pb-8 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="p-6 text-center">
          <p
            className={`text-3xl font-bold text-emerald-900 sm:text-4xl transition-opacity duration-300 ${
              loading ? "opacity-30" : "opacity-100"
            }`}
          >
            {item.value}
          </p>
          <p className="mt-2 text-sm text-emerald-900">{item.label}</p>
        </div>
      ))}
    </section>
  )
}

function createMarkerContent(color = "#0F5139", label = "P") {
  const wrapper = document.createElement("div")

  wrapper.innerHTML = `
    <div style="
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 800;
      font-family: Arial, sans-serif;
    ">
      ${label}
    </div>
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
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined,
        })

        const bounds = new LatLngBounds()
        const infoWindow = new InfoWindow({
          maxWidth: 360,
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
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: "#0F5139",
              fillOpacity: 0.28,
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
              content: createMarkerContent("#0F5139", "P"),
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
              content: createMarkerContent("#0F5139", "P"),
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

        console.error("ERROR PETA LESTARI:", message)
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
          padding: 0 !important;
          border-radius: 24px !important;
          background: transparent !important;
          box-shadow: none !important;
          overflow: visible !important;
        }

        .gm-style .gm-style-iw-d {
          overflow: hidden !important;
        }

        .gm-style .gm-style-iw-tc::after {
          background: #0f5139 !important;
        }

        .gm-ui-hover-effect {
          top: 8px !important;
          right: 8px !important;
          width: 28px !important;
          height: 28px !important;
          border-radius: 999px !important;
          background: rgba(255, 255, 255, 0.16) !important;
        }

        .gm-ui-hover-effect span {
          background-color: #f7f6ef !important;
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
        <StatsSection />

        {/* Peta Lestari */}
        <section className="rounded-3xl border border-black bg-stone-50 p-5 sm:p-8 lg:p-10">
          <PetaLestari />
        </section>
      </div>
    </main>
  )
}