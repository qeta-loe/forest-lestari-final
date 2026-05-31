"use client"

import { useState, useEffect } from "react"
import { Program, ProgramInput, createProgram, updateProgram } from "./program.service"

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
  const [showStatus, setShowStatus] = useState(false)

  const resetForm = () => {
    setNamaProgram("")
    setTanggal("")
    setLokasi("")
    setPenerimManfaat("")
    setRealisasi("")
    setStatus("berjalan")
    setTahun("")
  }

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
      resetForm()
    }
  }, [editingProgram])

  useEffect(() => {
    if (tanggal) setTahun(String(new Date(tanggal).getFullYear()))
  }, [tanggal])

  const handleSubmit = async (isDraft: boolean) => {
    if (!namaProgram || !tanggal || !tahun) {
      return alert("Nama program, tanggal, dan tahun wajib diisi")
    }

    const input: ProgramInput = {
      nama_program: namaProgram,
      tanggal,
      lokasi: lokasi || null,
      penerima_manfaat: penerimManfaat || null,
      realisasi: realisasi || null,
      status,
      tahun: Number(tahun),
      is_draft: isDraft
    }

    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, input)
        alert("Program berhasil diperbarui")
      } else {
        await createProgram(input)
        alert("Program berhasil ditambahkan")
      }
      resetForm()
      onSuccess()

      if (editingProgram) {
        onCancel()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSaveDraft = async () => {
    await handleSubmit(true)
  }

  const inputClass = "w-full rounded-xl border p-3"
  const labelClass = "mb-2 block font-medium text-[#0F5139]"

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F5139]">
            Tambah/Edit Program
          </h1>
        </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nama Program</label>
            <input
              type="text"
              placeholder="Contoh: Penanaman DAS Cisadane"
              value={namaProgram}
              onChange={(e) => setNamaProgram(e.target.value)}
              className={inputClass}
            />
          </div>

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
              <label className={labelClass}>Lokasi</label>
              <input
                type="text"
                placeholder="Contoh: Bogor, Jabar"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Penerima Manfaat</label>
              <input
                type="text"
                placeholder="Contoh: 3 Desa"
                value={penerimManfaat}
                onChange={(e) => setPenerimManfaat(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Realisasi</label>
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

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatus(!showStatus)}
                  className={`${inputClass} flex items-center justify-between`}
                >
                  <span>
                    {status === "berjalan" ? "Berjalan" : "Selesai"}
                  </span>

                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showStatus ? "rotate-180" : ""
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

                {showStatus && (
                  <div className="absolute left-0 right-0 mt-2 rounded-xl border bg-white shadow-lg z-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("berjalan")
                        setShowStatus(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Berjalan
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStatus("selesai")
                        setShowStatus(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      Selesai
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSaveDraft}
              className="rounded-xl bg-gray-200 px-6 py-2 transition hover:bg-gray-300 active:scale-95"
            >
              {editingProgram ? "Update Draft" : "Simpan Draft"}
            </button>

            <button
              onClick={() => handleSubmit(false)}
              className="rounded-xl bg-emerald-900 px-6 py-2 text-white transition hover:bg-emerald-950 active:scale-95"
            >
              {editingProgram ? "Update & Publish" : "Publish Program"}
            </button>

            {editingProgram && (
              <button
                onClick={() => {
                  resetForm()
                  onCancel()
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