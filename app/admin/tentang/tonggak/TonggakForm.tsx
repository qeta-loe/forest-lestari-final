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
  onCancel: () => void
}

export default function TonggakForm({ editingTonggak, onSuccess, onCancel }: Props) {
  const [judul, setJudul] = useState("")
  const [ringkasan, setRingkasan] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [kategori, setKategori] = useState("")
  const [highlights, setHighlights] = useState<Highlight[]>([{ label: "", nilai: "" }])
  const [galeriFiles, setGaleriFiles] = useState<File[]>([])
  const [existingUrls, setExistingUrls] = useState<string[]>([])

  useEffect(() => {
    if (editingTonggak) {
      setJudul(editingTonggak.judul)
      setRingkasan(editingTonggak.ringkasan)
      setTanggal(editingTonggak.tanggal)
      setKategori(editingTonggak.kategori)
      setHighlights(
        editingTonggak.highlights.length > 0
          ? editingTonggak.highlights
          : [{ label: "", nilai: "" }]
      )
      setExistingUrls(editingTonggak.galeri_urls || [])
      setGaleriFiles([])
    } else {
      setJudul("")
      setRingkasan("")
      setTanggal("")
      setKategori("")
      setHighlights([{ label: "", nilai: "" }])
      setGaleriFiles([])
      setExistingUrls([])
    }
  }, [editingTonggak])

  const addHighlight = () => {
    if (highlights.length >= 3) return alert("Maksimal 3 highlight")
    setHighlights((prev) => [...prev, { label: "", nilai: "" }])
  }

  const removeHighlight = (i: number) =>
    setHighlights((prev) => prev.filter((_, idx) => idx !== i))

  const updateHighlight = (
    i: number,
    field: "label" | "nilai",
    value: string
  ) =>
    setHighlights((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [field]: value } : h))
    )

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

  const handleSubmit = async () => {
    if (!judul || !ringkasan || !tanggal || !kategori) {
      return alert("Semua field wajib diisi")
    }

    const validHighlights = highlights.filter((h) => h.label && h.nilai)

    const input: TonggakInput = {
      judul,
      ringkasan,
      tanggal,
      kategori,
      highlights: validHighlights,
    }

    try {
      if (editingTonggak) {
        await updateTonggak(editingTonggak.id, input, galeriFiles, existingUrls)
        alert("Tonggak berhasil diperbarui")
      } else {
        await createTonggak(input, galeriFiles)
        alert("Tonggak berhasil ditambahkan")
      }
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
  const labelClass = "mb-2 block text-sm font-medium text-[#0F5139]"

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F5139] mb-6">
        {editingTonggak ? "Edit Tonggak Pencapaian" : "Tambah Tonggak Pencapaian"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">
        <div>
          <label className={labelClass}>Judul</label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Penanaman 300 Pohon di DAS Cisadane"
            className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tanggal</label>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
              className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Kategori</label>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}
              className={inputClass}>
              <option value="">Pilih kategori</option>
              <option value="penanaman">Penanaman</option>
              <option value="das">DAS</option>
              <option value="kolaborasi">Kolaborasi</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Ringkasan Program</label>
          <textarea value={ringkasan} onChange={(e) => setRingkasan(e.target.value)}
            placeholder="Deskripsi singkat pencapaian..."
            className={`${inputClass} min-h-28`} />
        </div>

        {/* Highlights */}
        <div className="rounded-xl border border-[#0F5139]/10 bg-[#F8FAF8] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[#0F5139]">Highlights</p>
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

        {/* Galeri */}
        <div>
          <label className={labelClass}>
            Galeri Foto ({existingUrls.length + galeriFiles.length}/10)
          </label>

          {/* Existing photos */}
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

          {/* New files preview */}
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
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#0F5139]/20 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm text-[#0F5139]">+ Tambah Foto</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
              <input type="file" accept="image/*" multiple onChange={handleGaleriChange}
                className="hidden" />
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:scale-95 transition text-white px-6 py-2 rounded-xl text-sm">
            {editingTonggak ? "Simpan Perubahan" : "Simpan Tonggak"}
          </button>
          <button onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 active:scale-95 transition text-gray-700 px-6 py-2 rounded-xl text-sm">
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}