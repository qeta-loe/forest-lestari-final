"use client"

import { useState, useEffect,useMemo } from "react"
import { parseKMLFile } from "@/lib/kml/parser"

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
  const [kmlFileName, setKmlFileName] = useState("")
  const [isParsingKml, setIsParsingKml] = useState(false)
  const [inputMode, setInputMode] = useState<"none" | "kml" | "manual">("none")
  const [kmlFile, setKmlFile] = useState<File | null>(null)
  const [showInputMode, setShowInputMode] = useState(false)

  const toNumberString = (value: string) => {
  return value.trim() === "" ? "0" : value.trim()
}

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

  useEffect(() => {
    if (inputMode === "none") return
    setPolygonPoints(emptyPoints)
    setKmlFile(null)
    setKmlFileName("")
  }, [inputMode])

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

  const handleSubmit = async (isDraft: boolean) => {
    if (!namaDas || !luasHa || !luasTutupanHa || !jenisTanah || !kemiringanMin || !kemiringanMax) {
      return alert("Semua tabel wajib diisi")
    }

    if (polygonPoints.length < 3) return alert("Polygon minimal 3 titik")
    
    if (inputMode === "none") {
      return alert("Pilih metode input polygon")
    }

    if (inputMode === "manual" && polygonPoints.length < 3) {
      return alert("Minimal 3 titik polygon")
    }

    if (inputMode === "kml" && !kmlFileName) {
      return alert("Upload file KML terlebih dahulu")
    }

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
      koordinat_hulu: toNumberString(koordinatHulu),
      koordinat_muara: toNumberString(koordinatMuara),
      luas_ha: Number(luasHa),
      luas_tutupan_ha: Number(luasTutupanHa),
      panjang_sungai_km: toNumberString(panjangSungaiKm),
      jenis_tanah: jenisTanah,
      kemiringan_min: Number(kemiringanMin),
      kemiringan_max: Number(kemiringanMax),
      polygon_coordinates: parsedPoints,
      is_draft: isDraft,
    }

    try {
      if (editingDas) {
        await updateDas(editingDas.id, input)
        alert("DAS berhasil diperbarui")
        onCancelEdit()
      } else {
        await createDas(input)
      }
      alert(
        isDraft
          ? "Draft berhasil disimpan"
          : "DAS berhasil dipublish"
      )
      resetForm()
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSaveDraft = async () => {
    if (!namaDas || !luasHa || !luasTutupanHa || !jenisTanah || !kemiringanMin || !kemiringanMax) {
      return alert("Semua field wajib diisi (minimal untuk draft)")
    }

    if (polygonPoints.length < 3) return alert("Polygon minimal 3 titik")

    const parsedPoints: PolygonCoordinate[] = polygonPoints.map((p) => ({
      lat: Number(p.lat),
      lng: Number(p.lng),
    }))

    const input: DasInput = {
      nama_das: namaDas,
      koordinat_hulu: toNumberString(koordinatHulu),
      koordinat_muara: toNumberString(koordinatMuara),
      luas_ha: Number(luasHa),
      luas_tutupan_ha: Number(luasTutupanHa),
      panjang_sungai_km: toNumberString(panjangSungaiKm),
      jenis_tanah: jenisTanah,
      kemiringan_min: Number(kemiringanMin),
      kemiringan_max: Number(kemiringanMax),
      polygon_coordinates: parsedPoints,
      is_draft: true,
    }

    try {
      await createDas(input)
      alert("DAS disimpan sebagai draft")
      resetForm()
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const inputClass = "w-full rounded-xl border border-[#0F5139]/20 bg-white px-4 py-3 text-[#0F5139] outline-none transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
  const labelClass = "mb-2 block text-m font-medium text-[#0F5139]"

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F5139]">
          Tambah/Edit DAS
        </h1>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Nama DAS
            </label>
            <input
              value={namaDas}
              onChange={(e) => setNamaDas(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="Contoh: DAS Cisadane"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Koordinat Hulu
              </label>
            <input
              value={koordinatHulu}
              onChange={(e) => setKoordinatHulu(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="Contoh: 6.7050°S"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Koordinat Muara
              </label>
            <input
              value={koordinatMuara}
              onChange={(e) => setKoordinatMuara(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Luas DAS (ha)
            </label>
            <input
              type="number"
              value={luasHa}
              onChange={(e) => setLuasHa(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Luas Tutupan (ha)
            </label>
            <input
              type="number"
              value={luasTutupanHa}
              onChange={(e) => setLuasTutupanHa(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-gray-500">Tutupan Hutan</p>
            <p className="text-2xl font-bold text-[#0F5139]">
              {tutupanPreview ? `${tutupanPreview}%` : "—"}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-gray-500">Kondisi DAS</p>
            <p className="text-2xl font-bold text-[#0F5139] capitalize">
              {kondisiPreview}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-[#0F5139]">
              Jenis Tanah
            </label>
            <input
              value={jenisTanah}
              onChange={(e) => setJenisTanah(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2 mt-5">
          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Kemiringan Minimum (°)
            </label>
            <input
              type="number"
              value={kemiringanMin}
              onChange={(e) => setKemiringanMin(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Kemiringan Maksimum (°)
            </label>
            <input
              type="number"
              value={kemiringanMax}
              onChange={(e) => setKemiringanMax(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
                Input Polygon DAS
              </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowInputMode(!showInputMode)}
                className="flex w-full items-center justify-between rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
              >
                <span>
                  {inputMode === "kml"
                    ? "Upload KML File"
                    : inputMode === "manual"
                    ? "Input Manual"
                    : "Pilih metode input"}
                </span>

                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showInputMode ? "rotate-180" : ""
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

              {showInputMode && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl border bg-white shadow-lg z-50 overflow-hidden">
                  
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode("kml")
                      setShowInputMode(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                  >
                    Upload KML File
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputMode("manual")
                      setShowInputMode(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                  >
                    Input Titik Manual
                  </button>
                </div>
              )}
            </div>
        </div>

        {inputMode === "kml" && (
          <div className="mt-4 rounded-xl border p-5">
            <div className="mt-1">
              <label className={labelClass}>File KML</label>

              {editingDas && !kmlFile && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">File saat ini:</span>
                  <span className="text-xs text-[#0F5139]">
                    {kmlFileName || "Tidak ada file"}
                  </span>
                </div>
              )}

              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0F5139]/20 transition hover:bg-gray-50">
                
                <span className="text-sm text-[#0F5139]">
                  {kmlFile ? kmlFile.name : "Klik untuk pilih file KML"}
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  Hanya file .kml
                </span>

                <input
                  type="file"
                  accept=".kml"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    setKmlFile(file)

                    try {
                      setIsParsingKml(true)

                      const coords = await parseKMLFile(file)

                      if (coords.length < 3) {
                        alert("KML harus punya minimal 3 titik polygon")
                        return
                      }

                      setPolygonPoints(
                        coords.map((c) => ({
                          lat: String(c.lat),
                          lng: String(c.lng),
                        }))
                      )

                      setKmlFileName(file.name)
                    } catch (err: any) {
                      alert("Gagal parse KML: " + err.message)
                    } finally {
                      setIsParsingKml(false)
                    }
                  }}
                />
              </label>

              {isParsingKml && (
                <p className="mt-2 text-sm text-gray-500">
                  Membaca file KML...
                </p>
              )}

              {kmlFileName && (
                <p className="mt-2 text-sm text-green-600">
                  Loaded: {kmlFileName}
                </p>
              )}
            </div>

            {isParsingKml && (
              <p className="text-sm text-gray-500 mt-2">
                Membaca file KML...
              </p>
            )}

            {kmlFileName && (
              <p className="text-sm text-green-600 mt-2">
                Loaded: {kmlFileName}
              </p>
            )}
          </div>
        )}

        {inputMode === "manual" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#0F5139]">
              Titik Polygon DAS
            </h2>

            <div className="mt-4 space-y-4">
              {polygonPoints.map((p, i) => (
                <div key={i} className="grid grid-cols-3 gap-3">
                  <input
                    value={p.lat}
                    onChange={(e) => updatePoint(i, "lat", e.target.value)}
                    className="w-full rounded-xl border p-3"
                    placeholder="Latitude"
                  />

                  <input
                    value={p.lng}
                    onChange={(e) => updatePoint(i, "lng", e.target.value)}
                    className="w-full rounded-xl border p-3"
                    placeholder="Longitude"
                  />

                  <button
                    type="button"
                    onClick={() => removePoint(i)}
                    className="rounded-xl bg-red-600 text-white"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPoint}
              className="mt-4 rounded-xl bg-[#0F5139] px-5 py-3 text-white"
            >
              + Tambah Titik
            </button>
          </div>
        )}

        <div className="mt-6">
          {isParsingKml && (
            <p className="text-sm text-gray-500 mt-2">
              Membaca file KML...
            </p>
          )}

          {kmlFileName && (
            <p className="text-sm text-green-600 mt-2">
              Loaded: {kmlFileName}
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
          >
            Simpan Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="rounded-xl bg-[#0F5139] px-6 py-3 text-white"
          >
            {editingDas ? "Publish Perubahan" : "Publish DAS"}
          </button>

          {editingDas && (
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