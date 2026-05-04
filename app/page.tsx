"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Kegiatan {
  id: number
  nama: string
  deskripsi: string
  image_url?: string | null
  [key: string]: any
}

// bikin interface buat das, spesies endemik, dan mitra instansi 

const articles = [
  {
    title: "Dampak Deforestasi terhadap Satwa Endemik Jawa",
    date: "12 April 2026",
  },
  {
    title: "Mengenal Daerah Aliran Sungai Cisadane",
    date: "28 Maret 2026",
  },
  {
    title: "Tips Konservasi Hutan Hujan Tropis",
    date: "9 Januari 2026",
  },
  {
    title: "Pengembangan Kehutanan Masyarakat Di Daerah Leuwiliang",
    date: "16 Februari 2026",
  },
]

export default function Home() {
  const [kegiatanCount, setKegiatanCount] = useState(0)
  const [kegiatanTerbaru, setKegiatanTerbaru] = useState<Kegiatan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchKegiatanHome = async () => {
    setLoading(true)

    // Ambil jumlah semua kegiatan
    const { count, error: countError } = await supabase
      .from("kegiatan")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.log("COUNT ERROR:", countError)
    } else {
      setKegiatanCount(count || 0)
    }

    // Ambil 3 kegiatan terbaru buat ditampilin di homepage
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("id", { ascending: false })
      .limit(3)

    if (error) {
      console.log("FETCH KEGIATAN ERROR:", error)
    } else {
      setKegiatanTerbaru(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchKegiatanHome()

    // Supaya kalau ada kegiatan baru, jumlah dan list langsung update
    const channel = supabase
      .channel("kegiatan-home-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kegiatan",
        },
        () => {
          fetchKegiatanHome()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const stats = [
    { value: kegiatanCount.toString(), label: "Kegiatan Selesai", href: "/kegiatan", }, // nyambung ke kegiatan
    { value: "12", label: "DAS Terdokumentasi" }, //ini nyambung ke mana, yg value bikin kaya kegiatan juga
    { value: "37", label: "Spesies Endemik" }, // ini nyambung ke mana
    { value: "3", label: "Mitra Instansi" }, // ini juga nyambung ke mana
  ]

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-10">
        <section className="mt-1 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-emerald-900/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-900">
              Komunitas Lingkungan Bogor
            </span>

            <h1 className="text-4xl font-semibold leading-tight text-[#0F3926] sm:text-5xl">
              Bersama Menjaga Kelestarian Hutan & Alam Indonesia
            </h1>

            <p className="max-w-2xl text-sm leading-7 text-[#3d5f49] sm:text-base">
              Platform dokumentasi dan informasi kegiatan pelestarian lingkungan
              komunitas Forest Lestari.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-full bg-[#0F5139] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#113f2f] active:scale-95">
                Lihat Kegiatan
              </button>

              <button className="inline-flex items-center justify-center rounded-full border border-[#0F5139] bg-white px-6 py-3 text-sm font-semibold text-[#0F5139] transition hover:bg-[#f4f8f3] active:scale-95">
                Database Lingkungan
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[#e8f2e9] p-6 shadow-[0_20px_80px_rgba(23,57,28,0.10)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,80,53,0.25),_transparent_40%)]" />

            <div className="relative grid h-full min-h-[320px] place-items-center rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,_rgba(19,71,43,0.15),_rgba(196,240,209,0.12))] p-6">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-950/10 text-white">
                  🌿
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-900/80">
                  Foto Hutan Tropis
                </p>

                <p className="mt-4 text-base leading-7 text-[#15422F]/90">
                  Visualisasi suasana alam hijau dan lembap untuk memberi kesan
                  lingkungan yang terjaga.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const cardContent = (
              <>
                <h3 className="text-3xl font-semibold text-[#0C3725]">
                  {item.value}
                </h3>

                <p className="mt-1 text-sm text-[#4D6B57]">{item.label}</p>
              </>
            )

            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5 transition-all duration-150 hover:bg-[#eef7f1] hover:shadow-md active:scale-95 cursor-pointer"
                >
                  {cardContent}
                </Link>
              )
            }

            return (
              <div
                key={item.label}
                className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5"
              >
                {cardContent}
              </div>
            )
          })}
        </section>

        <section className="mt-12 space-y-8">
          <div className="rounded-[32px] bg-white/90 p-8 shadow-sm ring-1 ring-black/5">
            <p className="text-sm uppercase tracking-[0.25em] text-[#48755e] font-semibold">
              Kegiatan Terbaru
            </p>

            {loading ? (
              <p className="mt-6 text-sm text-[#4D6B57]">
                Memuat kegiatan...
              </p>
            ) : kegiatanTerbaru.length === 0 ? (
              <p className="mt-6 text-sm text-[#4D6B57]">
                Belum ada kegiatan yang diupload.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {kegiatanTerbaru.map((item) => (
                 <article
                    key={item.id}
                    className="rounded-3xl bg-[#4a7062] p-5 flex gap-4 overflow-hidden max-w-full">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.nama}
                        className="shrink-0 w-24 h-24 rounded-2xl object-cover bg-gray-300"/>
                    ) : (
                      <div className="shrink-0 w-24 h-24 rounded-2xl bg-gray-300" />
                    )}

                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h4 className="text-lg font-semibold text-white truncate">
                        {item.nama}
                      </h4>

                      <p className="mt-2 text-sm leading-5 text-[#C8DCD1] line-clamp-3 break-all">
                        {item.deskripsi}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[32px] bg-white/90 p-8 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold text-[#0F3926]">
                Artikel Terbaru
              </h2>

              <div className="mt-6 space-y-4">
                {articles.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1 border-l-4 border-[#0F5139] pl-4 pb-3 last:pb-0"
                  >
                    <p className="text-sm font-medium text-[#234936]">
                      {item.title}
                    </p>

                    <span className="text-xs text-[#6B7F74]">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] bg-[#4a7062] p-8 text-white shadow-sm ring-1 ring-black/5">
              <h3 className="text-lg font-semibold">Sebaran Kegiatan</h3>

              <div className="mt-6 h-48 rounded-3xl bg-[#3d5f51] p-4 flex items-center justify-center">
            
            
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}