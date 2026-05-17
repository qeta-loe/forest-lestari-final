"use client"

import { useState, useEffect } from "react"
import { LaporanTahunan, createLaporan, updateLaporan } from "./laporan.service"

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

  useEffect(() => {
    if (editingLaporan) {
      setTahun(String(editingLaporan.tahun))
      setJudul(editingLaporan.judul)
      setDeskripsi(editingLaporan.deskripsi || "")
      setTanggalPublikasi(editingLaporan.tanggal_publikasi)
      setFile(null)
    } else {
      setTahun("")
      setJudul("")
      setDeskripsi("")
      setTanggalPublikasi("")
      setFile(null)
    }
  }, [editingLaporan])

  const handleSubmit = async () => {
    if (!tahun || !judul || !tanggalPublikasi) {
      return alert("Tahun, judul, dan tanggal publikasi wajib diisi")
    }
    if (!editingLaporan && !file) return alert("File PDF wajib diupload")
    if (file && !file.name.toLowerCase().endsWith(".pdf")) {
      return alert("File harus berformat PDF")
    }

    const input = {
      tahun: Number(tahun),
      judul,
      deskripsi: deskripsi || null,
      tanggal_publikasi: tanggalPublikasi,
    }

    try {
      if (editingLaporan) {
        await updateLaporan(editingLaporan.id, input, file, editingLaporan.file_url)
        alert("Laporan berhasil diperbarui")
      } else {
        await createLaporan(input, file!)
        alert("Laporan berhasil ditambahkan")
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
        {editingLaporan ? "Edit Laporan Tahunan" : "Tambah Laporan Tahunan"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className={labelClass}>Deskripsi (Opsional)</label>
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

        {/* Preview stats otomatis */}
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

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:scale-95 transition text-white px-6 py-2 rounded-xl text-sm"
          >
            {editingLaporan ? "Simpan Perubahan" : "Simpan Laporan"}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 active:scale-95 transition text-gray-700 px-6 py-2 rounded-xl text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}