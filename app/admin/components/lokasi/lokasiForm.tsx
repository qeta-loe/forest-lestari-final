"use client"

import { useState, useEffect } from "react"
import { LokasiPenanaman, uploadLokasiPenanaman, updateLokasiPenanaman } from "./lokasi.service"
import { parseKMLFile } from "@/lib/kml/parser"

type Props = {
  onSuccess: () => void
  editingLokasi: LokasiPenanaman | null
  onCancelEdit: () => void
}

export default function LokasiForm({ 
    onSuccess ,
    editingLokasi, 
    onCancelEdit
}: Props) {
  const [namaLokasi, setNamaLokasi] = useState("")
  const [statusLokasi, setStatusLokasi] =
    useState<"aktif" | "tidak_aktif">(
      "aktif"
    )
  const [provinsi, setProvinsi] = useState("")
  const [kabupatenKota, setKabupatenKota] = useState("")
  const [alamat, setAlamat] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [luasArea, setLuasArea] = useState("")
  const [jumlahBibit, setJumlahBibit] = useState("")
  const [tanggalTanam, setTanggalTanam] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [isDraft, setIsDraft] = useState(false)
  const [showStatusLokasi, setShowStatusLokasi] = useState(false)
  const [inputMode, setInputMode] = useState<"manual" | "kml" | "">("")
  const [showInputMode, setShowInputMode] = useState(false)
  const [kmlFileName, setKmlFileName] = useState("")

  const handleKmlUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setKmlFileName(file.name)

    const text = await file.text()

    const match = text.match(
      /<coordinates>([\s\S]*?)<\/coordinates>/
    )

    if (!match) {
      alert("Koordinat tidak ditemukan dalam file KML")
      return
    }

    const firstCoordinate = match[1]
      .trim()
      .split(/\s+/)[0]

    const [lng, lat] = firstCoordinate.split(",")

    setLatitude(lat)
    setLongitude(lng)
  }

  const resetForm = () => {
    setNamaLokasi("")
    setStatusLokasi("aktif")
    setProvinsi("")
    setKabupatenKota("")
    setAlamat("")
    setLatitude("")
    setLongitude("")
    setLuasArea("")
    setJumlahBibit("")
    setTanggalTanam("")

    setInputMode("")
    setKmlFileName("")

    setDeskripsi("")
    setIsDraft(false)
  }

  useEffect(() => {
    if (editingLokasi) {
      setNamaLokasi(editingLokasi.nama_lokasi || "")
      setStatusLokasi(
        editingLokasi.status_lokasi as "aktif" | "tidak_aktif"
      )

      setProvinsi(editingLokasi.provinsi || "")
      setKabupatenKota(editingLokasi.kabupaten_kota || "")
      setAlamat(editingLokasi.alamat || "")
      setLatitude(String(editingLokasi.latitude || ""))
      setLongitude(String(editingLokasi.longitude || ""))
      setLuasArea(String(editingLokasi.luas_area || ""))
      setJumlahBibit(String(editingLokasi.jumlah_bibit || ""))
      setTanggalTanam(editingLokasi.tanggal_tanam || "")
      setIsDraft(editingLokasi.is_draft || false)

    } else {
      resetForm()
    }
  }, [editingLokasi])

  useEffect(() => {
    setKmlFileName("")
  }, [inputMode])

  const handleSubmit = async (draft: boolean) => {
    setIsDraft(draft)
    if (
      !namaLokasi ||
      !provinsi ||
      !kabupatenKota ||
      !latitude ||
      !longitude ||
      !luasArea ||
      !jumlahBibit ||
      !tanggalTanam
    ) {
      return alert(
        "Semua tabel harus diisi"
      )
    }

    try {
      const payload = {
        nama_lokasi: namaLokasi,
        status_lokasi: statusLokasi,
        provinsi,
        kabupaten_kota: kabupatenKota,
        alamat,
        latitude: Number(latitude),
        longitude: Number(longitude),
        luas_area: Number(luasArea),
        jumlah_bibit: Number(jumlahBibit),
        tanggal_tanam: tanggalTanam,
        is_draft: draft,
      }

      if (editingLokasi) {
        await updateLokasiPenanaman(editingLokasi.id, payload)
        alert("Lokasi berhasil diupdate")
        onCancelEdit()
      } else {
        await uploadLokasiPenanaman(payload)
        alert("Lokasi penanaman berhasil ditambahkan")
      }

        resetForm()
        onSuccess()
      } catch (err: any) {
        alert(err.message)
      }
    }

  return (
  <div className="mx-auto max-w-6xl">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#0F5139]">
        Tambah/Edit Lokasi Penanaman
      </h1>
    </div>

    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-[#0F5139]">
            Nama Lokasi
          </label>
          <input
            type="text"
            placeholder="Nama lokasi penanaman"
            value={namaLokasi}
            onChange={(e) => setNamaLokasi(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>

        <div>
          <div>
            <label className="mb-2 block font-medium text-[#0F5139]">
              Status Lokasi
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusLokasi(!showStatusLokasi)}
                className="flex w-full items-center justify-between rounded-xl border p-3 transition focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
              >
                <span>
                  {statusLokasi === "aktif"
                    ? "Aktif"
                    : statusLokasi === "tidak_aktif"
                    ? "Tidak Aktif"
                    : "Pilih status"}
                </span>

                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showStatusLokasi ? "rotate-180" : ""
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

              {showStatusLokasi && (
                <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-lg">

                  <button
                    type="button"
                    onClick={() => {
                      setStatusLokasi("aktif")
                      setShowStatusLokasi(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                  >
                    Aktif
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusLokasi("tidak_aktif")
                      setShowStatusLokasi(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                  >
                    Tidak Aktif
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Tanggal Tanam
          </label>

          <input
            type="date"
            value={tanggalTanam}
            onChange={(e) => setTanggalTanam(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Provinsi
          </label>

          <input
            type="text"
            placeholder="Provinsi"
            value={provinsi}
            onChange={(e) => setProvinsi(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Kabupaten / Kota
          </label>

          <input
            type="text"
            placeholder="Kabupaten / Kota"
            value={kabupatenKota}
            onChange={(e) => setKabupatenKota(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-[#0F5139]">
            Alamat Lengkap
          </label>

          <textarea
            placeholder="Alamat lengkap lokasi"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="min-h-28 w-full rounded-xl border p-4 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Luas Area (ha)
          </label>

          <input
            type="number"
            step="any"
            placeholder="7.4"
            value={luasArea}
            onChange={(e) => setLuasArea(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Jumlah Bibit
          </label>

          <input
            type="number"
            placeholder="140"
            value={jumlahBibit}
            onChange={(e) => setJumlahBibit(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
          />
        </div>
      </div>

      <div className="mt-10">
        <label className="mb-2 block font-medium text-[#0F5139]">
          Deskripsi Lokasi
        </label>

        <textarea
          placeholder="Deskripsi lokasi penanaman"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="min-h-40 w-full rounded-xl border p-4 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
        />

        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Metode Input
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowInputMode(!showInputMode)}
              className="flex w-full items-center justify-between rounded-xl border p-3 transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10 outline-none"
            >
              <span>
                {inputMode === "manual"
                  ? "Input Manual"
                  : inputMode === "kml"
                  ? "Upload KML"
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
              <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-lg">

                <button
                  type="button"
                  onClick={() => {
                    setInputMode("manual")
                    setShowInputMode(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                >
                  Input Manual
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputMode("kml")
                    setShowInputMode(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                >
                  Upload KML
                </button>

              </div>
            )}
          </div>
        </div>

        {inputMode === "kml" && (
          <div className="mt-5">
            <label className="mb-2 block font-medium text-[#0F5139]">
              File KML
            </label>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#0F5139]/20 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm text-[#0F5139]">
                {kmlFileName || "Klik untuk pilih file KML"}
              </span>

              <span className="text-xs text-gray-400 mt-1">
                Hanya file .kml
              </span>

              <input
                type="file"
                accept=".kml"
                onChange={handleKmlUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {inputMode === "manual" && (
          <>
            <div className="mt-5">
              <h2 className="text-lg font-semibold text-[#0F5139] mb-4">
                Titik Lokasi
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="-6.12345"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="106.12345"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full rounded-xl border p-3 outline-none transition duration-200 focus:border-[#0F5139] focus:ring-2 focus:ring-[#0F5139]/10"
                  />
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Masukkan titik koordinat utama lokasi penanaman.
              </p>
            </div>
          </>
        )}
      </div>
    </div>

      <div className="mt-10 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="rounded-xl bg-gray-200 px-6 py-3 transition hover:bg-gray-300 active:scale-95"
          >
            {editingLokasi ? "Update Draft" : "Simpan Draft"}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="rounded-xl bg-[#0F5139] px-6 py-3 text-white transition hover:bg-[#0A3D2A] active:scale-95"
          >
            {editingLokasi ? "Update & Publish" : "Publish Lokasi"}
          </button>

          {editingLokasi && (
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
    )
  }