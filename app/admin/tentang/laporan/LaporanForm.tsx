"use client"

import { useState, useEffect } from "react"
import { LaporanTahunan, createLaporan, updateLaporan, LaporanInput } from "./laporan.service"

type Props = {
  editingLaporan: LaporanTahunan | null
  onSuccess: () => void
  onCancel: () => void
}

export default function LaporanForm({ editingLaporan, onSuccess, onCancel }: Props) {
  const [tahun, setTahun] = useState("")
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [tanggalPublikasi, setTanggalPublikasi] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDraft, setIsDraft] = useState(true)

  useEffect(() => {
    if (editingLaporan) {
      setTahun(String(editingLaporan.tahun))
      setJudul(editingLaporan.judul)
      setDeskripsi(editingLaporan.deskripsi || "")
      setTanggalPublikasi(editingLaporan.tanggal_publikasi)
      setFile(null)
      setIsDraft(editingLaporan.is_draft)
    } else {
      setTahun("")
      setJudul("")
      setDeskripsi("")
      setTanggalPublikasi("")
      setFile(null)
      setIsDraft(true)
    }
  }, [editingLaporan])

  const handleSubmit = async (draftMode: boolean) => {
    if (!tahun || !judul || !tanggalPublikasi) {
      return alert("Tahun, judul, dan tanggal publikasi wajib diisi")
    }
    if (!editingLaporan && !file) return alert("File PDF wajib diupload")
    if (file && !file.name.toLowerCase().endsWith(".pdf")) {
      return alert("File harus berformat PDF")
    }

    const input: LaporanInput = {
      tahun: Number(tahun),
      judul,
      deskripsi: deskripsi || null,
      tanggal_publikasi: tanggalPublikasi,
    }

    try {
      if (editingLaporan) {
        await updateLaporan(editingLaporan.id, input, file, editingLaporan.file_url, draftMode)
        alert("Laporan berhasil diperbarui")
      } else {
        await createLaporan(input, file!, draftMode)
        alert("Laporan berhasil ditambahkan")
      }
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass = "w-full rounded-xl border p-3"
  const labelClass = "mb-2 block font-medium text-[#0F5139]"

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F5139]">
            Tambah/Edit Laporan
          </h1>
        </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Judul Laporan</label>
            <input
              type="text"
              placeholder="Contoh: Laporan Tahunan - Rekap Dampak dan Program 2024"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tahun</label>
            <input
              type="number"
              placeholder="Contoh: 2024"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tanggal Publikasi</label>
            <input
              type="date"
              value={tanggalPublikasi}
              onChange={(e) => setTanggalPublikasi(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea
              placeholder="Ringkasan isi laporan..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className={`${inputClass} min-h-24`}
            />
          </div>

          <div>
            <label className={labelClass}>
              File PDF {editingLaporan ? "(kosongkan jika tidak diganti)" : ""}
            </label>

            {editingLaporan && !file && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">File saat ini:</span>
                <a
                  href={editingLaporan.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#0F5139] underline hover:text-[#0A3D2A]"
                >
                  Buka PDF
                </a>
              </div>
            )}

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#0F5139]/20 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm text-[#0F5139]">
                {file ? file.name : "Klik untuk pilih file PDF"}
              </span>
              <span className="text-xs text-gray-400 mt-1">Hanya file .pdf</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {tahun && (
            <div className="rounded-xl bg-[#F8FAF8] border border-[#0F5139]/10 p-4">
              <p className="text-xs text-gray-400 mb-2">
                Stats otomatis untuk tahun {tahun} (dihitung saat ditampilkan di publik)
              </p>
              <div className="flex gap-6 text-sm text-[#0F5139]">
                <span>Pohon ditanam → dari tabel pohon</span>
                <span>Relawan aktif → dari tabel relawan</span>
                <span>Program berjalan → dari tabel program</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => handleSubmit(true)}
              className="rounded-xl bg-gray-200 px-6 py-2 transition hover:bg-gray-300 active:scale-95"
            >
              Simpan Draft
            </button>

            <button
              onClick={() => handleSubmit(false)}
              className="rounded-xl bg-emerald-900 px-6 py-2 text-white transition hover:bg-emerald-950 active:scale-95"
            >
              Publish Laporan
            </button>

            {editingLaporan&& (
              <button
                onClick={onCancel}
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