"use client"

import { useState } from "react"
import { uploadLokasiPenanaman } from "./lokasi.service"

type PolygonInputPoint = { lat: string; lng: string }

type Props = {
  onSuccess: () => void
}

export default function LokasiForm({ onSuccess }: Props) {
  const [namaLokasi, setNamaLokasi] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [polygonPoints, setPolygonPoints] = useState<PolygonInputPoint[]>([
    { lat: "", lng: "" },
    { lat: "", lng: "" },
    { lat: "", lng: "" },
  ])

  const updatePoint = (index: number, field: "lat" | "lng", value: string) =>
    setPolygonPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )

  const addPoint = () => setPolygonPoints((prev) => [...prev, { lat: "", lng: "" }])

  const removePoint = (index: number) => {
    if (polygonPoints.length <= 3) return alert("Polygon minimal harus memiliki 3 titik")
    setPolygonPoints((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!namaLokasi) return alert("Semua tabel harus diisi")
    const hasEmpty = polygonPoints.some((p) => !p.lat || !p.lng)
    if (hasEmpty) return alert("Semua titik polygon harus diisi")

    try {
      await uploadLokasiPenanaman(namaLokasi, deskripsi, polygonPoints)
      alert("Lokasi penanaman berhasil ditambahkan")
      setNamaLokasi("")
      setDeskripsi("")
      setPolygonPoints([{ lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }])
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-4">Lokasi Penanaman</h1>

      <input
        type="text"
        placeholder="Nama lokasi"
        value={namaLokasi}
        onChange={(e) => setNamaLokasi(e.target.value)}
        className="text-[#0F5139] block w-full mb-3 p-2 border rounded border-[#0F5139]"
      />

      <div className="mb-4 rounded-xl border border-[#0F5139]/30 bg-white p-4">
        <h2 className="mb-3 font-semibold text-[#0F5139]">Titik Polygon</h2>

        <div className="space-y-3">
          {polygonPoints.map((point, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-[1fr_1fr_auto]"
            >
              <input
                type="number"
                step="any"
                placeholder={`Latitude titik ${index + 1}`}
                value={point.lat}
                onChange={(e) => updatePoint(index, "lat", e.target.value)}
                className="text-[#0F5139] block w-full rounded border border-[#0F5139] p-2"
              />

              <input
                type="number"
                step="any"
                placeholder={`Longitude titik ${index + 1}`}
                value={point.lng}
                onChange={(e) => updatePoint(index, "lng", e.target.value)}
                className="text-[#0F5139] block w-full rounded border border-[#0F5139] p-2"
              />

              <button
                type="button"
                onClick={() => removePoint(index)}
                className="rounded bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700 active:scale-95"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addPoint}
          className="mt-3 rounded bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
        >
          Tambah Titik
        </button>

        <p className="mt-2 text-xs text-gray-500">
          Minimal 3 titik. Urutan titik menentukan bentuk polygon.
        </p>
      </div>

      <textarea
        placeholder="Deskripsi lokasi"
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
        className="text-[#0F5139] block min-h-32 w-full mb-4 p-2 border rounded border-[#0F5139]"
      />

      <button
        onClick={handleSubmit}
        className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-4 py-2 rounded cursor-pointer"
      >
        Simpan Lokasi
      </button>
    </div>
  )
}