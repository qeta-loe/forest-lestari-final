"use client"

import { useState, useEffect } from "react"
import {
  Pohon,
  PohonInput,
  createPohon,
  updatePohon,
  fetchLokasiOptions,
  fetchDasOptions,
} from "./pohon.service"

type Props = {
  editingPohon: Pohon | null
  onSuccess: () => void
  onCancelEdit: () => void
}

export default function PohonForm({ editingPohon, onSuccess, onCancelEdit }: Props) {
  const [namaUmum, setNamaUmum] = useState("")
  const [namaIlmiah, setNamaIlmiah] = useState("")
  const [jumlah, setJumlah] = useState("")
  const [lokasiId, setLokasiId] = useState<string>("")
  const [dasId, setDasId] = useState<string>("")

  const [lokasiOptions, setLokasiOptions] = useState<{ id: number; nama_lokasi: string }[]>([])
  const [dasOptions, setDasOptions] = useState<{ id: number; nama_das: string }[]>([])
  const [isDraft, setIsDraft] = useState(false)
  const [showLokasi, setShowLokasi] = useState(false)
  const [showDas, setShowDas] = useState(false)

  useEffect(() => {
    fetchLokasiOptions().then(setLokasiOptions).catch(console.error)
    fetchDasOptions().then(setDasOptions).catch(console.error)
  }, [])

  useEffect(() => {
    if (editingPohon) {
      setNamaUmum(editingPohon.nama_umum)
      setNamaIlmiah(editingPohon.nama_ilmiah || "")
      setJumlah(String(editingPohon.jumlah))
      setLokasiId(editingPohon.lokasi_penanaman_id ? String(editingPohon.lokasi_penanaman_id) : "")
      setDasId(editingPohon.das_id ? String(editingPohon.das_id) : "")
      setIsDraft(editingPohon.is_draft || false)
    } else {
      resetForm()
    }
  }, [editingPohon])

  const resetForm = () => {
    setNamaUmum("")
    setNamaIlmiah("")
    setJumlah("")
    setLokasiId("")
    setDasId("")
  }

  const handleSubmit = async (isDraft: boolean) => {
    if (!namaUmum || !jumlah) return alert("Nama umum dan jumlah wajib diisi")
    if (!lokasiId && !dasId) return alert("Pilih minimal satu relasi: Lokasi Penanaman atau DAS")

    const input: PohonInput & { is_draft: boolean } = {
      nama_umum: namaUmum,
      nama_ilmiah: namaIlmiah,
      jumlah: Number(jumlah),
      lokasi_penanaman_id: lokasiId ? Number(lokasiId) : null,
      das_id: dasId ? Number(dasId) : null,
      is_draft: isDraft,
    }

    try {
      if (editingPohon) {
        await updatePohon(editingPohon.id, input)
        alert("Pohon berhasil diperbarui")
        onCancelEdit()
      } else {
        await createPohon(input)
        alert(isDraft ? "Draft berhasil disimpan" : "Pohon berhasil dipublish")
      }
      resetForm()
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSaveDraft = async () => {
    if (!namaUmum || !jumlah) return alert("Nama umum dan jumlah wajib diisi")

    const input: PohonInput = {
      nama_umum: namaUmum,
      nama_ilmiah: namaIlmiah,
      jumlah: Number(jumlah),
      lokasi_penanaman_id: lokasiId ? Number(lokasiId) : null,
      das_id: dasId ? Number(dasId) : null,
      is_draft: true,
    }

    try {
      if (editingPohon) {
        await updatePohon(editingPohon.id, input)
        alert("Pohon berhasil diperbarui")
        onCancelEdit()
      } else {
        await createPohon(input)
        alert("Pohon berhasil ditambahkan")
      }
      resetForm()
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass =
    "w-full rounded-xl border p-3"

  const labelClass = "mb-2 block text-sm font-medium text-[#0F5139]"

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F5139]">
          Tambah/Edit Pohon
        </h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Nama Umum
            </label>
            <input
              type="text"
              placeholder="Contoh: Meranti Merah"
              value={namaUmum}
              onChange={(e) => setNamaUmum(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Nama Ilmiah 
              </label>
            <input
              type="text"
              placeholder="Contoh: Shorea sp."
              value={namaIlmiah}
              onChange={(e) => setNamaIlmiah(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Jumlah Individu
            </label>
          <input
            type="number"
            min="0"
            placeholder="Contoh: 135"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mt-2 rounded-xl border border-[#0F5139]/10 bg-[#F8FAF8] p-4 space-y-4">
          <div>
            <p className="text-md font-semibold text-[#0F5139] mb-1">Relasi</p>
            <p className="text-xs text-gray-400 mb-3">
              Pilih minimal satu. Pohon bisa berelasi ke Lokasi Penanaman, DAS, atau keduanya.
            </p>
          </div>

          <div>
            <div>
              <label className="mb-2 block font-medium text-[#0F5139]">
                Lokasi Penanaman
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLokasi(!showLokasi)}
                  className="flex w-full items-center justify-between rounded-xl border p-3 transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
                >
                  <span>
                    {lokasiId
                      ? lokasiOptions.find((l) => l.id === Number(lokasiId))?.nama_lokasi
                      : "— Tidak dipilih —"}
                  </span>

                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showLokasi ? "rotate-180" : ""
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

                {showLokasi && (
                  <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl border bg-white shadow-lg">

                    <button
                      type="button"
                      onClick={() => {
                        setLokasiId("")
                        setShowLokasi(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      — Tidak dipilih —
                    </button>

                    {lokasiOptions.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          setLokasiId(String(l.id))
                          setShowLokasi(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                      >
                        {l.nama_lokasi}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div>
              <label className="mb-2 block font-medium text-[#0F5139]">
                DAS
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDas(!showDas)}
                  className="flex w-full items-center justify-between rounded-xl border p-3 transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
                >
                  <span>
                    {dasId
                      ? dasOptions.find((d) => d.id === Number(dasId))?.nama_das
                      : "— Tidak dipilih —"}
                  </span>

                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showDas ? "rotate-180" : ""
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

                {showDas && (
                  <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl border bg-white shadow-lg">

                    <button
                      type="button"
                      onClick={() => {
                        setDasId("")
                        setShowDas(false)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      — Tidak dipilih —
                    </button>

                    {dasOptions.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setDasId(String(d.id))
                          setShowDas(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                      >
                        {d.nama_das}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => handleSaveDraft()}
            className="rounded-xl bg-gray-200 px-6 py-2 transition hover:bg-gray-300 active:scale-95 transition"
          >
            {editingPohon ? "Update Draft" : "Simpan Draft"}
          </button>

          <button
            onClick={() => handleSubmit(false)}
            className="rounded-xl bg-emerald-900 px-6 py-2 text-white transition hover:bg-emerald-950 active:scale-95"
          >
            {editingPohon ? "Update & Publish" : "Publish Pohon"}
          </button>

          {editingPohon && (
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
  )
}