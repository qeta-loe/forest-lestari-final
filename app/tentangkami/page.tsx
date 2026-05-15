import Link from "next/link"; 
export default function TentangKamiPage() {
  const trustees = [
    {
      nama: "Dr. Ir Nandi Kosmaryandi",
      jabatan: "Board of Trustees",
      image: "https://placehold.co/300x300",
    },
    {
      nama: "Adam Maulana S.Hut M.Si",
      jabatan: "Board of Trustees",
      image: "https://placehold.co/300x300",
    },
  ];

  const executives = [
    {
      nama: "Zulian Akbar F",
      jabatan: "Executive Director",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Sandi Saputra",
      jabatan: "Partnership Manager",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Chalis Ghuftta",
      jabatan: "Research Manager",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Shaumi Azzahra",
      jabatan: "Operational Manager",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Andika Satria P",
      jabatan: "Program Manager",
      image: "https://placehold.co/300x240",
    },
  ];

  const teams = [
    {
      nama: "Aufa Dzuljalali",
      jabatan: "Biodiversity & Forest Carbon",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Lidya Maulida",
      jabatan: "Animal Rehabilitation & Conservation",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Hilmy Abdul Azis",
      jabatan: "Biodiversity & Marine Conservation",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Rizky Arkananta",
      jabatan: "Social & Environmental",
      image: "https://placehold.co/300x240",
    },
    {
      nama: "Ahmad Hariz Faza",
      jabatan: "Media Branding",
      image: "https://placehold.co/300x240",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-[#113522]">
      {/* HERO */}
      <section className="relative h-[500px] overflow-hidden lg:h-[620px]">
        <img
          src="https://placehold.co/1440x620"
          alt="hero"
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

            <p className="mt-6 text-sm leading-7 text-white/90 sm:text-base">
              Forest Lestari lahir pada tanggal 13 September 2024 yang
              bermula dari gerakan mahasiswa yang gelisah terhadap
              keanekaragaman hayati Indonesia yang semakin terancam.
            </p>
          </div>
        </div>
      </section>

      {/* TUJUAN */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex rounded-2xl bg-[#D9E5DC] px-5 py-3">
              <h2 className="text-xl font-bold">
                Tujuan Strategis
              </h2>
            </div>

            <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-8">
              <p className="leading-8 text-zinc-700">
                Memberikan dampak pada rehabilitasi lingkungan melalui
                edukasi, diskusi, dan konservasi terhadap kelestarian
                satwa dan fauna.
              </p>
            </div>
          </div>

          <div className="h-[300px] rounded-[32px] bg-zinc-300 lg:h-[420px]" />
        </div>
      </section>

      {/* STRUKTUR */}
      <section className="border-y border-black/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-3xl font-bold">
            Struktur Organisasi
          </h2>

          {/* TRUSTEES */}
          <div className="mt-16">
            <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
              <p className="font-semibold text-[#113522]">
                Board of Trustees
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {trustees.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.nama}
                    className="h-[320px] w-full object-cover"
                  />

                  <div className="bg-[#6D6D6D] p-5 text-center">
                    <h3 className="text-lg font-bold text-white">
                      {item.nama}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXECUTIVES */}
          <div className="mt-24">
            <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
              <p className="font-semibold text-[#113522]">
                Executives
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {executives.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.nama}
                    className="h-[240px] w-full object-cover"
                  />

                  <div className="bg-[#6D6D6D] p-5 text-center">
                    <h3 className="font-bold text-white">
                      {item.nama}
                    </h3>

                    <p className="mt-2 text-sm text-[#113522]">
                      {item.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM */}
          <div className="mt-24">
            <div className="mx-auto mb-10 w-fit rounded-2xl bg-white px-6 py-3 shadow-sm">
              <p className="font-semibold text-[#113522]">
                The Team
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teams.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.nama}
                    className="h-[240px] w-full object-cover"
                  />

                  <div className="bg-[#6D6D6D] p-5 text-center">
                    <h3 className="font-bold text-white">
                      {item.nama}
                    </h3>

                    <p className="mt-2 text-sm text-[#113522]">
                      {item.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RIWAYAT */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#315B47]">
          Jejak Langkah
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold">
            Riwayat Pencapaian
          </h2>

          <button className="rounded-full border border-[#113522] px-6 py-3 text-sm transition hover:bg-[#113522] hover:text-white">
            Selengkapnya
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* CARD */}
          <div className="overflow-hidden rounded-[32px] bg-[#4F4F4F]">
            <div className="grid md:grid-cols-[280px_1fr]">
              <img
                src="https://placehold.co/300x400"
                alt="program"
                className="h-full w-full object-cover"
              />

              <div className="p-8 text-white">
                <p className="text-xs">3 Maret 2025</p>

                <h3 className="mt-3 text-2xl font-bold text-[#D7F4E4]">
                  Penanaman 300 Pohon di DAS Cisadane
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/90">
                  Rehabilitasi kawasan riparian sepanjang 4,2 km di
                  hulu DAS Cisadane bersama komunitas lokal dan
                  mahasiswa IPB.
                </p>

                <Link
                href="/tentangkami/pencapaian"
                className="mt-8 flex items-center gap-3 text-sm"
                >
                Lihat detail →
              </Link>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-5">
            {[
              ["340", "Pohon ditanam"],
              ["52", "Total relawan"],
              ["455", "Area penghijauan (ha)"],
              ["4", "DAS dipantau aktif"],
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-black bg-white p-6 text-center"
              >
                <h3 className="text-4xl font-bold text-[#113522]">
                  {item[0]}
                </h3>

                <p className="mt-3 text-sm text-[#315B47]">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}