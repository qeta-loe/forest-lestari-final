"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Kegiatan {
  id: number
  nama: string
  deskripsi: string
  image_url: string | null
  [key: string]: any
}

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
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const [sebaranIndex, setSebaranIndex] = useState(0)
  const [sebaranTouchStart, setSebaranTouchStart] = useState<number | null>(null)
  const [sebaranTouchEnd, setSebaranTouchEnd] = useState<number | null>(null)

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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
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

    const handleSebaranTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      setSebaranTouchEnd(null)
      setSebaranTouchStart(e.targetTouches[0].clientX)
    }

    const handleSebaranTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
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
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
    <div className="w-[1440px] h-[1668px] relative bg-stone-50 overflow-hidden">
  <div className="w-[1440px] h-32 left-0 top-0 absolute bg-stone-50 border border-black/10" />
  <div className="p-2.5 left-[167px] top-[38px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Newsreader']">Forest Lestari</div>
  </div>
  <div className="w-28 h-12 p-2.5 left-[662px] top-[43px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-stone-900 text-2xl font-normal font-['Work_Sans']">Beranda</div>
  </div>
  <div className="p-2.5 left-[1156px] top-[43px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-stone-900 text-2xl font-normal font-['Work_Sans']">Tentang Kami</div>
  </div>
  <div className="p-2.5 left-[890px] top-[43px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-stone-900 text-2xl font-normal font-['Work_Sans']">Kegiatan</div>
  </div>
  <div className="p-2.5 left-[1018px] top-[43px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-stone-900 text-2xl font-normal font-['Work_Sans']">Database</div>
  </div>
  <div className="p-2.5 left-[786px] top-[43px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-stone-900 text-2xl font-normal font-['Work_Sans']">Artikel</div>
  </div>
  <div className="p-[5px] left-[67px] top-[26px] absolute inline-flex justify-start items-center gap-2.5">
    <img className="w-16 h-16" src="https://placehold.co/70x70" />
  </div>
  <div className="w-[1440px] h-0 left-[1440px] top-[1562px] absolute origin-top-left rotate-180 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="p-2.5 left-[47px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-normal font-['Inter']">©  Komunitas Forest Lestari - Bogor</div>
  </div>
  <div className="p-2.5 left-[67px] top-[160px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Work_Sans']">Kegiatan Komunitas</div>
  </div>
  <div className="p-2.5 left-[67px] top-[214px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Rekam Jejak Seluruh Kegiatan Pelestarian Lingkungan yang Telah Dilakukan</div>
  </div>
  <div className="p-2.5 left-[67px] top-[364px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Lokasi</div>
  </div>
  <div className="p-2.5 left-[67px] top-[585px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Urutkan</div>
  </div>
  <div className="p-2.5 left-[104px] top-[402px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Semua Wilayah</div>
  </div>
  <div className="p-2.5 left-[386px] top-[367px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Menampilkan 48 kegiatan</div>
  </div>
  <div className="p-2.5 left-[104px] top-[623px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Terbaru</div>
  </div>
  <div className="p-2.5 left-[104px] top-[436px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Kota Bogor</div>
  </div>
  <div className="p-2.5 left-[104px] top-[657px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Terlama</div>
  </div>
  <div className="p-2.5 left-[104px] top-[470px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Kabupaten Bogor</div>
  </div>
  <div className="p-2.5 left-[104px] top-[691px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Peserta Terbanyak</div>
  </div>
  <div className="p-2.5 left-[104px] top-[504px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Jakarta</div>
  </div>
  <div className="p-2.5 left-[104px] top-[538px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Inter']">Depok</div>
  </div>
  <div className="w-24 h-9 p-5 left-[77px] top-[267px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Semua</div>
  </div>
  <div className="w-32 h-9 p-5 left-[182px] top-[267px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Penanaman</div>
  </div>
  <div className="w-20 h-9 p-5 left-[319px] top-[267px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Survei</div>
  </div>
  <div className="w-44 h-9 p-5 left-[419px] top-[267px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Bersih Lingkungan</div>
  </div>
  <div className="w-24 h-9 p-5 left-[609px] top-[267px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Edukasi</div>
  </div>
  <div className="w-36 h-9 p-5 left-[1195px] top-[267px] absolute bg-stone-50 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Tahun: 2025</div>
    <div className="w-1.5 h-[5.02px] outline outline-1 outline-offset-[-0.50px] outline-emerald-900" />
  </div>
  <div className="w-[1440px] h-0 left-[1440px] top-[348px] absolute origin-top-left rotate-180 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="w-[1212px] h-0 left-[375px] top-[1562px] absolute origin-top-left -rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="w-6 h-6 p-px left-[77px] top-[408px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[629px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[442px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[663px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[476px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[697px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[510px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-6 h-6 p-px left-[77px] top-[544px] absolute bg-gray-600 rounded-lg inline-flex justify-start items-start gap-2.5">
    <div className="w-6 h-6 bg-white rounded-lg" />
  </div>
  <div className="w-[457px] h-64 left-[413px] top-[800px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-[937px] h-80 left-[415px] top-[424px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-[457px] h-64 left-[413px] top-[1134px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-[457px] h-64 left-[895px] top-[1134px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-[457px] h-64 left-[895px] top-[800px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-32 h-7 p-5 left-[840px] top-[479px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-base font-normal font-['Work_Sans']">Penanaman</div>
  </div>
  <div className="w-16 h-7 p-5 left-[454px] top-[934px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xs font-normal font-['Work_Sans']">Survei</div>
  </div>
  <div className="w-16 h-7 p-5 left-[454px] top-[1268px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xs font-normal font-['Work_Sans']">Survei</div>
  </div>
  <div className="w-16 h-7 p-5 left-[936px] top-[1268px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xs font-normal font-['Work_Sans']">Survei</div>
  </div>
  <div className="w-20 h-7 p-5 left-[946px] top-[934px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xs font-normal font-['Work_Sans']">Edukasi</div>
  </div>
  <div className="w-28 h-7 p-5 left-[840px] top-[652px] absolute bg-stone-50 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xs font-normal font-['Work_Sans']">Lihat Laporan</div>
  </div>
  <div className="w-36 h-7 p-5 left-[970px] top-[652px] absolute bg-stone-50 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xs font-normal font-['Work_Sans']">Unduh Dokumentasi</div>
  </div>
  <div className="w-96 h-80 left-[413px] top-[424px] absolute bg-zinc-300 rounded-tl-3xl rounded-bl-3xl" />
  <div className="w-[457px] h-24 left-[413px] top-[800px] absolute bg-zinc-300 rounded-tl-3xl rounded-tr-3xl" />
  <div className="w-[457px] h-24 left-[413px] top-[1134px] absolute bg-zinc-300 rounded-tl-3xl rounded-tr-3xl" />
  <div className="w-[457px] h-24 left-[895px] top-[1134px] absolute bg-zinc-300 rounded-tl-3xl rounded-tr-3xl" />
  <div className="w-[457px] h-24 left-[895px] top-[800px] absolute bg-zinc-300 rounded-tl-3xl rounded-tr-3xl" />
  <div className="w-[483px] p-2.5 left-[837px] top-[548px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-[471.03px] justify-center text-white text-base font-normal font-['Inter']">Kegiatan penanaman 200 bibit pohon endemik di tepi DAS Cisadane wilayah Bogor bagian barat bersama komunitas dan instansi terkait.</div>
  </div>
  <div className="w-28 p-2.5 left-[827px] top-[612px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-28 text-center justify-center text-white text-xs font-normal font-['Inter']">📍 Bogor Barat</div>
  </div>
  <div className="w-72 p-2.5 left-[448px] top-[998px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-72 text-center justify-center text-white text-xs font-normal font-['Inter']">Kabupaten Bogor  · 18 Peserta  ·  18 April 2025</div>
  </div>
  <div className="w-72 p-2.5 left-[448px] top-[1332px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-72 text-center justify-center text-white text-xs font-normal font-['Inter']">Kabupaten Bogor  · 18 Peserta  ·  18 April 2025</div>
  </div>
  <div className="w-72 p-2.5 left-[930px] top-[1332px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-72 text-center justify-center text-white text-xs font-normal font-['Inter']">Kabupaten Bogor  · 18 Peserta  ·  18 April 2025</div>
  </div>
  <div className="w-72 p-2.5 left-[941px] top-[998px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-72 text-center justify-center text-white text-xs font-normal font-['Inter']">Kota Sukabumi  · 30 Peserta  ·  7 Januari 2025</div>
  </div>
  <div className="w-28 p-2.5 left-[958px] top-[612px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-28 text-center justify-center text-white text-xs font-normal font-['Inter']">👥 42 Peserta</div>
  </div>
  <div className="w-24 p-2.5 left-[1085px] top-[612px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-28 text-center justify-center text-white text-xs font-normal font-['Inter']">🌱 200 bibit</div>
  </div>
  <div className="w-24 h-9 p-2.5 left-[1085px] top-[612px] absolute" />
  <div className="w-28 left-[1212px] top-[483.04px] absolute text-center justify-center text-white text-xs font-normal font-['Inter']">26 Mei 2025</div>
  <div className="w-[482px] p-2.5 left-[838px] top-[509px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-[472px] justify-center text-emerald-900 text-2xl font-bold font-['Inter']">Penanaman Pohon DAS Cisadane</div>
  </div>
  <div className="w-80 p-2.5 left-[455px] top-[965px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-80 justify-center text-emerald-900 text-xl font-bold font-['Inter']">Survei Habitat Elang Jawa</div>
  </div>
  <div className="w-80 p-2.5 left-[455px] top-[1299px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-80 justify-center text-emerald-900 text-xl font-bold font-['Inter']">Survei Habitat Elang Jawa</div>
  </div>
  <div className="w-80 p-2.5 left-[937px] top-[1299px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-80 justify-center text-emerald-900 text-xl font-bold font-['Inter']">Survei Habitat Elang Jawa</div>
  </div>
  <div className="w-80 p-2.5 left-[948px] top-[965px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-80 justify-center text-emerald-900 text-xl font-bold font-['Inter']">Workshop Ecoprint </div>
  </div>
  <div className="w-80 h-11 left-[723px] top-[1460px] absolute">
    <div className="w-11 h-11 p-2.5 left-[138px] top-0 absolute bg-gray-400 rounded-[10px] inline-flex justify-center items-center gap-2.5">
      <div className="text-center justify-center text-stone-50 text-xl font-bold font-['Inter']">3</div>
    </div>
    <div className="w-11 h-11 p-2.5 left-[207px] top-0 absolute bg-gray-400 rounded-[10px] inline-flex justify-center items-center gap-2.5">
      <div className="text-center justify-center text-stone-50 text-xl font-bold font-['Inter']">4</div>
    </div>
    <div className="w-11 h-11 p-2.5 left-[276px] top-0 absolute bg-gray-400 rounded-[10px] inline-flex justify-center items-center gap-2.5">
      <div className="w-3 h-0 border-2 border-stone-50" />
    </div>
    <div className="w-11 h-11 p-2.5 left-[69px] top-0 absolute bg-gray-400 rounded-[10px] inline-flex justify-center items-center gap-2.5">
      <div className="text-center justify-center text-stone-50 text-xl font-bold font-['Inter']">2</div>
    </div>
    <div className="w-11 h-11 p-2.5 left-0 top-0 absolute bg-gray-400 rounded-[10px] inline-flex justify-center items-center gap-2.5">
      <div className="text-center justify-center text-stone-50 text-xl font-bold font-['Inter']">1</div>
    </div>
  </div>
  <div className="p-2.5 left-[1108px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-bold font-['Inter']">Hubungi Kami</div>
  </div>
  <div className="p-2.5 left-[1246px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-bold font-['Inter']">Login Admin</div>
  </div>
  <div className="p-2.5 left-[996px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-bold font-['Inter']">Kerjasama </div>
  </div>
</div>
    </main>
  );
}
