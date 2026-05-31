"use client"
import { useMemo, useState } from "react"
import { TonggakPencapaian, deleteTonggak } from "./tonggak.service"

const KATEGORI_COLOR: Record<string, string> = {
  penanaman: "bg-lime-200 text-lime-800",
  das: "bg-blue-200 text-blue-800",
  kolaborasi: "bg-orange-200 text-orange-800",
}

type Props = {
  tonggakList: TonggakPencapaian[]
  onRefresh: () => void
  onEdit: (t: TonggakPencapaian) => void
}

type FilterStatus = "semua" | "published" | "draft"

export default function TonggakList({ tonggakList, onRefresh, onEdit }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua")

  const handleDelete = async (t: TonggakPencapaian) => {
    if (!confirm(`Hapus "${t.judul}"?`)) return
    try {
      await deleteTonggak(t.id, t.galeri_urls)
      onRefresh()
    } catch (err: any) { alert(err.message) }
  }

  const filteredTonggak = useMemo(() => {
    if (filterStatus === "published") return tonggakList.filter(t => !t.is_draft)
    if (filterStatus === "draft") return tonggakList.filter(t => t.is_draft)
    return tonggakList
  }, [tonggakList, filterStatus])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-semibold text-[#0F5139]">
            Daftar Tonggak Pencapaian
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("semua")}
              className={`rounded-full border px-4 py-2 text-sm ${
                filterStatus === "semua"
                  ? "bg-[#0F5139] text-white"
                  : "text-[#0F5139] border-[#0F5139]"
              }`}
            >
              Semua ({tonggakList.length})
            </button>

            <button
              onClick={() => setFilterStatus("published")}
              className={`rounded-full border px-4 py-2 text-sm ${
                filterStatus === "published"
                  ? "bg-[#0F5139] text-white"
                  : "text-[#0F5139] border-[#0F5139]"
              }`}
            >
              Published ({tonggakList.filter(t => !t.is_draft).length})
            </button>

            <button
              onClick={() => setFilterStatus("draft")}
              className={`rounded-full border px-4 py-2 text-sm ${
                filterStatus === "draft"
                  ? "bg-[#0F5139] text-white"
                  : "text-[#0F5139] border-[#0F5139]"
              }`}
            >
              Draft ({tonggakList.filter(t => t.is_draft).length})
            </button>
          </div>
        </div>

      {tonggakList.length === 0 ? (
        <p className="text-gray-500">Belum ada tonggak pencapaian.</p>
      ) : (
        <div className="space-y-3">
          {filteredTonggak.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${KATEGORI_COLOR[item.kategori] || "bg-gray-200 text-gray-700"}`}>
                      {item.kategori}
                    </span>

                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.is_draft
                        ? "bg-gray-200 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {item.is_draft ? "Draft" : "Published"}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="font-semibold text-[#0F5139]">{item.judul}</h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.ringkasan}</p>
                  <div className="flex gap-3 mt-2">
                    {item.highlights.map((h, i) => (
                      <span key={i} className="text-xs text-gray-600">
                        <span className="font-bold">{h.nilai}</span> {h.label}
                      </span>
                    ))}
                  </div>
                  {item.galeri_urls.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{item.galeri_urls.length} foto galeri</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">
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