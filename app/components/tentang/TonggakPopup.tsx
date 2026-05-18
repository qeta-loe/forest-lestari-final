"use client"

import { useEffect } from "react"
import { TonggakPencapaian } from "@/lib/queries"

const KATEGORI_STYLE: Record<string, string> = {
  penanaman: "bg-lime-300 text-emerald-950",
  das: "bg-blue-400 text-white",
  kolaborasi: "bg-orange-300 text-emerald-950",
}

type Props = {
  tonggak: TonggakPencapaian
  onClose: () => void
}

export default function TonggakPopup({ tonggak, onClose }: Props) {
  // tutup dengan Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const tanggal = new Date(tonggak.tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#5F6F65] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tutup */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* Galeri — scroll snap */}
        {tonggak.galeri_urls.length > 0 && (
          <div className="relative">
            <div
              className="flex snap-x snap-mandatory overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {tonggak.galeri_urls.map((url, i) => (
                <div
                  key={i}
                  className="w-full shrink-0 snap-start"
                >
                  <img
                    src={url}
                    alt={`Galeri ${i + 1}`}
                    className="h-56 w-full object-cover sm:h-72"
                  />
                </div>
              ))}
            </div>

            {/* Indikator jumlah foto */}
            {tonggak.galeri_urls.length > 1 && (
              <div className="absolute bottom-3 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {tonggak.galeri_urls.length} foto
              </div>
            )}
          </div>
        )}

        {/* Konten */}
        <div className="p-6 sm:p-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-white/70">{tanggal}</span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${
                KATEGORI_STYLE[tonggak.kategori] ?? "bg-gray-400 text-white"
              }`}
            >
              {tonggak.kategori}
            </span>
          </div>

          {/* Judul */}
          <h2 className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
            {tonggak.judul}
          </h2>

          {/* Highlights */}
          {tonggak.highlights.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {tonggak.highlights.map((h, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-center"
                >
                  <p className="text-lg font-bold text-white">{h.nilai}</p>
                  <p className="text-xs text-white/70">{h.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Ringkasan */}
          <p className="mt-5 text-sm leading-7 text-white/85">
            {tonggak.ringkasan}
          </p>
        </div>
      </div>
    </div>
  )
}