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

  const handleSubmit = async () => {
    if (!namaUmum || !jumlah) return alert("Nama umum dan jumlah wajib diisi")
    if (!lokasiId && !dasId) return alert("Pilih minimal satu relasi: Lokasi Penanaman atau DAS")

    const input: PohonInput = {
      nama_umum: namaUmum,
      nama_ilmiah: namaIlmiah,
      jumlah: Number(jumlah),
      lokasi_penanaman_id: lokasiId ? Number(lokasiId) : null,
      das_id: dasId ? Number(dasId) : null,
    }

    try {
      if (editingPohon) {
        await updatePohon(editingPohon.id, input)
        alert("Pohon berhasil diperbarui")
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
    "w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"

  const labelClass = "mb-2 block text-sm font-medium text-[#0F5139]"

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-6">
        {editingPohon ? "Edit Pohon" : "Tambah Pohon"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">

        {/* Nama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Umum</label>
            <input
              type="text"
              placeholder="Contoh: Meranti Merah"
              value={namaUmum}
              onChange={(e) => setNamaUmum(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nama Ilmiah </label>
            <input
              type="text"
              placeholder="Contoh: Shorea sp."
              value={namaIlmiah}
              onChange={(e) => setNamaIlmiah(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Jumlah */}
        <div>
          <label className={labelClass}>Jumlah Individu</label>
          <input
            type="number"
            min="0"
            placeholder="Contoh: 135"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Relasi */}
        <div className="rounded-xl border border-[#0F5139]/10 bg-[#F8FAF8] p-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#0F5139] mb-1">Relasi</p>
            <p className="text-xs text-gray-400 mb-3">
              Pilih minimal satu. Pohon bisa berelasi ke Lokasi Penanaman, DAS, atau keduanya.
            </p>
          </div>

          <div>
            <label className={labelClass}>Lokasi Penanaman</label>
            <select
              value={lokasiId}
              onChange={(e) => setLokasiId(e.target.value)}
              className={inputClass}
            >
              <option value="">— Tidak dipilih —</option>
              {lokasiOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nama_lokasi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>DAS</label>
            <select
              value={dasId}
              onChange={(e) => setDasId(e.target.value)}
              className={inputClass}
            >
              <option value="">— Tidak dipilih —</option>
              {dasOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama_das}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-6 py-2 rounded-xl cursor-pointer"
          >
            {editingPohon ? "Simpan Perubahan" : "Simpan Pohon"}
          </button>

          {editingPohon && (
            <button
              onClick={() => { resetForm(); onCancelEdit() }}
              className="bg-gray-400 hover:bg-gray-500 active:scale-95 transition-all duration-150 text-white px-6 py-2 rounded-xl cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  )
}