"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
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
    .map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }))
    .filter((point) => !Number.isNaN(point.lat) && !Number.isNaN(point.lng))
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
    <div style="min-width: 220px; font-family: Arial, sans-serif;">
      <strong>${escapeHtml(item.nama_lokasi || "Lokasi Penanaman")}</strong>
      <br />
      <span>Status: ${escapeHtml(item.status_lokasi || "-")}</span>
      <br />
      <span>Alamat: ${escapeHtml(item.alamat || "-")}</span>
      <br />
      <span>${escapeHtml(item.kabupaten_kota || "-")}, ${escapeHtml(item.provinsi || "-")}</span>
      <br />
      <br />
      <span>Jumlah bibit: ${escapeHtml(item.jumlah_bibit ?? 0)}</span>
      <br />
      <span>Luas area: ${escapeHtml(item.luas_area ?? 0)} ha</span>
    </div>
  `
}

function PetaLestari() {
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

        if (!mapContainerRef.current || cancelled) return

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        const lokasi = (data || []) as LokasiPenanaman[]

        const defaultCenter: [number, number] = [-6.5971, 106.806]

        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 11,
          scrollWheelZoom: true,
          zoomControl: true,
        })

        mapInstanceRef.current = map

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map)

        const markerIcon = L.divIcon({
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

        const bounds = L.latLngBounds([])
        let hasBounds = false

        lokasi.forEach((item) => {
          const polygonPoints = getPolygonPoints(item)

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

            L.marker(points[0], { icon: markerIcon })
              .addTo(map)
              .bindPopup(popupContent(item))

            return
          }

          const lat = Number(item.latitude)
          const lng = Number(item.longitude)

          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            const position: [number, number] = [lat, lng]

            bounds.extend(position)
            hasBounds = true

            L.marker(position, { icon: markerIcon })
              .addTo(map)
              .bindPopup(popupContent(item))
          }
        })

        if (hasBounds) {
          map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 16,
          })
        }

        setTimeout(() => {
          map.invalidateSize()
        }, 250)

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

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-gray-400 sm:h-[560px] lg:h-[720px]">
      <div ref={mapContainerRef} className="h-full w-full" />

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
          <TabButton href="/database/peta" active>
            Peta Lestari
          </TabButton>

          <TabButton href="/database/pohon">Pohon Lestari</TabButton>

          <TabButton href="/database/das">DAS Lestari</TabButton>
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