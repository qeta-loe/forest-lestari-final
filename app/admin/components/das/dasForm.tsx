"use client"

import { useState, useEffect } from "react"
import {
  Das,
  DasInput,
  PolygonCoordinate,
  createDas,
  updateDas,
  hitungTutupan,
  hitungKondisi,
} from "./das.service"

type PolygonInputPoint = { lat: string; lng: string }

type Props = {
  editingDas: Das | null
  onSuccess: () => void
  onCancelEdit: () => void
}

const emptyPoints: PolygonInputPoint[] = [
  { lat: "", lng: "" },
  { lat: "", lng: "" },
  { lat: "", lng: "" },
]

export default function DasForm({ editingDas, onSuccess, onCancelEdit }: Props) {
  const [namaDas, setNamaDas] = useState("")
  const [koordinatHulu, setKoordinatHulu] = useState("")
  const [koordinatMuara, setKoordinatMuara] = useState("")
  const [luasHa, setLuasHa] = useState("")
  const [luasTutupanHa, setLuasTutupanHa] = useState("")
  const [panjangSungaiKm, setPanjangSungaiKm] = useState("")
  const [jenisTanah, setJenisTanah] = useState("")
  const [kemiringanMin, setKemiringanMin] = useState("")
  const [kemiringanMax, setKemiringanMax] = useState("")
  const [polygonPoints, setPolygonPoints] = useState<PolygonInputPoint[]>(emptyPoints)

  // preview kalkulasi otomatis
  const tutupanPreview = hitungTutupan(Number(luasTutupanHa) || 0, Number(luasHa) || 0)
  const kondisiPreview =
    jenisTanah && kemiringanMax
      ? hitungKondisi(tutupanPreview, Number(kemiringanMax), jenisTanah)
      : "-"

  useEffect(() => {
    if (editingDas) {
      setNamaDas(editingDas.nama_das)
      setKoordinatHulu(editingDas.koordinat_hulu || "")
      setKoordinatMuara(editingDas.koordinat_muara || "")
      setLuasHa(String(editingDas.luas_ha))
      setLuasTutupanHa(String(editingDas.luas_tutupan_ha))
      setPanjangSungaiKm(editingDas.panjang_sungai_km || "")
      setJenisTanah(editingDas.jenis_tanah || "")
      setKemiringanMin(String(editingDas.kemiringan_min))
      setKemiringanMax(String(editingDas.kemiringan_max))
      setPolygonPoints(
        editingDas.polygon_coordinates?.map((p) => ({
          lat: String(p.lat),
          lng: String(p.lng),
        })) || emptyPoints
      )
    } else {
      resetForm()
    }
  }, [editingDas])

  const resetForm = () => {
    setNamaDas("")
    setKoordinatHulu("")
    setKoordinatMuara("")
    setLuasHa("")
    setLuasTutupanHa("")
    setPanjangSungaiKm("")
    setJenisTanah("")
    setKemiringanMin("")
    setKemiringanMax("")
    setPolygonPoints(emptyPoints)
  }

  const updatePoint = (index: number, field: "lat" | "lng", value: string) =>
    setPolygonPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )

  const addPoint = () =>
    setPolygonPoints((prev) => [...prev, { lat: "", lng: "" }])

  const removePoint = (index: number) => {
    if (polygonPoints.length <= 3) return alert("Polygon minimal harus memiliki 3 titik")
    setPolygonPoints((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!namaDas || !luasHa || !luasTutupanHa || !jenisTanah || !kemiringanMin || !kemiringanMax) {
      return alert("Semua tabel wajib diisi")
    }

    if (polygonPoints.length < 3) return alert("Polygon minimal 3 titik")

    const hasEmpty = polygonPoints.some((p) => !p.lat || !p.lng)
    if (hasEmpty) return alert("Semua titik polygon harus diisi")

    const parsedPoints: PolygonCoordinate[] = polygonPoints.map((p) => ({
      lat: Number(p.lat),
      lng: Number(p.lng),
    }))

    const hasInvalid = parsedPoints.some((p) => isNaN(p.lat) || isNaN(p.lng))
    if (hasInvalid) return alert("Latitude dan longitude harus berupa angka")

    const input: DasInput = {
      nama_das: namaDas,
      koordinat_hulu: koordinatHulu,
      koordinat_muara: koordinatMuara,
      luas_ha: Number(luasHa),
      luas_tutupan_ha: Number(luasTutupanHa),
      panjang_sungai_km: panjangSungaiKm,
      jenis_tanah: jenisTanah,
      kemiringan_min: Number(kemiringanMin),
      kemiringan_max: Number(kemiringanMax),
      polygon_coordinates: parsedPoints,
    }

    try {
      if (editingDas) {
        await updateDas(editingDas.id, input)
        alert("DAS berhasil diperbarui")
      } else {
        await createDas(input)
        alert("DAS berhasil ditambahkan")
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
        {editingDas ? "Edit DAS" : "Tambah DAS"}
      </h1>

      <div className="rounded-2xl border border-[#0F5139]/10 bg-white p-6 space-y-5">

        {/* Nama DAS */}
        <div>
          <label className={labelClass}>Nama DAS</label>
          <input
            type="text"
            placeholder="Contoh: DAS Cisadane"
            value={namaDas}
            onChange={(e) => setNamaDas(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Koordinat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Koordinat Hulu</label>
            <input
              type="text"
              placeholder="Contoh: 6.7050°S, 106.7317°E"
              value={koordinatHulu}
              onChange={(e) => setKoordinatHulu(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Koordinat Muara</label>
            <input
              type="text"
              placeholder="Contoh: 6.0052°S, 106.6304°E"
              value={koordinatMuara}
              onChange={(e) => setKoordinatMuara(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Luas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Luas DAS (ha)</label>
            <input
              type="number"
              step="any"
              placeholder="Contoh: 153208"
              value={luasHa}
              onChange={(e) => setLuasHa(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Luas Tutupan Hutan (ha)</label>
            <input
              type="number"
              step="any"
              placeholder="Contoh: 32173"
              value={luasTutupanHa}
              onChange={(e) => setLuasTutupanHa(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Preview kalkulasi */}
        <div className="rounded-xl bg-[#F8FAF8] border border-[#0F5139]/10 p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Tutupan Hutan (auto)</p>
            <p className="text-2xl font-bold text-[#0F5139]">
              {tutupanPreview > 0 ? `${tutupanPreview}%` : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Kondisi DAS (auto)</p>
            <p
              className={`text-2xl font-bold capitalize ${
                kondisiPreview === "baik" ? "text-emerald-600" : 
                kondisiPreview === "kritis" ? "text-red-600" : "text-gray-400"
              }`}
            >
              {kondisiPreview}
            </p>
          </div>
        </div>

        {/* Panjang Sungai */}
        <div>
          <label className={labelClass}>Panjang Sungai Utama (km)</label>
          <input
            type="text"
            placeholder="Contoh: 126 - 137,6"
            value={panjangSungaiKm}
            onChange={(e) => setPanjangSungaiKm(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Jenis Tanah */}
        <div>
          <label className={labelClass}>Jenis Tanah Dominan</label>
          <input
            type="text"
            placeholder="Contoh: Latosol, andosol, regosol"
            value={jenisTanah}
            onChange={(e) => setJenisTanah(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">
            Tanah tidak peka erosi: Latosol, Aluvial. Tanah peka: Regosol, Andosol, Grumosol, Litosol.
          </p>
        </div>

        {/* Kemiringan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kemiringan Minimum (°)</label>
            <input
              type="number"
              step="any"
              placeholder="Contoh: 0"
              value={kemiringanMin}
              onChange={(e) => setKemiringanMin(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Kemiringan Maksimum (°)</label>
            <input
              type="number"
              step="any"
              placeholder="Contoh: 1.7"
              value={kemiringanMax}
              onChange={(e) => setKemiringanMax(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">
              Kondisi baik jika kemiringan max &lt; 14°
            </p>
          </div>
        </div>

        {/* Polygon */}
        <div className="rounded-xl border border-[#0F5139]/30 bg-white p-4">
          <h2 className="mb-3 font-semibold text-[#0F5139]">Titik Polygon DAS</h2>

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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-emerald-900 hover:bg-emerald-950 active:bg-black active:scale-95 transition-all duration-150 text-white px-6 py-2 rounded-xl cursor-pointer"
          >
            {editingDas ? "Simpan Perubahan" : "Simpan DAS"}
          </button>

          {editingDas && (
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