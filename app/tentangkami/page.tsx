import Link from "next/link"
import { getOrganisasi, getTonggak, getGlobalStats } from "@/lib/queries"
import OrganisasiSection from "@/components/tentang/OrganisasiSection"
import TonggakTimeline from "@/components/tentang/TonggakTimeline"
import StatsBar from "@/components/tentang/StatsBar"

export const dynamic = "force-dynamic"

export default async function TentangKamiPage() {
  const [sections, tonggakAll, stats] = await Promise.all([
    getOrganisasi(),
    getTonggak(),
    getGlobalStats(),
  ])

  // ambil tonggak terbaru untuk preview di halaman utama
  const tonggakPreview = tonggakAll.slice(0, 1)

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      {/* HERO */}
      <section className="relative h-[500px] overflow-hidden lg:h-[620px]">
        <img
          src="https://placehold.co/1440x620"
          alt="hero tentang kami"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-14 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-[0.2em] text-white">
                PROFIL KOMUNITAS
              </p>
            </div>

            <h1 className="mt-6 font-['Newsreader'] text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Menjaga Warisan, Melindungi Masa Depan
            </h1>

            <p className="mt-6 text-sm leading-7 text-white/90 sm:text-base lg:max-w-2xl">
              Forest Lestari lahir pada tanggal 13 September 2024 yang bermula
              dari gerakan mahasiswa yang gelisah terhadap keanekaragaman hayati
              Indonesia yang semakin terancam.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex rounded-2xl bg-[#D9E5DC] px-5 py-3">
              <h2 className="text-xl font-bold">Tujuan Strategis</h2>
            </div>

            <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-6 sm:p-8">
              <p className="leading-8 text-zinc-700">
                Memberikan dampak pada rehabilitasi lingkungan melalui edukasi,
                diskusi, dan konservasi terhadap kelestarian satwa dan fauna serta
                berupaya mengurangi dampak kerusakan lingkungan yang terjadi, baik
                di Indonesia maupun di dunia.
              </p>
            </div>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-[32px] bg-zinc-300 lg:aspect-auto lg:h-[420px]">
            <img
              src="https://placehold.co/600x420"
              alt="tujuan strategis"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="mb-16 text-center text-3xl font-bold">
            Struktur Organisasi
          </h2>
          <OrganisasiSection sections={sections} />
        </div>
      </section>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl">
          <StatsBar stats={stats} />
        </div>
      </section>

<section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#315B47]">
    Jejak Langkah
  </p>

  <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-3xl font-bold text-emerald-900">
      Riwayat Pencapaian
    </h2>

    <Link
      href="/tentangkami/pencapaian"
      className="w-fit rounded-full border border-[#113522] px-6 py-3 text-sm transition hover:bg-[#113522] hover:text-white"
    >
      Selengkapnya
    </Link>
  </div>

  <div className="mt-10 grid gap-8 lg:grid-cols-[1.65fr_1fr]">
    {/* CARD RIWAYAT DARI SUPABASE */}
    {tonggakPreview.length > 0 ? (
      tonggakPreview.map((item: any) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-3xl bg-gray-400 shadow-sm"
        >
          <div className="grid min-h-[320px] md:grid-cols-[260px_1fr]">
            <div className="min-h-[260px] bg-zinc-300 md:min-h-[320px]">
              <img
                src={
                  item.image_url ||
                  item.thumbnail_url ||
                  item.gambar_url ||
                  "https://placehold.co/300x400"
                }
                alt={item.judul || item.title || item.nama_tonggak || "Riwayat pencapaian"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-7 text-white sm:p-8">
              <p className="text-xs font-bold text-white">
                {item.tanggal
                  ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : item.created_at
                    ? new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Tanggal belum tersedia"}
              </p>

              <h3 className="mt-4 text-xl font-bold leading-tight text-emerald-900 sm:text-2xl">
                {item.judul ||
                  item.title ||
                  item.nama_tonggak ||
                  "Riwayat Pencapaian"}
              </h3>

              <p className="mt-5 max-w-xl text-xs leading-6 text-white sm:text-sm">
                {item.deskripsi ||
                  item.description ||
                  item.ringkasan ||
                  "Deskripsi pencapaian belum tersedia."}
              </p>

              <Link
                href="/tentangkami/pencapaian"
                className="mt-7 flex w-fit items-center gap-3 text-xs text-white transition hover:underline"
              >
                Lihat detail
                <span className="inline-block h-0 w-4 border-2 border-white" />
              </Link>
            </div>
          </div>
        </article>
      ))
    ) : (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-gray-400 p-8 text-center text-sm font-semibold text-white">
        Belum ada riwayat pencapaian.
      </div>
    )}

    {/* KOTAK STATISTIK DARI SUPABASE */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {[
        {
          value:
            (stats as any)?.pohon_ditanam ??
            (stats as any)?.total_pohon ??
            (stats as any)?.jumlah_pohon ??
            0,
          label: "Pohon ditanam",
        },
        {
          value:
            (stats as any)?.total_relawan ??
            (stats as any)?.relawan ??
            (stats as any)?.jumlah_relawan ??
            0,
          label: "Total relawan",
        },
        {
          value:
            (stats as any)?.area_penghijauan ??
            (stats as any)?.area_penghijauan_ha ??
            (stats as any)?.luas_area ??
            0,
          label: "Area penghijauan (ha)",
        },
        {
          value:
            (stats as any)?.das_dipantau ??
            (stats as any)?.das_dipantau_aktif ??
            (stats as any)?.total_das ??
            0,
          label: "DAS dipantau aktif",
        },
      ].map((item) => (
        <div
          key={item.label}
          className="flex min-h-36 flex-col items-center justify-center rounded-3xl border border-black bg-stone-50 p-6 text-center"
        >
          <p className="text-3xl font-bold text-emerald-900 sm:text-4xl">
            {item.value}
          </p>

          <p className="mt-3 text-sm text-emerald-900">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    </main>
  )
}