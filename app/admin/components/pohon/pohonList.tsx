"use client"

import { useState, useMemo } from "react"
import { PohonWithRelasi, deletePohon } from "./pohon.service"

type Props = {
  pohonList: PohonWithRelasi[]
  onRefresh: () => void
  onEdit: (pohon: PohonWithRelasi) => void
  setMenu: (menu: "pohon") => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function PohonList({ pohonList, onRefresh, onEdit, setMenu }: Props) {
  const [filterStatus, setFilterStatus] = useState<"semua" | "published" | "draft">("semua")
  const filteredList = useMemo(() => {
  if (filterStatus === "published") return pohonList.filter(p => !p.is_draft)
  if (filterStatus === "draft") return pohonList.filter(p => p.is_draft)
  return pohonList
}, [filterStatus, pohonList])

  const totalDraft = pohonList.filter(p => p.is_draft).length
  const totalPublished = pohonList.filter(p => !p.is_draft).length
  
  const handleDelete = async (pohon: PohonWithRelasi) => {
    if (!confirm(`Yakin hapus ${pohon.nama_umum}?`)) return

    try {
      await deletePohon(pohon.id)
      alert("Pohon berhasil dihapus")
      onRefresh()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus pohon"
      alert(message)
    }
  }

  const totalPohon = pohonList.reduce((sum, p) => {
    return sum + Number(p.jumlah || 0)
  }, 0)

  const jenisTerbanyak = pohonList.reduce<PohonWithRelasi | null>(
    (max, p) => {
      if (!max) return p
      return Number(p.jumlah || 0) > Number(max.jumlah || 0) ? p : max
    },
    null
  )

  const filteredPohon = useMemo(() => {
    if (filterStatus === "published") {
      return pohonList.filter((p) => !p.is_draft)
    }

    if (filterStatus === "draft") {
      return pohonList.filter((p) => p.is_draft)
    }

    return pohonList
  }, [pohonList, filterStatus])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-[#0F5139]">
          Daftar Pohon
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
            Semua ({pohonList.length})
          </button>

          <button
            onClick={() => setFilterStatus("published")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filterStatus === "published"
                ? "border-[#0F5139] bg-[#0F5139] text-white"
                : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
            }`}
          >
            Published ({pohonList.filter(p => !p.is_draft).length})
          </button>

          <button
            onClick={() => setFilterStatus("draft")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filterStatus === "draft"
                ? "border-[#0F5139] bg-[#0F5139] text-white"
                : "border-[#0F5139] bg-white text-[#0F5139] hover:bg-[#0F5139]/10"
            }`}
          >
            Draft ({pohonList.filter(p => p.is_draft).length})
          </button>
        </div>
      </div>

      {pohonList.length === 0 ? (
        <p className="text-gray-500">Belum ada pohon yang ditambahkan.</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500">Total Pohon Tercatat</p>
              <p className="text-3xl font-bold text-[#0F5139]">
                {totalPohon}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-gray-500">Jenis Pohon</p>
              <p className="text-3xl font-bold text-[#0F5139]">
                {pohonList.length}
              </p>
            </div>

            {jenisTerbanyak && (
              <div className="col-span-2 rounded-xl border bg-white p-4 md:col-span-1">
                <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                <p className="text-xl font-bold text-[#0F5139]">
                  {jenisTerbanyak.nama_umum}
                </p>
                <p className="text-sm text-gray-500">
                  {jenisTerbanyak.jumlah} individu
                </p>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#0F5139] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Nama Umum
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Nama Ilmiah
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Lokasi Penanaman
                  </th>
                  <th className="px-4 py-3 text-left font-medium">DAS</th>
                  <th className="px-4 py-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPohon.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#0F5139]">
                      {item.nama_umum}

                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        item.is_draft
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {item.is_draft ? "Draft" : "Published"}
                      </span>
                    </td>

                    <td className="px-4 py-3 italic text-gray-500">
                      {item.nama_ilmiah || "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full border border-black px-3 py-0.5 font-medium text-[#0F5139]">
                        {item.jumlah}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.lokasi_penanaman?.nama_lokasi || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.das?.nama_das || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                          onEdit(item)
                          setMenu("pohon")
                        }}
                          className="rounded bg-yellow-500 px-3 py-1 text-xs text-white transition hover:bg-yellow-600 active:scale-95"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700 active:scale-95"
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
        </>
      )}
    </div>
  )
}