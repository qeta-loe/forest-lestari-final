"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const sebaranKegiatan = [
  {
    wilayah: "Bogor Barat",
    jumlah: "12 Kegiatan",
    deskripsi: "Dokumentasi kegiatan konservasi dan edukasi lingkungan.",
  },
  {
    wilayah: "Bogor Tengah",
    jumlah: "8 Kegiatan",
    deskripsi: "Kegiatan komunitas dan kampanye pelestarian alam.",
  },
  {
    wilayah: "Bogor Selatan",
    jumlah: "10 Kegiatan",
    deskripsi: "Aksi penghijauan dan pemantauan lingkungan sekitar.",
  },
  {
    wilayah: "Bogor Timur",
    jumlah: "6 Kegiatan",
    deskripsi: "Program edukasi masyarakat dan kebersihan lingkungan.",
  },
  {
    wilayah: "Bogor Utara",
    jumlah: "9 Kegiatan",
    deskripsi: "Kegiatan pemetaan dan dokumentasi area hijau.",
  },
]

export default function KegiatanPage() {
  const [kegiatan, setKegiatan] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const [sebaranIndex, setSebaranIndex] = useState(0)
  const [sebaranTouchStart, setSebaranTouchStart] = useState(null)
  const [sebaranTouchEnd, setSebaranTouchEnd] = useState(null)

  const fetchKegiatan = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.log("FETCH KEGIATAN ERROR:", error)
      setLoading(false)
      return
    }

    setKegiatan(data || [])
    setActiveIndex(0)
    setLoading(false)
  }

  useEffect(() => {
    fetchKegiatan()

    const channel = supabase
      .channel("kegiatan-page-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kegiatan",
        },
        () => {
          fetchKegiatan()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const carouselKegiatan = kegiatan.slice(0, 5)
  const listKegiatan = kegiatan.slice(5)

  const nextSlide = () => {
    if (carouselKegiatan.length === 0) return

    setActiveIndex((prev) =>
      prev === carouselKegiatan.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    if (carouselKegiatan.length === 0) return

    setActiveIndex((prev) =>
      prev === 0 ? carouselKegiatan.length - 1 : prev - 1
    )
  }

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      nextSlide()
    }

    if (distance < -minSwipeDistance) {
      prevSlide()
    }
  }

  const activeKegiatan = carouselKegiatan[activeIndex]


    const visibleSebaran = 3
    const maxSebaranIndex = Math.max(0, sebaranKegiatan.length - visibleSebaran)

    const nextSebaran = () => {
      setSebaranIndex((prev) => (prev >= maxSebaranIndex ? 0 : prev + 1))
    }

    const prevSebaran = () => {
      setSebaranIndex((prev) => (prev <= 0 ? maxSebaranIndex : prev - 1))
    }

    const handleSebaranTouchStart = (e) => {
      setSebaranTouchEnd(null)
      setSebaranTouchStart(e.targetTouches[0].clientX)
    }

    const handleSebaranTouchMove = (e) => {
      setSebaranTouchEnd(e.targetTouches[0].clientX)
    }

    const handleSebaranTouchEnd = () => {
      if (!sebaranTouchStart || !sebaranTouchEnd) return

      const distance = sebaranTouchStart - sebaranTouchEnd
      const minSwipeDistance = 50

      if (distance > minSwipeDistance) {
        nextSebaran()
      }

      if (distance < -minSwipeDistance) {
        prevSebaran()
      }
    }
  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#48755e]">
              Dokumentasi
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-[#0F3926]">
              Kegiatan
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[360px] items-center justify-center rounded-[32px] bg-white shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-[#4D6B57]">Memuat kegiatan...</p>
          </div>
        ) : kegiatan.length === 0 ? (
          <div className="flex h-[360px] items-center justify-center rounded-[32px] bg-white shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-[#4D6B57]">
              Belum ada kegiatan yang diupload.
            </p>
          </div>
        ) : (
          <>
            {/* Carousel Atas */}
            <section
              className="relative h-[360px] w-full overflow-hidden rounded-[32px] bg-[#4a7062] shadow-sm ring-1 ring-black/5 sm:h-[430px]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {activeKegiatan && (
                <Link
                  href={`/kegiatan/${activeKegiatan.id}`}
                  className="absolute inset-0 z-10 block cursor-pointer"
                >
                  {activeKegiatan?.image_url ? (
                    <img
                      src={activeKegiatan.image_url}
                      alt={activeKegiatan.nama}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#4a7062]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-14 left-6 right-6 sm:left-10 sm:right-10">
                    <p className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                      Kegiatan Terbaru
                    </p>

                    <h2 className="max-w-3xl text-2xl font-semibold text-white sm:text-4xl">
                      {activeKegiatan?.nama}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 line-clamp-2 break-words">
                      {activeKegiatan?.deskripsi}
                    </p>
                  </div>
                </Link>
              )}

              {/* Tombol kiri */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl font-bold text-[#0F5139] shadow transition-all duration-150 hover:bg-white active:scale-95"
              >
                ‹
              </button>

              {/* Tombol kanan */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl font-bold text-[#0F5139] shadow transition-all duration-150 hover:bg-white active:scale-95"
              >
                ›
              </button>

              {/* Titik carousel */}
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {carouselKegiatan.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-150 ${
                      activeIndex === index
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* Sebaran Kegiatan */}
            <section className="mt-12">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#48755e]">
                    Sebaran Kegiatan
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-[#0F3926]">
                    Wilayah Kegiatan
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prevSebaran}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#0F5139] shadow-sm ring-1 ring-black/5 transition-all duration-150 hover:bg-[#eef7f1] active:scale-95"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextSebaran}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#0F5139] shadow-sm ring-1 ring-black/5 transition-all duration-150 hover:bg-[#eef7f1] active:scale-95"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div
                className="overflow-hidden"
                onTouchStart={handleSebaranTouchStart}
                onTouchMove={handleSebaranTouchMove}
                onTouchEnd={handleSebaranTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${sebaranIndex * (100 / visibleSebaran)}%)`,
                  }}
                >
                  {sebaranKegiatan.map((item) => (
                    <div
                      key={item.wilayah}
                      className="w-1/3 shrink-0 px-2"
                    >
                      <div className="h-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-150 hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F5139]/10 text-2xl">
                          📍
                        </div>

                        <h3 className="text-lg font-semibold text-[#0F3926]">
                          {item.wilayah}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#0F5139]">
                          {item.jumlah}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-[#4D6B57] line-clamp-3">
                          {item.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* List Kegiatan Lain */}
            <section className="mt-12">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#48755e]">
                  Kegiatan Lainnya
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#0F3926]">
                  Daftar Kegiatan
                </h2>
              </div>

              {listKegiatan.length === 0 ? (
                <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
                  <p className="text-sm text-[#4D6B57]">
                    Belum ada kegiatan lainnya.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {listKegiatan.map((item) => (
                    <Link
                      key={item.id}
                      href={`/kegiatan/${item.id}`}
                      className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-150 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.nama}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="h-48 w-full bg-[#4a7062]" />
                      )}

                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[#0F3926] line-clamp-1">
                          {item.nama}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-[#4D6B57] line-clamp-3 break-words">
                          {item.deskripsi}
                        </p>

                        <span className="mt-4 inline-flex text-sm font-semibold text-[#0F5139]">
                          Baca lengkap →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}