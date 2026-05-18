"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type PolygonPoint = {
  lat: number
  lng: number
}

type DasRow = {
  id: number
  nama_das: string
  koordinat_hulu: unknown | null
  koordinat_muara: unknown | null
  luas_ha: number | null
  luas_tutupan_hutan: number | null
  tutupan_hutan_persen: number | null
  panjang_sungai_km: number | null
  jenis_tanah: string | null
  kemiringan_min: number | null
  kemiringan_max: number | null
  kondisi: string | null
  polygon_coordinates: PolygonPoint[] | string | null
  created_at: string | null
  updated_at: string | null
  luas_tutupan_ha: number | null
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function parsePoint(value: unknown): PolygonPoint | null {
  if (!value) return null

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return parsePoint(parsed)
    } catch {
      const parts = value.split(",").map((item) => Number(item.trim()))

      if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
        return {
          lat: parts[0],
          lng: parts[1],
        }
      }

      return null
    }
  }

  if (typeof value === "object" && value !== null) {
    const item = value as Record<string, unknown>

    const lat = Number(item.lat ?? item.latitude)
    const lng = Number(item.lng ?? item.longitude)

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return { lat, lng }
    }
  }

  return null
}

function getPolygonPoints(item: DasRow): PolygonPoint[] {
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
    .map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }))
    .filter((point) => !Number.isNaN(point.lat) && !Number.isNaN(point.lng))
}

function popupContent(item: DasRow) {
  return `
    <div style="min-width: 240px; font-family: Arial, sans-serif;">
      <strong>${escapeHtml(item.nama_das || "DAS")}</strong>
      <br />
      <span>Kondisi: ${escapeHtml(item.kondisi || "-")}</span>
      <br />
      <span>Luas: ${escapeHtml(item.luas_ha ?? 0)} ha</span>
      <br />
      <span>Luas tutupan hutan: ${escapeHtml(item.luas_tutupan_hutan ?? item.luas_tutupan_ha ?? 0)} ha</span>
      <br />
      <span>Tutupan hutan: ${escapeHtml(item.tutupan_hutan_persen ?? 0)}%</span>
      <br />
      <span>Panjang sungai: ${escapeHtml(item.panjang_sungai_km ?? 0)} km</span>
      <br />
      <span>Jenis tanah: ${escapeHtml(item.jenis_tanah || "-")}</span>
      <br />
      <span>Kemiringan: ${escapeHtml(item.kemiringan_min ?? 0)} - ${escapeHtml(item.kemiringan_max ?? 0)}</span>
    </div>
  `
}

function DasMap({ dasList }: { dasList: DasRow[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadMap() {
      try {
        setLoading(true)
        setErrorMessage("")

        const L = await import("leaflet")

        if (!mapContainerRef.current || cancelled) return

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        const defaultCenter: [number, number] = [-6.5971, 106.806]

        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 9,
          scrollWheelZoom: true,
          zoomControl: true,
        })

        mapInstanceRef.current = map

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map)

        const huluIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              width: 18px;
              height: 18px;
              border-radius: 9999px;
              background: #0F5139;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            "></div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })

        const muaraIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              width: 18px;
              height: 18px;
              border-radius: 9999px;
              background: #B91C1C;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            "></div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })

        const bounds = L.latLngBounds([])
        let hasBounds = false

        dasList.forEach((item) => {
          const polygonPoints = getPolygonPoints(item)
          const huluPoint = parsePoint(item.koordinat_hulu)
          const muaraPoint = parsePoint(item.koordinat_muara)

          if (polygonPoints.length >= 3) {
            const points = polygonPoints.map(
              (point) => [point.lat, point.lng] as [number, number]
            )

            L.polygon(points, {
              color: "#0F5139",
              weight: 2,
              opacity: 0.9,
              fillColor: "#0F5139",
              fillOpacity: 0.25,
            })
              .addTo(map)
              .bindPopup(popupContent(item))

            points.forEach((point) => {
              bounds.extend(point)
              hasBounds = true
            })
          }

          if (huluPoint) {
            const huluPosition: [number, number] = [huluPoint.lat, huluPoint.lng]

            bounds.extend(huluPosition)
            hasBounds = true

            L.marker(huluPosition, { icon: huluIcon })
              .addTo(map)
              .bindPopup(`
                <div>
                  <strong>Hulu ${escapeHtml(item.nama_das)}</strong><br/>
                  ${popupContent(item)}
                </div>
              `)
          }

          if (muaraPoint) {
            const muaraPosition: [number, number] = [muaraPoint.lat, muaraPoint.lng]

            bounds.extend(muaraPosition)
            hasBounds = true

            L.marker(muaraPosition, { icon: muaraIcon })
              .addTo(map)
              .bindPopup(`
                <div>
                  <strong>Muara ${escapeHtml(item.nama_das)}</strong><br/>
                  ${popupContent(item)}
                </div>
              `)
          }

          if (huluPoint && muaraPoint) {
            const riverLine: [number, number][] = [
              [huluPoint.lat, huluPoint.lng],
              [muaraPoint.lat, muaraPoint.lng],
            ]

            L.polyline(riverLine, {
              color: "#2563EB",
              weight: 3,
              opacity: 0.85,
              dashArray: "8 8",
            }).addTo(map)
          }
        })

        if (hasBounds) {
          map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 13,
          })
        }

        setTimeout(() => {
          map.invalidateSize()
        }, 250)

        setLoading(false)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat peta DAS"

        setErrorMessage(message)
        setLoading(false)
      }
    }

    loadMap()

    return () => {
      cancelled = true

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [dasList])

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-gray-400 sm:h-[560px] lg:h-[720px]">
      <div ref={mapContainerRef} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-gray-400 text-sm font-semibold text-white">
          Memuat peta DAS...
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

export default function DatabaseDasPage() {
  const [dasList, setDasList] = useState<DasRow[]>([])
  const [loading, setLoading] = useState(true)

  const totalDas = dasList.length

  const totalLuas = dasList.reduce((sum, item) => {
    return sum + Number(item.luas_ha || 0)
  }, 0)

  const totalKritis = dasList.filter((item) =>
    String(item.kondisi || "").toLowerCase().includes("kritis")
  ).length

  const totalBaik = dasList.filter((item) =>
    String(item.kondisi || "").toLowerCase().includes("baik")
  ).length

  const stats = [
    {
      value: formatNumber(totalDas),
      label: "DAS terdokumentasi",
    },
    {
      value: formatNumber(totalLuas),
      label: "Total luas (ha)",
    },
    {
      value: formatNumber(totalKritis),
      label: "DAS kritis",
    },
    {
      value: formatNumber(totalBaik),
      label: "DAS kondisi baik",
    },
  ]

  useEffect(() => {
    async function fetchDas() {
      setLoading(true)

      const { data, error } = await supabase
        .from("das")
        .select(
          "id, nama_das, koordinat_hulu, koordinat_muara, luas_ha, luas_tutupan_hutan, tutupan_hutan_persen, panjang_sungai_km, jenis_tanah, kemiringan_min, kemiringan_max, kondisi, polygon_coordinates, created_at, updated_at, luas_tutupan_ha"
        )
        .order("id", { ascending: false })

      if (error) {
        console.error(error.message)
        setLoading(false)
        return
      }

      setDasList((data || []) as DasRow[])
      setLoading(false)
    }

    fetchDas()
  }, [])

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: #ddd;
          outline: 0;
          font-family: inherit;
          z-index: 1;
        }

        .leaflet-pane,
        .leaflet-tile,
        .leaflet-marker-icon,
        .leaflet-marker-shadow,
        .leaflet-tile-container,
        .leaflet-pane > svg,
        .leaflet-pane > canvas,
        .leaflet-zoom-box,
        .leaflet-image-layer,
        .leaflet-layer {
          position: absolute;
          left: 0;
          top: 0;
        }

        .leaflet-container img.leaflet-tile {
          max-width: none !important;
          max-height: none !important;
          width: 256px !important;
          height: 256px !important;
        }

        .leaflet-tile {
          filter: inherit;
          visibility: hidden;
        }

        .leaflet-tile-loaded {
          visibility: inherit;
        }

        .leaflet-zoom-animated {
          transform-origin: 0 0;
        }

        .leaflet-interactive {
          cursor: pointer;
        }

        .leaflet-control {
          position: relative;
          z-index: 800;
          pointer-events: auto;
        }

        .leaflet-top,
        .leaflet-bottom {
          position: absolute;
          z-index: 1000;
          pointer-events: none;
        }

        .leaflet-top {
          top: 0;
        }

        .leaflet-right {
          right: 0;
        }

        .leaflet-bottom {
          bottom: 0;
        }

        .leaflet-left {
          left: 0;
        }

        .leaflet-control {
          float: left;
          clear: both;
        }

        .leaflet-right .leaflet-control {
          float: right;
        }

        .leaflet-top .leaflet-control {
          margin-top: 10px;
        }

        .leaflet-bottom .leaflet-control {
          margin-bottom: 10px;
        }

        .leaflet-left .leaflet-control {
          margin-left: 10px;
        }

        .leaflet-right .leaflet-control {
          margin-right: 10px;
        }

        .leaflet-control-zoom a {
          display: block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          text-decoration: none;
          color: #0f5139;
          background: white;
          border-bottom: 1px solid #ccc;
          font-size: 18px;
          font-weight: bold;
        }

        .leaflet-control-zoom {
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .leaflet-popup {
          position: absolute;
          text-align: center;
          margin-bottom: 20px;
        }

        .leaflet-popup-content-wrapper {
          padding: 8px;
          text-align: left;
          border-radius: 12px;
          background: white;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.25);
        }

        .leaflet-popup-content {
          margin: 8px;
          line-height: 1.5;
          font-size: 13px;
        }

        .leaflet-popup-tip-container {
          width: 40px;
          height: 20px;
          position: absolute;
          left: 50%;
          margin-left: -20px;
          overflow: hidden;
          pointer-events: none;
        }

        .leaflet-popup-tip {
          width: 17px;
          height: 17px;
          padding: 1px;
          margin: -10px auto 0;
          transform: rotate(45deg);
          background: white;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.25);
        }

        .leaflet-popup-close-button {
          position: absolute;
          top: 0;
          right: 0;
          padding: 6px 8px;
          text-align: center;
          width: 24px;
          height: 24px;
          font: 16px/24px Tahoma, Verdana, sans-serif;
          color: #555;
          text-decoration: none;
          font-weight: bold;
          background: transparent;
          border: none;
        }

        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          display: block;
        }

        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {/* Tabs */}
        <section className="flex flex-wrap gap-3 border-b border-black/10 pb-8">
          <TabButton href="/database/peta">Peta Lestari</TabButton>

          <TabButton href="/database/pohon">Pohon Lestari</TabButton>

          <TabButton href="/database/das" active>
            DAS Lestari
          </TabButton>
        </section>

        {/* Stats */}
        <section className="grid gap-4 border-b border-black/10 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="p-6 text-center">
              <p className="text-3xl font-bold text-emerald-900 sm:text-4xl">
                {loading ? "..." : item.value}
              </p>

              <p className="mt-2 text-sm text-emerald-900">{item.label}</p>
            </div>
          ))}
        </section>

        {/* Area Konten DAS */}
        <section className="rounded-3xl border border-black bg-stone-50 p-6 sm:p-8 lg:p-10">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-gray-400 text-sm font-semibold text-white sm:min-h-[520px] lg:min-h-[720px]">
              Memuat data DAS...
            </div>
          ) : (
            <DasMap dasList={dasList} />
          )}
        </section>
      </div>
    </main>
  )
}