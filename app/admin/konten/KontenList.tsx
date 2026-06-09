"use client"

import { fetchKontenHalaman } from "@/lib/konten.service"
import { KontenHalaman } from "@/lib/konten.service"

type Props = {
  kontenList: KontenHalaman[]
  onEdit: (konten: KontenHalaman) => void
}

const HALAMAN_LABEL: Record<string, string> = {
  beranda: "Beranda",
  tentang_kami: "Tentang Kami",
}

export default function KontenList({ kontenList, onEdit }: Props) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F5139]">Kelola Konten</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {kontenList.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F5139]">
                {HALAMAN_LABEL[item.halaman] ?? item.halaman}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.is_published
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.is_published ? "Published" : "Draft"}
              </span>
            </div>

            {/* Preview hero image */}
            {item.hero_image_url ? (
              <img
                src={item.hero_image_url}
                alt="Hero"
                className="mb-4 h-32 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-4 flex h-32 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                Belum ada gambar hero
              </div>
            )}

            {/* Info singkat */}
            <div className="mb-4 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium text-[#0F5139]">Badge:</span>{" "}
                {item.badge_text || "—"}
              </p>
              <p>
                <span className="font-medium text-[#0F5139]">Judul:</span>{" "}
                <span className="line-clamp-1">{item.judul || "—"}</span>
              </p>
              <p>
                <span className="font-medium text-[#0F5139]">Deskripsi:</span>{" "}
                <span className="line-clamp-2">{item.deskripsi || "—"}</span>
              </p>
              {item.halaman === "tentang_kami" && (
                <p>
                  <span className="font-medium text-[#0F5139]">Tujuan Strategis:</span>{" "}
                  <span className="line-clamp-2">{item.tujuan_strategis || "—"}</span>
                </p>
              )}
            </div>

            {/* Updated at */}
            {item.updated_at && (
              <p className="mb-4 text-xs text-gray-400">
                Terakhir diupdate:{" "}
                {new Date(item.updated_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}

            <button
              onClick={() => onEdit(item)}
              className="w-full rounded-xl bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
            >
              Edit Konten
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}