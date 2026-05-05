

'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

export default function Home() {
  const [kegiatanCount, setKegiatanCount] = useState(0)
  const [kegiatanTerbaru, setKegiatanTerbaru] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchKegiatanHome = async () => {
    setLoading(true)

    // Ambil jumlah semua kegiatan
    const { count, error: countError } = await supabase
      .from("kegiatan")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.log("COUNT ERROR:", countError)
    } else {
      setKegiatanCount(count || 0)
    }

    // Ambil 3 kegiatan terbaru buat ditampilin di homepage
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("id", { ascending: false })
      .limit(3)

    if (error) {
      console.log("FETCH KEGIATAN ERROR:", error)
    } else {
      setKegiatanTerbaru(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchKegiatanHome()

    // Supaya kalau ada kegiatan baru, jumlah dan list langsung update
    const channel = supabase
      .channel("kegiatan-home-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kegiatan",
        },
        () => {
          fetchKegiatanHome()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const activities = kegiatanTerbaru.map((item) => ({
    title: item.name || 'Aktivitas',
    location: item.location || 'Bogor',
    date: item.date ? new Date(item.date).toLocaleDateString('id-ID') : '',
  }))

  const articles = [
    { title: 'Dampak Deforestasi terhadap Satwa Endemik Jawa', date: '12 April 2026' },
    { title: 'Mengenal Daerah Aliran Sungai Cisadane', date: '28 Maret 2026' },
    { title: 'Tips Konservasi Hutan Hujan Tropis', date: '9 Januari 2026' },
    { title: 'Pengembangan Kehutanan Masyarakat Di Daerah Leuwiliang', date: '16 Februari 2026' },
  ]

  const stats = [
    { value: kegiatanCount.toString(), label: "Kegiatan Selesai", href: "/kegiatan" },
    { value: "12", label: "DAS Terdokumentasi" },
    { value: "37", label: "Spesies Endemik" },
    { value: "3", label: "Mitra Instansi" },
  ]

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
  <div className="p-2 left-[72px] top-[219px] absolute bg-stone-400 rounded-full inline-flex justify-start items-start">
    <div className="w-72 h-4 text-center justify-center text-rose-100 text-sm font-semibold font-['Work_Sans'] leading-4 tracking-wide">KOMUNITAS LINGKUNGAN BOGOR</div>
  </div>
  <div className="w-[699.33px] left-[72px] top-[269px] absolute inline-flex flex-col justify-center items-center">
    <div className="self-stretch justify-center text-emerald-950 text-5xl font-normal font-['Newsreader'] leading-[57.60px]">Bersama Menjaga Kelestarian Hutan &amp; Alam Indonesia</div>
  </div>
  <div className="p-2.5 left-[67px] top-[376px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-[756px] justify-center text-zinc-700 text-lg font-normal font-['Work_Sans'] leading-7">Platform dokumentasi dan informasi kegiatan pelestarian lingkungan komunitas Forest Lestari.</div>
  </div>
  <div className="p-[5px] left-[67px] top-[26px] absolute inline-flex justify-start items-center gap-2.5">
    <img className="w-16 h-16" src="https://placehold.co/70x70" />
  </div>
  <div className="w-64 h-16 p-5 left-[72px] top-[463px] absolute bg-emerald-900 rounded-[50px] inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-stone-50 text-xl font-bold font-['Work_Sans']">Lihat Kegiatan</div>
    <div className="w-4 h-0 bg-stone-50 border-2 border-white" />
  </div>
  <div className="w-80 h-16 p-5 left-[368px] top-[463px] absolute bg-stone-50 rounded-[50px] outline outline-1 outline-offset-[-1px] outline-emerald-950 inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-bold font-['Work_Sans']">Database Lingkungan</div>
    <div className="w-3.5 h-0 border-2 border-emerald-900" />
  </div>
  <div className="w-96 h-96 left-[890px] top-[179px] absolute bg-white/0 rounded-2xl shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.10)] shadow-xl inline-flex flex-col justify-center items-start overflow-hidden">
    <img className="self-stretch flex-1 relative" src="https://placehold.co/445x445" />
    <div className="w-96 h-96 left-0 top-0 absolute bg-gradient-to-l from-emerald-950/40 to-emerald-950/0" />
  </div>
  <div className="w-[1440px] h-[494px] left-0 top-[671px] absolute bg-stone-50 border border-black/10" />
  <div className="w-[1440px] h-0 left-0 top-[829px] absolute outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="w-40 h-0 left-[720px] top-[672px] absolute origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="w-96 h-0 left-[720px] top-[1164px] absolute origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="w-40 h-0 left-[359px] top-[671px] absolute origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="w-40 h-0 left-[1097px] top-[672px] absolute origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
  <div className="p-2.5 left-[67px] top-[838px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Work_Sans']">Kegiatan Terbaru</div>
  </div>
  <div className="p-2.5 left-[67px] top-[1174px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Work_Sans']">Artikel Terbaru</div>
  </div>
  <div className="p-2.5 left-[745px] top-[1174px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Work_Sans']">Peta Lokasi Penanaman</div>
  </div>
  <div className="w-96 h-56 left-[67px] top-[910px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-96 h-56 left-[510px] top-[910px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-96 h-56 left-[953px] top-[910px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-[617px] h-72 left-[752px] top-[1247px] absolute bg-gray-400 rounded-3xl" />
  <div className="w-48 h-56 left-[67px] top-[910px] absolute bg-zinc-300 rounded-tl-3xl rounded-bl-3xl" />
  <div className="w-48 h-56 left-[510px] top-[910px] absolute bg-zinc-300 rounded-tl-3xl rounded-bl-3xl" />
  <div className="w-48 h-56 left-[953px] top-[910px] absolute bg-zinc-300 rounded-tl-3xl rounded-bl-3xl" />
  <div className="p-2.5 left-[288px] top-[1031px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-white text-sm font-normal font-['Inter']">Bogor, 15 Februari 2026</div>
  </div>
  <div className="p-2.5 left-[112px] top-[754px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-normal font-['Inter']">Kegiatan Selesai</div>
  </div>
  <div className="p-2.5 left-[454px] top-[754px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-normal font-['Inter']">DAS Terdokumentasi</div>
  </div>
  <div className="p-2.5 left-[836px] top-[754px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-normal font-['Inter']">Spesies Endemik</div>
  </div>
  <div className="p-2.5 left-[1216px] top-[754px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-normal font-['Inter']">Mitra Instansi</div>
  </div>
  <div className="w-20 p-2.5 left-[137px] top-[705px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Inter']">48</div>
  </div>
  <div className="w-20 p-2.5 left-[492px] top-[705px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Inter']">12</div>
  </div>
  <div className="w-20 p-2.5 left-[863px] top-[705px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Inter']">37</div>
  </div>
  <div className="w-20 p-2.5 left-[1231px] top-[705px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-4xl font-bold font-['Inter']">3</div>
  </div>
  <div className="p-2.5 left-[47px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-normal font-['Inter']">©  Komunitas Forest Lestari - Bogor</div>
  </div>
  <div className="p-2.5 left-[1125px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-bold font-['Inter']">Hubungi Kami</div>
  </div>
  <div className="p-2.5 left-[1263px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-bold font-['Inter']">Login Admin</div>
  </div>
  <div className="p-2.5 left-[1013px] top-[1596px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-sm font-bold font-['Inter']">Kerjasama </div>
  </div>
  <div className="p-2.5 left-[82px] top-[1251px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Dampak Deforestasi terhadap Satwa Endemik Jawa</div>
  </div>
  <div className="p-2.5 left-[82px] top-[1324px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Mengenal Daerah Aliran Sungai Cisadane</div>
  </div>
  <div className="p-2.5 left-[82px] top-[1397px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Tips Konservasi Hutan Hujan Tropis</div>
  </div>
  <div className="p-2.5 left-[82px] top-[1470px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-xl font-normal font-['Inter']">Pengembangan Kehutanan Masyarakat Di Daerah Leuwiliang </div>
  </div>
  <div className="p-2.5 left-[83px] top-[1277px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-[10px] font-normal font-['Inter']">12 April 2026</div>
  </div>
  <div className="p-2.5 left-[83px] top-[1350px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-[10px] font-normal font-['Inter']">28 Maret  2026</div>
  </div>
  <div className="p-2.5 left-[83px] top-[1423px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-[10px] font-normal font-['Inter']">9 Januari  2026</div>
  </div>
  <div className="p-2.5 left-[83px] top-[1496px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-emerald-900 text-[10px] font-normal font-['Inter']">16 Februari  2026</div>
  </div>
  <div className="p-2.5 left-[735px] top-[1031px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-center text-white text-sm font-normal font-['Inter']">Bogor, 20 Maret  2026</div>
  </div>
  <div className="p-2.5 left-[1173px] top-[1031px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-40 text-center justify-center text-white text-sm font-normal font-['Inter']">Jakarta, 9 Mei 2026</div>
  </div>
  <div className="p-2.5 left-[271px] top-[973px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-48 text-center justify-center text-emerald-900 text-xl font-bold font-['Inter']">Penanaman Pohon DAS Cisadane</div>
  </div>
  <div className="p-2.5 left-[714px] top-[973px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-48 text-center justify-center text-teal-950 text-xl font-bold font-['Inter']">Survei Habitat Elang Jawa</div>
  </div>
  <div className="p-2.5 left-[1156px] top-[973px] absolute inline-flex justify-center items-center gap-2.5">
    <div className="w-48 text-center justify-center text-emerald-950 text-xl font-bold font-['Inter']">Bersih Sampah Sungai Ciliwung</div>
  </div>
  <div className="w-14 h-0 left-[77px] top-[1254px] absolute origin-top-left rotate-90 outline outline-[3px] outline-offset-[-1.50px] outline-yellow-950"></div>
  <div className="w-14 h-0 left-[77px] top-[1327px] absolute origin-top-left rotate-90 outline outline-[3px] outline-offset-[-1.50px] outline-yellow-950"></div>
  <div className="w-14 h-0 left-[77px] top-[1400px] absolute origin-top-left rotate-90 outline outline-[3px] outline-offset-[-1.50px] outline-yellow-950"></div>
  <div className="w-14 h-0 left-[77px] top-[1473px] absolute origin-top-left rotate-90 outline outline-[3px] outline-offset-[-1.50px] outline-yellow-950"></div>
  <div className="w-[1440px] h-0 left-[1440px] top-[1562px] absolute origin-top-left rotate-180 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>
</div>
    </main>
  );
}
