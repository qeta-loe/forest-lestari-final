"use client"

import { Das, deleteDas } from "./das.service"
import { useMemo, useState } from "react"

type Props = {
  dasList: Das[]
  onRefresh: () => void
  onEdit: (das: Das) => void
  setMenu: (menu: "das") => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function DasList({ dasList, onRefresh, onEdit, setMenu }: Props) {
  const [filterStatus, setFilterStatus] = useState<"semua" | "published" | "draft">("semua")

  const filteredDas = useMemo(() => {
    if (filterStatus === "published") {
      return dasList.filter((item) => !item.is_draft)
    }

    if (filterStatus === "draft") {
      return dasList.filter((item) => item.is_draft)
    }

    return dasList
  }, [dasList, filterStatus])

  const handleDelete = async (das: Das) => {
    if (!confirm(`Yakin hapus ${das.nama_das}?`)) return
    try {
      await deleteDas(das.id)
      alert("DAS berhasil dihapus")
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-xl font-semibold text-[#0F5139]">
        Daftar DAS
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
          Semua ({dasList.length})
        </button>

        <button
          onClick={() => setFilterStatus("published")}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            filterStatus === "published"
              ? "border-[#0F5139] bg-[#0F5139] text-white"
              : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
          }`}
        >
          Published ({dasList.filter((d) => !d.is_draft).length})
        </button>

        <button
          onClick={() => setFilterStatus("draft")}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            filterStatus === "draft"
              ? "border-[#0F5139] bg-[#0F5139] text-white"
              : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
          }`}
        >
          Draft ({dasList.filter((d) => d.is_draft).length})
        </button>
      </div>
      </div>

      {filteredDas.length === 0 ? (
        <p className="text-gray-500">Belum ada DAS yang ditambahkan.</p>
      ) : (
        <div className="space-y-4">
          {filteredDas.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#0F5139]">
                        {item.nama_das}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          item.is_draft
                            ? "bg-gray-200 text-gray-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {item.is_draft ? "Draft" : "Published"}
                        </span>

                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          item.kondisi === "baik"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.kondisi}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-gray-600">
                    <p>Luas DAS: <span className="font-medium">{item.luas_ha.toLocaleString()} ha</span></p>
                    <p>Tutupan Hutan: <span className="font-medium">{item.tutupan_hutan_persen}%</span></p>
                    <p>Kemiringan: <span className="font-medium">{item.kemiringan_min}° – {item.kemiringan_max}°</span></p>
                    <p>Panjang Sungai: <span className="font-medium">{item.panjang_sungai_km || "—"} km</span></p>
                    <p>Jenis Tanah: <span className="font-medium">{item.jenis_tanah || "—"}</span></p>
                    <p>Titik Polygon: <span className="font-medium">{item.polygon_coordinates?.length || 0} titik</span></p>
                  </div>

                  {(item.koordinat_hulu || item.koordinat_muara) && (
                    <div className="mt-1 text-xs text-gray-400">
                      {item.koordinat_hulu && <p>Hulu: {item.koordinat_hulu}</p>}
                      {item.koordinat_muara && <p>Muara: {item.koordinat_muara}</p>}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onEdit(item)
                      setMenu("das")
                    }}
                    className="rounded-md bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-md bg-red-600 hover:bg-red-700 active:scale-95 transition-all px-4 py-2 text-sm text-white"
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