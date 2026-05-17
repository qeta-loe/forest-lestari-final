"use client"

import { useState } from "react"
import { uploadLokasiPenanaman } from "./lokasi.service"

type PolygonInputPoint = { 
    lat: string; 
    lng: string 
}

type Props = {
  onSuccess: () => void
}

export default function LokasiForm({ 
    onSuccess 
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
  const [polygonPoints, setPolygonPoints] = useState<PolygonInputPoint[]>([
    { lat: "", lng: "" },
    { lat: "", lng: "" },
    { lat: "", lng: "" },
  ])

  const updatePoint = (
    index: number, 
    field: "lat" | "lng", 
    value: string
    ) =>
    setPolygonPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )

  const addPoint = () => setPolygonPoints((prev) => [...prev, { lat: "", lng: "" }])

  const removePoint = (index: number) => {
    if (polygonPoints.length <= 3) return alert("Polygon minimal harus memiliki 3 titik")
    setPolygonPoints((prev) => prev.filter((_, i) => i !== index))
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

    setPolygonPoints([
      { lat: "", lng: "" },
      { lat: "", lng: "" },
      { lat: "", lng: "" },
    ])
  }

  const handleSubmit = async () => {
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
        "Semua field wajib diisi"
      )
    }

    const hasEmpty =
      polygonPoints.some(
        (p) => !p.lat || !p.lng
      )

    if (hasEmpty) {
      return alert(
        "Semua titik polygon harus diisi"
      )
    }

    try {
      await uploadLokasiPenanaman({
        nama_lokasi: namaLokasi,
        status_lokasi: statusLokasi,
        provinsi,
        kabupaten_kota:
          kabupatenKota,
        alamat,
        latitude: Number(latitude),
        longitude: Number(longitude),
        luas_area: Number(luasArea),
        jumlah_bibit:
          Number(jumlahBibit),
        tanggal_tanam:
          tanggalTanam,
        polygon_coordinates:
          polygonPoints.map((point) => ({
            lat: Number(point.lat),
            lng: Number(point.lng),
          })),
      })

      alert(
        "Lokasi penanaman berhasil ditambahkan"
      )

      resetForm()
      onSuccess()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
  <div className="mx-auto max-w-6xl">
    {/* HEADER */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#0F5139]">
        Kelola Lokasi Penanaman
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Tambahkan lokasi penanaman Forest Lestari.
      </p>
    </div>

    {/* FORM */}
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* NAMA */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-[#0F5139]">
            Nama Lokasi
          </label>

          <input
            type="text"
            placeholder="Nama lokasi penanaman"
            value={namaLokasi}
            onChange={(e) => setNamaLokasi(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Status Lokasi
          </label>

          <select
            value={statusLokasi}
            onChange={(e) => setStatusLokasi(e.target.value as "aktif" | "tidak_aktif")}
            className="w-full rounded-xl border p-3"
          >
            <option value="aktif">Aktif</option>
            <option value="tidak_aktif">Tidak Aktif</option>
          </select>
        </div>

        {/* TANGGAL */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Tanggal Tanam
          </label>

          <input
            type="date"
            value={tanggalTanam}
            onChange={(e) => setTanggalTanam(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* PROVINSI */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Provinsi
          </label>

          <input
            type="text"
            placeholder="Provinsi"
            value={provinsi}
            onChange={(e) => setProvinsi(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* KABUPATEN */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Kabupaten / Kota
          </label>

          <input
            type="text"
            placeholder="Kabupaten / Kota"
            value={kabupatenKota}
            onChange={(e) => setKabupatenKota(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* ALAMAT */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-[#0F5139]">
            Alamat Lengkap
          </label>

          <textarea
            placeholder="Alamat lengkap lokasi"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="min-h-28 w-full rounded-xl border p-4"
          />
        </div>

        {/* LATITUDE */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            placeholder="-6.12345"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* LONGITUDE */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            placeholder="106.12345"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* LUAS AREA */}
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
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* JUMLAH BIBIT */}
        <div>
          <label className="mb-2 block font-medium text-[#0F5139]">
            Jumlah Bibit
          </label>

          <input
            type="number"
            placeholder="140"
            value={jumlahBibit}
            onChange={(e) => setJumlahBibit(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      {/* DESKRIPSI */}
      <div className="mt-10">
        <label className="mb-2 block font-medium text-[#0F5139]">
          Deskripsi Lokasi
        </label>

        <textarea
          placeholder="Deskripsi lokasi penanaman"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="min-h-40 w-full rounded-xl border p-4"
        />
      </div>

      {/* POLYGON */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0F5139]">
            Titik Polygon
          </h2>

          <button
            type="button"
            onClick={addPoint}
            className="rounded-xl bg-[#0F5139] px-4 py-2 text-white"
          >
            + Tambah Titik
          </button>
        </div>

        <div className="space-y-4">
          {polygonPoints.map((point, index) => (
            <div
              key={index}
              className="rounded-2xl border p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[#0F5139]">
                  Titik {index + 1}
                </h3>

                {polygonPoints.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0F5139]">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="-6.12345"
                    value={point.lat}
                    onChange={(e) =>
                      updatePoint(index, "lat", e.target.value)
                    }
                    className="w-full rounded-xl border p-3"
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
                    value={point.lng}
                    onChange={(e) =>
                      updatePoint(index, "lng", e.target.value)
                    }
                    className="w-full rounded-xl border p-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Minimal 3 titik polygon.
        </p>
      </div>

      {/* BUTTON */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={handleSubmit}
          className="rounded-xl bg-[#0F5139] px-6 py-3 text-white"
        >
          Simpan Lokasi
        </button>
      </div>
        </div>
      </div>
    )
  }