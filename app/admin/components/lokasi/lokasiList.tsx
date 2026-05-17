"use client"

import { LokasiPenanaman } from "./lokasi.service"

type Props = {
  lokasiPenanaman: LokasiPenanaman[]
}

export default function LokasiList({ lokasiPenanaman }: Props) {
  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-6">Daftar Lokasi Penanaman</h1>

      {lokasiPenanaman.length === 0 ? (
        <p className="text-gray-500">Belum ada lokasi penanaman yang ditambahkan.</p>
      ) : (
        <div className="space-y-3">
          {lokasiPenanaman.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-[#0F5139]">{item.nama_lokasi}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Titik utama: {item.latitude}, {item.longitude}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Jumlah titik polygon: {item.polygon_coordinates?.length || 0}
                  </p>
                  {item.deskripsi && (
                    <p className="mt-2 text-sm text-gray-600">{item.deskripsi}</p>
                  )}
                </div>

                <a 
                  href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit rounded-md bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
                >
                  Buka Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}