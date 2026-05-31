"use client"

import { useState } from "react"
import { Program, deleteProgram } from "./program.service"

type Props = {
  programList: Program[]
  onRefresh: () => void
  onEdit: (p: Program) => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function ProgramList({ programList, onRefresh, onEdit }: Props) {
  const [filterTahun, setFilterTahun] = useState("")
  const [showTahun, setShowTahun] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua")

  const filteredProgram = programList.filter((item) => {
    const tahunOk =
      !filterTahun || item.tahun === Number(filterTahun)

    const draftOk =
      filterStatus === "semua"
        ? true
        : filterStatus === "draft"
        ? item.is_draft
        : !item.is_draft

    return tahunOk && draftOk
  })

  const handleDelete = async (p: Program) => {
    if (!confirm(`Hapus program "${p.nama_program}"?`)) return
    try {
      await deleteProgram(p.id)
      onRefresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const tahunList = [...new Set(programList.map((p) => p.tahun))].sort(
    (a, b) => b - a
  )

  return (
  <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-[#0F5139]">
          Daftar Program
        </h1>

        <div className="flex flex-wrap gap-2">

          <div className="relative">
            <button
              onClick={() => setShowTahun(!showTahun)}
              className="rounded-full border border-[#0F5139] px-4 py-2 text-sm text-[#0F5139] bg-white flex items-center gap-2"
            >
              {filterTahun ? filterTahun : "Semua Tahun"}

              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showTahun ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showTahun && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setFilterTahun("")
                    setShowTahun(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Semua Tahun
                </button>

                {tahunList.map((tahun) => (
                  <button
                    key={tahun}
                    onClick={() => {
                      setFilterTahun(String(tahun))
                      setShowTahun(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {tahun}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setFilterStatus("semua")}
            className={`rounded-full border px-4 py-2 text-sm ${
              filterStatus === "semua"
                ? "bg-[#0F5139] text-white"
                : "text-[#0F5139] border-[#0F5139]"
            }`}
          >
            Semua ({programList.length})
          </button>

          <button
            onClick={() => setFilterStatus("published")}
            className={`rounded-full border px-4 py-2 text-sm ${
              filterStatus === "published"
                ? "bg-[#0F5139] text-white"
                : "text-[#0F5139] border-[#0F5139]"
            }`}
          >
            Published ({programList.filter((p) => !p.is_draft).length})
          </button>

          <button
            onClick={() => setFilterStatus("draft")}
            className={`rounded-full border px-4 py-2 text-sm ${
              filterStatus === "draft"
                ? "bg-[#0F5139] text-white"
                : "text-[#0F5139] border-[#0F5139]"
            }`}
          >
            Draft ({programList.filter((p) => p.is_draft).length})
          </button>
        </div>
      </div>

      {filteredProgram.length === 0 ? (
        <p className="text-gray-500">Tidak ada program ditemukan.</p>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#0F5139] text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nama Program</th>
                <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                <th className="text-left px-4 py-3 font-medium">Lokasi</th>
                <th className="text-left px-4 py-3 font-medium">Penerima Manfaat</th>
                <th className="text-left px-4 py-3 font-medium">Realisasi</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProgram.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-[#0F5139]">
                    {item.nama_program}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.lokasi || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.penerima_manfaat || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.realisasi || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.is_draft
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.is_draft ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}