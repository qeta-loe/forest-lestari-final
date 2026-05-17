"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type TargetKegiatan = {
  nama_target: string
  isi_target: string
}

type Kegiatan = {
  id: number
  nama_kegiatan: string
  alamat: string | null
  kabupaten_kota: string | null
  provinsi: string | null
  tanggal_mulai: string | null
  jam_mulai: string | null
  jam_selesai: string | null
  kategori: string | null
  status_kegiatan: string | null
  deskripsi_kegiatan: string | null
  tujuan_kegiatan: string | null
  link_pendaftaran: string | null
  targets: TargetKegiatan[] | null
  hasil_kegiatan: string | null
  press_release: string | null
  is_draft: boolean | null
  updated_at: string | null
  thumbnail_url: string | null
  draft_status: string | null
  slug: string | null
}

function formatDate(date?: string | null) {
  if (!date) return "Tanggal belum tersedia"

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function KegiatanDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKegiatanDetail = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("kegiatan")
        .select(
          "id, nama_kegiatan, alamat, kabupaten_kota, provinsi, tanggal_mulai, jam_mulai, jam_selesai, kategori, status_kegiatan, deskripsi_kegiatan, tujuan_kegiatan, link_pendaftaran, targets, hasil_kegiatan, press_release, is_draft, updated_at, thumbnail_url, draft_status, slug"
        )
        .eq("id", Number(id))
        .eq("is_draft", false)
        .single()

      if (error) {
        console.error(error.message)
        setKegiatan(null)
        setLoading(false)
        return
      }

      setKegiatan(data as Kegiatan)
      setLoading(false)
    }

    if (id) {
      fetchKegiatanDetail()
    }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F6EF] px-4 text-[#0F5139]">
        Memuat detail kegiatan...
      </main>
    )
  }

  if (!kegiatan) {
    return (
      <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-emerald-900">
            Kegiatan tidak ditemukan
          </h1>

          <Link
            href="/kegiatan"
            className="mt-6 inline-block text-sm font-semibold text-emerald-900 hover:underline"
          >
            ← Kembali ke daftar kegiatan
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/kegiatan"
          className="mb-8 inline-block text-sm font-semibold text-emerald-900 hover:underline"
        >
          ← Kembali ke kegiatan
        </Link>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-emerald-950 bg-stone-50 px-4 py-2 text-sm text-emerald-900">
            {kegiatan.kategori || "Tanpa Kategori"}
          </span>

          <span className="rounded-full bg-emerald-900 px-4 py-2 text-sm text-white">
            {kegiatan.status_kegiatan || "Status tidak tersedia"}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight text-emerald-900 sm:text-5xl">
          {kegiatan.nama_kegiatan}
        </h1>

        <div className="mb-8 flex flex-wrap gap-4 text-sm text-emerald-900">
          <span>📅 {formatDate(kegiatan.tanggal_mulai)}</span>

          <span>
            🕒 {kegiatan.jam_mulai || "-"} - {kegiatan.jam_selesai || "-"}
          </span>

          <span>
            📍 {kegiatan.kabupaten_kota || "-"}, {kegiatan.provinsi || "-"}
          </span>
        </div>

        {kegiatan.thumbnail_url && (
          <img
            src={kegiatan.thumbnail_url}
            alt={kegiatan.nama_kegiatan}
            className="mb-10 h-72 w-full rounded-3xl object-cover sm:h-96"
          />
        )}

        <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-emerald-900">
            Deskripsi Kegiatan
          </h2>

          <p className="leading-8 text-emerald-900">
            {kegiatan.deskripsi_kegiatan || "Deskripsi belum tersedia."}
          </p>
        </section>

        {kegiatan.tujuan_kegiatan && (
          <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-2xl font-bold text-emerald-900">
              Tujuan Kegiatan
            </h2>

            <p className="leading-8 text-emerald-900">
              {kegiatan.tujuan_kegiatan}
            </p>
          </section>
        )}

        {kegiatan.targets && kegiatan.targets.length > 0 && (
          <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-2xl font-bold text-emerald-900">
              Target Kegiatan
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {kegiatan.targets.map((target, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-emerald-900/20 bg-[#F7F6EF] p-5"
                >
                  <h3 className="mb-2 font-bold text-emerald-900">
                    {target.nama_target}
                  </h3>

                  <p className="text-sm leading-7 text-emerald-900">
                    {target.isi_target}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {kegiatan.status_kegiatan === "completed" && (
          <>
            {kegiatan.hasil_kegiatan && (
              <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 text-2xl font-bold text-emerald-900">
                  Hasil Kegiatan
                </h2>

                <p className="leading-8 text-emerald-900">
                  {kegiatan.hasil_kegiatan}
                </p>
              </section>
            )}

            {kegiatan.press_release && (
              <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 text-2xl font-bold text-emerald-900">
                  Press Release
                </h2>

                <p className="leading-8 text-emerald-900">
                  {kegiatan.press_release}
                </p>
              </section>
            )}
          </>
        )}

        {kegiatan.link_pendaftaran && kegiatan.status_kegiatan !== "completed" && (
          <a
            href={kegiatan.link_pendaftaran}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-xl bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950 active:scale-95"
          >
            Daftar Kegiatan
          </a>
        )}
      </article>
    </main>
  )
}