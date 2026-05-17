"use client"

import { Dokumen } from "./dokumen.service"

type Props = {
  dokumen: Dokumen[]
}

export default function DokumenList({ dokumen }: Props) {
  return (
    <div>
      <h1 className="text-xl text-[#0F5139] font-semibold mb-6">Daftar Dokumen</h1>

      {dokumen.length === 0 ? (
        <p className="text-gray-500">Belum ada dokumen yang diupload.</p>
      ) : (
        <div className="space-y-3">
          {dokumen.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div>
                <h2 className="font-semibold text-[#0F5139]">{item.judul}</h2>
                <p className="text-sm text-gray-500">PDF</p>
              </div>

              <a
                href={item.file_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-[#0F5139] px-4 py-2 text-sm text-white transition hover:bg-[#0A3D2A] active:scale-95"
              >
                Buka Dokumen
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}