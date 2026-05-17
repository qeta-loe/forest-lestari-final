"use client"

import { useMemo, useState } from "react"
import { Artikel } from "./artikel.service"

type Props = {
  artikel: Artikel[]
  onEdit: (artikel: Artikel) => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function ArtikelList({ artikel, onEdit }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua")

  const filteredArtikel = useMemo(() => {
    if (filterStatus === "published") {
      return artikel.filter((item) => !item.is_draft)
    }

    if (filterStatus === "draft") {
      return artikel.filter((item) => item.is_draft)
    }

    return artikel
  }, [artikel, filterStatus])

  const totalPublished = artikel.filter((item) => !item.is_draft).length
  const totalDraft = artikel.filter((item) => item.is_draft).length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-[#0F5139]">
          Daftar Artikel
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("semua")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filterStatus === "semua"
                ? "border-[#0F5139] bg-[#0F5139] text-white"
                : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
            }`}
          >
            Semua ({artikel.length})
          </button>

          <button
            onClick={() => setFilterStatus("published")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filterStatus === "published"
                ? "border-[#0F5139] bg-[#0F5139] text-white"
                : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
            }`}
          >
            Published ({totalPublished})
          </button>

          <button
            onClick={() => setFilterStatus("draft")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filterStatus === "draft"
                ? "border-[#0F5139] bg-[#0F5139] text-white"
                : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
            }`}
          >
            Draft ({totalDraft})
          </button>
        </div>
      </div>

      {filteredArtikel.length === 0 ? (
        <p className="text-gray-500">
          Belum ada artikel pada status ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArtikel.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.judul}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                  Tidak ada gambar
                </div>
              )}

              <div className="p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0F5139]/10 px-3 py-1 text-xs text-[#0F5139]">
                    {item.kategori || "Tanpa kategori"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.is_draft
                        ? "bg-gray-200 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.is_draft ? "Draft" : "Published"}
                  </span>
                </div>

                <h2 className="mb-2 font-semibold text-[#0F5139]">
                  {item.judul}
                </h2>

                <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                  {item.deskripsi_singkat}
                </p>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>Penulis: {item.penulis || "-"}</p>

                  <p>
                    Tanggal Publikasi:{" "}
                    {item.tanggal_publikasi
                      ? new Date(item.tanggal_publikasi).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </p>

                  <p>
                    Last Modified:{" "}
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white transition hover:bg-yellow-600 active:scale-95"
                  >
                    {item.is_draft ? "Edit Draft" : "Edit Artikel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}