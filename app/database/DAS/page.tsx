"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
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
  polygon_coordinates: unknown | null
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

function parsePoint(value: unknown): PolygonPoint | null {
  if (!value) return null

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return parsePoint(parsed)
    } catch {
      const parts = value.split(",").map((item) => Number(item.trim()))

      if (parts.length >= 2 && isValidLatLng(parts[0], parts[1])) {
        return {
          lat: parts[0],
          lng: parts[1],
        }
      }

      return null
    }
  }

  if (Array.isArray(value)) {
    const lat = Number(value[0])
    const lng = Number(value[1])

    if (isValidLatLng(lat, lng)) {
      return { lat, lng }
    }

    return null
  }

  if (typeof value === "object" && value !== null) {
    const item = value as Record<string, unknown>

    const lat = Number(item.lat ?? item.latitude)
    const lng = Number(item.lng ?? item.longitude)

    if (isValidLatLng(lat, lng)) {
      return { lat, lng }
    }
  }

  return null
}

function getPolygonPoints(item: DasRow): PolygonPoint[] {
  let polygonData = item.polygon_coordinates

  if (typeof polygonData === "string") {
    try {
      polygonData = JSON.parse(polygonData)
    } catch {
      console.log("Polygon gagal diparse:", item.nama_das, polygonData)
      return []
    }
  }

  if (!Array.isArray(polygonData)) {
    console.log("Polygon bukan array:", item.nama_das, polygonData)
    return []
  }

  const points = polygonData
    .map((point) => parsePoint(point))
    .filter((point): point is PolygonPoint => Boolean(point))

  console.log("Polygon points:", item.nama_das, points)

  return points
}

function formatCoordinate(point: PolygonPoint | null, label: string) {
  if (!point) return `${label}: -`

  const latDirection = point.lat < 0 ? "S" : "N"
  const lngDirection = point.lng < 0 ? "W" : "E"

  return `${Math.abs(point.lat).toFixed(4)}°${latDirection}, ${Math.abs(
    point.lng
  ).toFixed(4)}°${lngDirection} (${label})`
}

function popupContent(item: DasRow) {
  const huluPoint = parsePoint(item.koordinat_hulu)
  const muaraPoint = parsePoint(item.koordinat_muara)

  const luasDas = item.luas_ha ? formatNumber(Number(item.luas_ha)) : "-"
  const panjangSungai = item.panjang_sungai_km
    ? `${item.panjang_sungai_km} km`
    : "-"

  const kemiringan =
    item.kemiringan_min !== null && item.kemiringan_max !== null
      ? `${item.kemiringan_min}° - ${item.kemiringan_max}°`
      : "-"

  const tutupanPersen = Number(item.tutupan_hutan_persen || 0)
  const tutupanText = item.tutupan_hutan_persen
    ? `${item.tutupan_hutan_persen}%`
    : "-"

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
              ${escapeHtml(item.nama_das || "DAS Lestari")}
            </div>

            <div style="
              margin-top: 8px;
              font-size: 12px;
              line-height: 1.6;
              color: rgba(247,246,239,0.86);
            ">
              ${escapeHtml(formatCoordinate(huluPoint, "Hulu"))}<br/>
              ${escapeHtml(formatCoordinate(muaraPoint, "Muara"))}
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
          ">
            ${escapeHtml(item.kondisi || "Terdokumentasi")}
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
              Luas DAS
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(luasDas)} ha
            </strong>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Panjang sungai utama
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(panjangSungai)}
            </strong>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Jenis tanah dominan
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(item.jenis_tanah || "-")}
            </strong>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 18px;">
            <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
              Kemiringan rata-rata
            </span>
            <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
              ${escapeHtml(kemiringan)}
            </strong>
          </div>

          <div style="margin-top: 4px;">
            <div style="
              display: flex;
              justify-content: space-between;
              gap: 18px;
              margin-bottom: 8px;
            ">
              <span style="font-size: 14px; color: rgba(247,246,239,0.8);">
                Tutupan hutan
              </span>
              <strong style="font-size: 14px; color: #F7F6EF; text-align: right;">
                ${escapeHtml(tutupanText)}
              </strong>
            </div>

            <div style="
              height: 8px;
              overflow: hidden;
              border-radius: 999px;
              background: rgba(247,246,239,0.22);
            ">
              <div style="
                height: 100%;
                width: ${Math.max(0, Math.min(tutupanPersen, 100))}%;
                border-radius: 999px;
                background: #F7F6EF;
              "></div>
            </div>

            <div style="
              margin-top: 6px;
              font-size: 10px;
              font-weight: 700;
              color: rgba(247,246,239,0.72);
            ">
              ${escapeHtml(tutupanText)} dari luas DAS
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function createMarkerContent(color: string, label: string) {
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

function DasMap({ dasList }: { dasList: DasRow[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadMap() {
      try {
        setLoading(true)
        setErrorMessage("")

        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          v: "weekly",
        })

        const { Map, Polygon, Polyline, InfoWindow } =
          (await importLibrary("maps")) as google.maps.MapsLibrary

        const { LatLngBounds } =
          (await importLibrary("core")) as google.maps.CoreLibrary

        const { AdvancedMarkerElement } =
          (await importLibrary("marker")) as google.maps.MarkerLibrary

        if (!mapContainerRef.current || cancelled) return

        const defaultCenter = {
          lat: -6.5971,
          lng: 106.806,
        }

        const map = new Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 9,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined,
        })

        mapInstanceRef.current = map

        const bounds = new LatLngBounds()
        const infoWindow = new InfoWindow({
          maxWidth: 360,
        })

        let hasBounds = false

        dasList.forEach((item) => {
          const polygonPoints = getPolygonPoints(item)
          const huluPoint = parsePoint(item.koordinat_hulu)
          const muaraPoint = parsePoint(item.koordinat_muara)

          console.log("DAS item:", {
            nama_das: item.nama_das,
            polygonPoints,
            huluPoint,
            muaraPoint,
          })

          if (polygonPoints.length >= 3) {
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

            polygonPoints.forEach((point) => {
              bounds.extend(point)
              hasBounds = true
            })

            polygon.addListener("click", (event: google.maps.MapMouseEvent) => {
              infoWindow.close()
              infoWindow.setContent(popupContent(item))
              infoWindow.setPosition(event.latLng || polygonPoints[0])
              infoWindow.open({
                map,
              })
            })
          } else {
            console.log(
              `Polygon ${item.nama_das} tidak digambar karena titik valid kurang dari 3`
            )
          }

          if (huluPoint) {
            const huluMarker = new AdvancedMarkerElement({
              map,
              position: huluPoint,
              title: `Hulu ${item.nama_das}`,
              content: createMarkerContent("#0F5139", "H"),
            })

            bounds.extend(huluPoint)
            hasBounds = true

            huluMarker.addListener("click", () => {
              infoWindow.close()
              infoWindow.setContent(popupContent(item))
              infoWindow.setPosition(huluPoint)
              infoWindow.open({
                map,
              })
            })
          }

          if (muaraPoint) {
            const muaraMarker = new AdvancedMarkerElement({
              map,
              position: muaraPoint,
              title: `Muara ${item.nama_das}`,
              content: createMarkerContent("#B91C1C", "M"),
            })

            bounds.extend(muaraPoint)
            hasBounds = true

            muaraMarker.addListener("click", () => {
              infoWindow.close()
              infoWindow.setContent(popupContent(item))
              infoWindow.setPosition(muaraPoint)
              infoWindow.open({
                map,
              })
            })
          }

          if (huluPoint && muaraPoint) {
            const riverLine = new Polyline({
              path: [huluPoint, muaraPoint],
              geodesic: true,
              strokeColor: "#2563EB",
              strokeOpacity: 0.85,
              strokeWeight: 3,
            })

            riverLine.setMap(map)
          }
        })

        if (hasBounds) {
          map.fitBounds(bounds)
        }

        setLoading(false)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat peta DAS"

        console.error("ERROR PETA DAS:", message)
        setErrorMessage(message)
        setLoading(false)
      }
    }

    loadMap()

    return () => {
      cancelled = true
      mapInstanceRef.current = null
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
        console.error("FETCH DAS ERROR:", error.message)
        setLoading(false)
        return
      }

      console.log("DATA DAS DARI SUPABASE:", data)

      setDasList((data || []) as DasRow[])
      setLoading(false)
    }

    fetchDas()
  }, [])

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
        <section className="flex flex-wrap gap-3 border-b border-black/10 pb-8">
          <TabButton href="/database/peta">Peta Lestari</TabButton>

          <TabButton href="/database/pohon">Pohon Lestari</TabButton>

          <TabButton href="/database/das" active>
            DAS Lestari
          </TabButton>
        </section>

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