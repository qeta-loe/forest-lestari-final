"use client"

import { useState, useEffect } from "react"
import { Program, createProgram, updateProgram } from "./program.service"

type Props = {
  editingProgram: Program | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ProgramForm({ editingProgram, onSuccess, onCancel }: Props) {
  const [namaProgram, setNamaProgram] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [lokasi, setLokasi] = useState("")
  const [penerimManfaat, setPenerimManfaat] = useState("")
  const [realisasi, setRealisasi] = useState("")
  const [status, setStatus] = useState("berjalan")
  const [tahun, setTahun] = useState("")

  useEffect(() => {
    if (editingProgram) {
      setNamaProgram(editingProgram.nama_program)
      setTanggal(editingProgram.tanggal)
      setLokasi(editingProgram.lokasi || "")
      setPenerimManfaat(editingProgram.penerima_manfaat || "")
      setRealisasi(editingProgram.realisasi || "")
      setStatus(editingProgram.status)
      setTahun(String(editingProgram.tahun))
    } else {
      setNamaProgram("")
      setTanggal("")
      setLokasi("")
      setPenerimManfaat("")
      setRealisasi("")
      setStatus("berjalan")
      setTahun("")
    }
  }, [editingProgram])

  // auto-isi tahun dari tanggal
  useEffect(() => {
    if (tanggal) setTahun(String(new Date(tanggal).getFullYear()))
  }, [tanggal])

  const handleSubmit = async () => {
    if (!namaProgram || !tanggal || !tahun) {
      return alert("Nama program, tanggal, dan tahun wajib diisi")
    }

    const input = {
      nama_program: namaProgram,
      tanggal,
      lokasi: lokasi || null,
      penerima_manfaat: penerimManfaat || null,
      realisasi: realisasi || null,
      status,
      tahun: Number(tahun),
    }

    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, input)
        alert("Program berhasil diperbarui")
      } else {
        await createProgram(input)
        alert("Program berhasil ditambahkan")
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
        {editingProgram ? "Edit Program" : "Tambah Program"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">
        <div>
          <label className={labelClass}>Nama Program</label>
          <input
            type="text"
            placeholder="Contoh: Penanaman DAS Cisadane"
            value={namaProgram}
            onChange={(e) => setNamaProgram(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Tahun{" "}
              <span className="text-xs text-gray-400">(otomatis dari tanggal)</span>
            </label>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lokasi (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Bogor, Jabar"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Penerima Manfaat (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: 3 Desa"
              value={penerimManfaat}
              onChange={(e) => setPenerimManfaat(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Realisasi (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: 300 Pohon"
              value={realisasi}
              onChange={(e) => setRealisasi(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="berjalan">Berjalan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:scale-95 transition text-white px-6 py-2 rounded-xl text-sm"
          >
            {editingProgram ? "Simpan Perubahan" : "Simpan Program"}
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