"use client"

import { useMemo, useState } from "react"
import { Kegiatan, deleteKegiatan } from "./kegiatan.service"

type Props = {
  kegiatan: Kegiatan[]
  onEdit: (item: Kegiatan) => void
  onDelete: (id: number) => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function KegiatanList({ kegiatan, onEdit, onDelete }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua")

  const filteredKegiatan = useMemo(() => {
    if (filterStatus === "published") {
      return kegiatan.filter((item) => !item.is_draft)
    }

    if (filterStatus === "draft") {
      return kegiatan.filter((item) => item.is_draft)
    }

    return kegiatan
  }, [kegiatan, filterStatus])

  const totalPublished = kegiatan.filter(
    (item) => !item.is_draft
  ).length

  const totalDraft = kegiatan.filter(
    (item) => item.is_draft
  ).length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-[#0F5139]">
          Daftar Kegiatan
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
            Semua ({kegiatan.length})
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

      {filteredKegiatan.length === 0 ? (
        <p className="text-gray-500">
          Belum ada kegiatan pada status ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredKegiatan.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.nama_kegiatan}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 w-full items-center justify-center bg-gray-300 text-sm text-gray-600">
                  Tidak ada thumbnail
                </div>
              )}

              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0F5139]/10 px-3 py-1 text-xs text-[#0F5139]">
                    {item.kategori || "Tanpa kategori"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.status_kegiatan === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status_kegiatan || "unknown"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.is_draft
                        ? "bg-gray-200 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.is_draft ? "draft" : "published"}
                  </span>
                </div>

                <h2 className="mb-2 text-lg font-semibold text-[#0F5139]">
                  {item.nama_kegiatan}
                </h2>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {item.status_kegiatan === "completed"
                    ? item.hasil_kegiatan || item.deskripsi_kegiatan || "-"
                    : item.deskripsi_kegiatan || "-"}
                </p>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>
                    {item.kabupaten_kota || "-"}, {item.provinsi || "-"}
                  </p>

                  <p>
                    {item.tanggal_mulai
                      ? new Date(item.tanggal_mulai).toLocaleDateString("id-ID")
                      : "Tanggal belum diisi"}
                  </p>

                  <p>
                    Last Modified:{" "}
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600 active:scale-95"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 active:scale-95"
                  >
                    Hapus
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