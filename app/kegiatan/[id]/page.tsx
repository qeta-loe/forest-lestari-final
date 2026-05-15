"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Kegiatan {
  id: string;
  nama: string;
  deskripsi: string;
  image_url?: string;
}

export default function DetailKegiatanPage() {
  const params = useParams()
  const id = params.id as string

  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDetailKegiatan = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.log("DETAIL KEGIATAN ERROR:", error)
      setKegiatan(null)
      setLoading(false)
      return
    }

    setKegiatan(data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) {
      fetchDetailKegiatan()
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
        <div className="mx-auto max-w-[1000px] px-4 py-10 lg:px-10">
          <div className="flex h-[360px] items-center justify-center rounded-[32px] bg-white shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-[#4D6B57]">Memuat kegiatan...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!kegiatan) {
    return (
      <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
        <div className="mx-auto max-w-[1000px] px-4 py-10 lg:px-10">
          <div className="rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <h1 className="text-2xl font-semibold text-[#0F3926]">
              Kegiatan tidak ditemukan
            </h1>

            <Link
              href="/kegiatan"
              className="mt-6 inline-flex rounded-full bg-[#0F5139] px-5 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0A3D2A] active:scale-95"
            >
              Kembali ke Kegiatan
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      <div className="mx-auto max-w-[1000px] px-4 py-10 lg:px-10">
        <Link
          href="/kegiatan"
          className="mb-6 inline-flex rounded-full border border-[#0F5139] bg-white px-5 py-2 text-sm font-semibold text-[#0F5139] transition-all duration-150 hover:bg-[#eef7f1] active:scale-95"
        >
          ← Kembali
        </Link>

        <article className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-black/5">
          {kegiatan.image_url ? (
            <img
              src={kegiatan.image_url}
              alt={kegiatan.nama}
              className="h-[280px] w-full object-cover sm:h-[420px]"
            />
          ) : (
            <div className="h-[280px] w-full bg-[#4a7062] sm:h-[420px]" />
          )}

          <div className="p-6 sm:p-10">
            <h1 className="text-center mt-3 text-3xl font-semibold leading-tight text-[#0F3926] sm:text-4xl">
              {kegiatan.nama}
            </h1>

            <p className="mt-6 whitespace-pre-line break-words text-sm leading-7 text-[#4D6B57] sm:text-base">
              {kegiatan.deskripsi}
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}