"use client"

import { LokasiPenanaman } from "./lokasi.service"

type Props = {
  lokasiPenanaman: LokasiPenanaman[]
}

export default function LokasiList({ lokasiPenanaman }: Props) {
  return (
  <div>
    <h1 className="mb-6 text-xl font-semibold text-[#0F5139]">
      Daftar Lokasi Penanaman
    </h1>

    {lokasiPenanaman.length === 0 ? (
      <p className="text-gray-500">
        Belum ada lokasi penanaman.
      </p>
    ) : (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {lokasiPenanaman.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
          >
            {/* MAP PLACEHOLDER */}
            <div className="flex h-52 w-full items-center justify-center bg-[#0F5139]/10">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Polygon Area
                </p>

                <p className="mt-2 text-2xl font-bold text-[#0F5139]">
                  {item.polygon_coordinates?.length || 0}
                </p>

                <p className="text-xs text-gray-500">
                  titik polygon
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5">
              {/* STATUS */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.status_lokasi === "aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status_lokasi}
                </span>

                <span className="rounded-full bg-[#0F5139]/10 px-3 py-1 text-xs text-[#0F5139]">
                  {item.luas_area} ha
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                  {item.jumlah_bibit} bibit
                </span>
              </div>

              {/* TITLE */}
              <h2 className="mb-2 text-lg font-semibold text-[#0F5139]">
                {item.nama_lokasi}
              </h2>

              {/* INFO */}
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  {item.kabupaten_kota || "-"},{" "}
                  {item.provinsi || "-"}
                </p>

                <p>
                  {new Date(
                    item.tanggal_tanam
                  ).toLocaleDateString("id-ID")}
                </p>

                <p>
                  {item.latitude}, {item.longitude}
                </p>
              </div>

              {/* BUTTON */}
              <div className="mt-5 flex gap-3">
                <a
                  href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A]"
                >
                  Buka Maps
                </a>

                <button className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}