"use client"

import { useState, useEffect } from "react"
import {
  TonggakPencapaian,
  TonggakInput,
  Highlight,
  createTonggak,
  updateTonggak,
} from "./tonggak.service"

type Props = {
  editingTonggak: TonggakPencapaian | null
  onSuccess: () => void
  onCancelEdit: () => void
}

const defaultHighlight: Highlight = { label: "", nilai: "" }

export default function TonggakForm({ editingTonggak, onSuccess, onCancelEdit }: Props) {
  const [judul, setJudul] = useState("")
  const [ringkasan, setRingkasan] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [kategori, setKategori] = useState("")
  const [highlights, setHighlights] = useState<Highlight[]>([defaultHighlight])
  const [galeriFiles, setGaleriFiles] = useState<File[]>([])
  const [existingUrls, setExistingUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showKategori, setShowKategori] = useState(false)

  useEffect(() => {
    if (editingTonggak) {
      setJudul(editingTonggak.judul)
      setRingkasan(editingTonggak.ringkasan)
      setTanggal(editingTonggak.tanggal)
      setKategori(editingTonggak.kategori)
      setHighlights(
        editingTonggak.highlights?.length 
          ? editingTonggak.highlights
          : [defaultHighlight]
      )
      setExistingUrls(editingTonggak.galeri_urls || [])
      setGaleriFiles([])
    } else {
      resetForm()
    }
  }, [editingTonggak])

  const resetForm = () => {
    setJudul("")
    setRingkasan("")
    setTanggal("")
    setKategori("")
    setHighlights([defaultHighlight])
    setGaleriFiles([])
    setExistingUrls([])
  }

  const inputClass = "w-full rounded-xl border p-3"
  const labelClass = "mb-2 block font-medium text-[#0F5139]"
 
  const addHighlight = () => {
    if (highlights.length >= 3) return alert("Maksimal 3 highlight")
    setHighlights((prev) => [...prev, { label: "", nilai: "" }])
  }

  const updateHighlight = (
    i: number,
    field: "label" | "nilai",
    value: string
  ) => {
    setHighlights((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [field]: value } : h))
    )
  }

  const removeHighlight = (i: number) =>
    setHighlights((prev) => prev.filter((_, idx) => idx !== i))

  const handleGaleriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const total = existingUrls.length + galeriFiles.length + files.length
    if (total > 10) return alert("Maksimal 10 foto galeri")
    setGaleriFiles((prev) => [...prev, ...files])
  }

  const removeExistingUrl = (url: string) =>
    setExistingUrls((prev) => prev.filter((u) => u !== url))

  const removeNewFile = (i: number) =>
    setGaleriFiles((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (isDraft: boolean) => {
    if (!judul || !ringkasan || !tanggal || !kategori) {
      return alert("Semua field wajib diisi")
    }

    const validHighlights = highlights.filter(
      (h) => h.label.trim() && h.nilai.trim()
    )

    const payload: TonggakInput = {
      judul,
      ringkasan,
      tanggal,
      kategori,
      highlights: validHighlights,
      is_draft: isDraft,
    }

    try {
      setLoading(true)
      if (editingTonggak) {
        await updateTonggak(editingTonggak.id, payload, galeriFiles, existingUrls)
        alert("Tonggak berhasil diperbarui")
        onCancelEdit()
      } else {
        await createTonggak(payload, galeriFiles)
      }
      alert(
        isDraft
          ? "Draft berhasil disimpan"
          : "Tonggak berhasil dipublish"
      )
      resetForm()
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F5139]">
            Tambah/Edit Tonggak Pencapaian
          </h1>
        </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Judul</label>
            <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Penanaman 300 Pohon di DAS Cisadane"
              className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Tanggal
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <div>
              <label className={labelClass}>
                Kategori
                </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowKategori(!showKategori)}
                  className={`${inputClass} flex items-center justify-between`}
                >
                  <span>
                    {kategori
                      ? kategori.charAt(0).toUpperCase() + kategori.slice(1)
                      : "Pilih kategori"}
                  </span>

                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showKategori ? "rotate-180" : ""
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

                {showKategori && (
                  <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-lg">

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("penanaman")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Penanaman
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("das")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      DAS
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setKategori("kolaborasi")
                        setShowKategori(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Kolaborasi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Ringkasan Program</label>
          <textarea value={ringkasan} onChange={(e) => setRingkasan(e.target.value)}
            placeholder="Deskripsi singkat pencapaian..."
            className={`${inputClass} min-h-28`} />
        </div>

        <div className="rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-md font-semibold text-[#0F5139]">Highlights</p>
              <p className="text-xs text-gray-400">Maksimal 3 highlight</p>
            </div>
            {highlights.length < 3 && (
              <button onClick={addHighlight}
                className="text-xs bg-[#0F5139] text-white px-3 py-1.5 rounded-lg hover:bg-[#0A3D2A]">
                + Tambah
              </button>
            )}
          </div>

          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Label</label>
                  <input type="text" value={h.label}
                    onChange={(e) => updateHighlight(i, "label", e.target.value)}
                    placeholder="Contoh: Pohon ditanam"
                    className="w-full rounded-lg border border-[#0F5139]/20 px-3 py-2 text-sm text-[#0F5139] outline-none focus:border-[#0F5139]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nilai</label>
                  <input type="text" value={h.nilai}
                    onChange={(e) => updateHighlight(i, "nilai", e.target.value)}
                    placeholder="Contoh: 300"
                    className="w-full rounded-lg border border-[#0F5139]/20 px-3 py-2 text-sm text-[#0F5139] outline-none focus:border-[#0F5139]" />
                </div>
                {highlights.length > 1 && (
                  <button onClick={() => removeHighlight(i)}
                    className="text-xs bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Galeri Foto ({existingUrls.length + galeriFiles.length}/10)
          </label>

          {existingUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {existingUrls.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button onClick={() => removeExistingUrl(url)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {galeriFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {galeriFiles.map((f, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(f)} alt=""
                    className="w-20 h-20 object-cover rounded-lg opacity-70" />
                  <button onClick={() => removeNewFile(i)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    ✕
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/40 text-white rounded-b-lg py-0.5">
                    Baru
                  </span>
                </div>
              ))}
            </div>
          )}

          {existingUrls.length + galeriFiles.length < 10 && (
            <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 hover:bg-[#F5F5F5]">
              <span className="text-sm text-[#0F5139]">+ Tambah Foto</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
              <input type="file" accept="image/*" multiple onChange={handleGaleriChange}
                className="hidden" />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-5">
          <button
            onClick={() => handleSubmit(true)}
            className="rounded-xl bg-gray-300 px-6 py-3 transition active:scale-95 hover:bg-gray-400"
          >
            {editingTonggak ? "Update Draft" : "Simpan Draft"}
          </button>

          <button
            onClick={() => handleSubmit(false)}
            className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition active:scale-95 hover:bg-[#0A3D2A]"
          >
            {editingTonggak ? "Update & Publish" : "Publish Tonggak"}
          </button>

          {editingTonggak && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                onCancelEdit()
              }}
              className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}