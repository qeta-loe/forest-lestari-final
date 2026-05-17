"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
import { supabase } from "@/lib/supabase"

type Artikel = {
  id: number
  judul: string
  tanggal_publikasi: string | null
  created_at: string | null
  is_draft: boolean | null
}

type KegiatanTerbaru = {
  id: number
  nama_kegiatan: string
  kabupaten_kota: string | null
  provinsi: string | null
  tanggal_mulai: string | null
  thumbnail_url: string | null
  is_draft: boolean | null
}

type PolygonPoint = {
  lat: number
  lng: number
}

type LokasiPenanaman = {
  id: number
  nama_lokasi: string
  latitude: number
  longitude: number
  deskripsi: string | null
  polygon_coordinates: PolygonPoint[] | null
}

function getPolygonPoints(item: LokasiPenanaman): PolygonPoint[] {
  if (Array.isArray(item.polygon_coordinates)) {
    return item.polygon_coordinates
      .map((point) => ({
        lat: Number(point.lat),
        lng: Number(point.lng),
      }))
      .filter((point) => !Number.isNaN(point.lat) && !Number.isNaN(point.lng))
  }

  return []
}

function PetaLokasiPenanaman() {
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
            "id, nama_lokasi, latitude, longitude, deskripsi, polygon_coordinates"
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
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-400 sm:aspect-[16/9] lg:aspect-[4/3]">
      <div ref={mapRef} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-400 p-6 text-center text-sm font-semibold text-white">
          Memuat peta...
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-400 p-6 text-center text-sm font-semibold text-white">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default function BerandaPage() {
  const stats = [
    { value: "48", label: "Kegiatan Selesai" },
    { value: "12", label: "DAS Terdokumentasi" },
    { value: "37", label: "Spesies Endemik" },
    { value: "3", label: "Mitra Instansi" },
  ]

  const [articles, setArticles] = useState<Artikel[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)

  const [latestKegiatan, setLatestKegiatan] = useState<KegiatanTerbaru[]>([])
  const [loadingKegiatan, setLoadingKegiatan] = useState(true)

  const fetchLatestArticles = async () => {
    setLoadingArticles(true)

    const { data, error } = await supabase
      .from("artikel")
      .select("id, judul, tanggal_publikasi, created_at, is_draft")
      .eq("is_draft", false)
      .order("tanggal_publikasi", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error(error.message)
      setLoadingArticles(false)
      return
    }

    setArticles((data || []) as Artikel[])
    setLoadingArticles(false)
  }

  const fetchLatestKegiatan = async () => {
    setLoadingKegiatan(true)

    const { data, error } = await supabase
      .from("kegiatan")
      .select(
        "id, nama_kegiatan, kabupaten_kota, provinsi, tanggal_mulai, thumbnail_url, is_draft"
      )
      .eq("is_draft", false)
      .order("tanggal_mulai", { ascending: false, nullsFirst: false })
      .limit(3)

    if (error) {
      console.error(error.message)
      setLoadingKegiatan(false)
      return
    }

    setLatestKegiatan((data || []) as KegiatanTerbaru[])
    setLoadingKegiatan(false)
  }

  useEffect(() => {
    fetchLatestArticles()
    fetchLatestKegiatan()
  }, [])

  const formatDate = (date?: string | null) => {
    if (!date) return "Tanggal tidak tersedia"

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-8 text-[#113522] sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
        <div>
          {/* Hero */}
          <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col items-start gap-6">
              <div className="max-w-3xl space-y-3 sm:space-y-4">
                <div className="w-fit rounded-full bg-yellow-800/50 px-4 py-2 text-xs font-semibold tracking-wide text-orange-50 sm:text-sm">
                  KOMUNITAS LINGKUNGAN BOGOR
                </div>

                <h1 className="font-['Newsreader'] text-4xl font-normal leading-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                  Bersama Menjaga Kelestarian Hutan & Alam Indonesia
                </h1>

                <p className="max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
                  Platform dokumentasi dan informasi kegiatan pelestarian
                  lingkungan komunitas Forest Lestari.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="#kegiatan"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-900 px-7 text-base font-bold text-stone-50 transition hover:bg-emerald-950 active:scale-95 sm:text-lg"
                >
                  Lihat Kegiatan
                </a>

                <a
                  href="#database"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-emerald-950 bg-stone-50 px-7 text-base font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-95 sm:text-lg"
                >
                  Database Lingkungan
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-xl sm:aspect-[5/3] lg:aspect-square">
              <img
                className="h-full w-full object-cover"
                src="https://placehold.co/700x700"
                alt="Dokumentasi kegiatan lingkungan"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/40 to-emerald-950/0" />
            </div>
          </section>
        </div>

        {/* Statistik */}
        <section className="border-y border-black/10 py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:divide-x md:divide-black/10">
            {stats.map((item) => (
              <div key={item.label} className="px-4 py-4 text-center">
                <p className="text-4xl font-bold text-emerald-900 sm:text-5xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs text-emerald-900 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Kegiatan terbaru */}
        <section id="kegiatan" className="space-y-6 scroll-mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
              Kegiatan Terbaru
            </h2>

            <Link
              href="/kegiatan"
              className="text-sm font-semibold text-emerald-900 hover:underline"
            >
              Lihat semua kegiatan
            </Link>
          </div>

          {loadingKegiatan && (
            <div className="rounded-3xl bg-stone-50/70 p-6 text-sm text-emerald-900">
              Memuat kegiatan terbaru...
            </div>
          )}

          {!loadingKegiatan && latestKegiatan.length === 0 && (
            <div className="rounded-3xl bg-stone-50/70 p-6 text-sm text-emerald-900">
              Belum ada kegiatan terbaru.
            </div>
          )}

          {!loadingKegiatan && latestKegiatan.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {latestKegiatan.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/kegiatan/${activity.id}`}
                  className="group flex overflow-hidden rounded-3xl bg-emerald-900/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-56"
                >
                  <div className="w-2/5 bg-gray-300 transition group-hover:bg-gray-200">
                    {activity.thumbnail_url && (
                      <img
                        src={activity.thumbnail_url}
                        alt={activity.nama_kegiatan}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center px-4 py-8 text-center">
                    <h3 className="text-lg font-bold leading-tight text-emerald-900 sm:text-xl">
                      {activity.nama_kegiatan}
                    </h3>

                    <p className="mt-2 text-sm text-white">
                      {activity.kabupaten_kota || "-"}
                      {activity.provinsi ? `, ${activity.provinsi}` : ""},{" "}
                      {formatDate(activity.tanggal_mulai)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Artikel dan peta */}
        <section
          id="database"
          className="grid scroll-mt-10 gap-10 border-t border-black/10 pt-10 lg:grid-cols-2"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
              Artikel Terbaru
            </h2>

            <div className="divide-y divide-black/10 rounded-3xl bg-stone-50/70 px-5 py-2">
              {loadingArticles && (
                <div className="py-5 text-sm text-emerald-900/80">
                  Memuat artikel terbaru...
                </div>
              )}

              {!loadingArticles && articles.length === 0 && (
                <div className="py-5 text-sm text-emerald-900/80">
                  Belum ada artikel terbaru.
                </div>
              )}

              {!loadingArticles &&
                articles.map((article) => (
                  <article key={article.id} className="py-5">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-lg font-normal text-emerald-900 transition hover:text-emerald-700 hover:underline sm:text-xl"
                    >
                      {article.judul}
                    </Link>

                    <p className="mt-2 text-xs text-emerald-900/80">
                      {formatDate(
                        article.tanggal_publikasi || article.created_at
                      )}
                    </p>
                  </article>
                ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl">
              Peta Lokasi Penanaman
            </h2>

            <PetaLokasiPenanaman />
          </div>
        </section>
      </div>
    </main>
  )
}