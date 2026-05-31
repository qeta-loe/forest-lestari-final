"use client"

import { LokasiPenanaman } from "./lokasi.service"
import { useMemo, useState } from "react"

type Props = {
  lokasiPenanaman: LokasiPenanaman[]
  onEdit: (item: LokasiPenanaman) => void
  onDelete: (id: number) => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function LokasiList({ lokasiPenanaman, onEdit, onDelete }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua")

  const filteredLokasi = useMemo(() => {
    if (filterStatus === "published") {
      return lokasiPenanaman.filter((l) => !l.is_draft)
    }
    if (filterStatus === "draft") {
      return lokasiPenanaman.filter((l) => l.is_draft)
    }
    return lokasiPenanaman
  }, [lokasiPenanaman, filterStatus])

  const totalPublished = lokasiPenanaman.filter(
    (item) => !item.is_draft
  ).length

  const totalDraft = lokasiPenanaman.filter(
    (item) => item.is_draft
  ).length

  return (
  <div>
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-xl font-semibold text-[#0F5139]">
          Daftar Lokasi Penanaman
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
          Semua ({lokasiPenanaman.length})
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

    {filteredLokasi.length === 0 ? (
      <p className="text-gray-500">
        Belum ada lokasi penanaman pada status ini.
      </p>
    ) : (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredLokasi.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-52 w-full items-center justify-center bg-[#0F5139]/10">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Polygon Area
                </p>

                <p className="mt-2 text-2xl font-bold text-[#0F5139]">
                  {item.polygon_coordinates?.length || 0}
                </p>

                <p className="text-xs text-gray-500">
                  titik polygon
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#0F5139]">
                  {item.nama_lokasi}
                </h2>

                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.status_lokasi === "aktif"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status_lokasi}
                  </span>

                  <span className="rounded-full bg-[#0F5139]/10 px-3 py-1 text-xs text-[#0F5139]">
                    {item.luas_area} ha
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                    {item.jumlah_bibit} bibit
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <a
                  href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A]"
                >
                  Buka Maps
                </a>

                <button 
                onClick={() => onEdit(item)}
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600">
                  Edit
                </button>

                <button 
                onClick={() => onDelete(item.id)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}