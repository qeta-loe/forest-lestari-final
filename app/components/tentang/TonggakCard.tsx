"use client"

import { TonggakPencapaian } from "@/lib/queries"

const KATEGORI_STYLE: Record<string, string> = {
  penanaman: "bg-lime-300 text-emerald-950",
  das: "bg-blue-400 text-white",
  kolaborasi: "bg-orange-300 text-emerald-950",
}

type Props = {
  tonggak: TonggakPencapaian
  onClick: (t: TonggakPencapaian) => void
}

export default function TonggakCard({ tonggak, onClick }: Props) {
  const tanggal = new Date(tonggak.tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const coverUrl = tonggak.galeri_urls?.[0] ?? null

  return (
    <article className="relative overflow-hidden rounded-[32px] bg-[#5F6F65] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Teks */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-white/80">{tanggal}</span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${
                KATEGORI_STYLE[tonggak.kategori] ?? "bg-gray-400 text-white"
              }`}
            >
              {tonggak.kategori}
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-bold leading-snug text-white sm:text-3xl">
            {tonggak.judul}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/85">
            {tonggak.ringkasan}
          </p>

          {/* Highlights ringkas */}
          {tonggak.highlights.length > 0 && (
            <p className="mt-4 text-xs font-bold text-white">
              {tonggak.highlights
                .map((h) => `${h.nilai} ${h.label}`)
                .join(" · ")}
            </p>
          )}

          <button
            onClick={() => onClick(tonggak)}
            className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-emerald-900"
          >
            Lihat detail
          </button>
        </div>

        {/* Gambar */}
        <div className="h-60 w-full bg-zinc-300 lg:h-auto">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={tonggak.judul}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-zinc-400" />
          )}
        </div>
      </div>
    </article>
  )
}