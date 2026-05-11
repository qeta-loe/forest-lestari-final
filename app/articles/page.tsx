export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] px-4 py-10 text-[#113522] sm:px-6 lg:px-10">
      
      {/* Featured Article - 2 Column Layout */}
<div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl h-64 lg:h-80 overflow-hidden"></div>

  <div>
    {/* Search Navigation di kanan grid */}
    <div className="flex justify-end">
      <div className="flex items-center gap-2 bg-stone-50 rounded-full px-2 py-1 border border-emerald-950">
        <span className="text-emerald-900 text-xs font-['Work_Sans']">Cari</span>
        <svg
          className="w-4 h-4 text-emerald-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <div className="inline-block mb-4">
      <span className="px-3 py-1 bg-stone-50 rounded-full border border-emerald-950 text-xs text-emerald-900 font-['Work_Sans']">
        Edukasi dan Tips
      </span>
    </div>

    <h2 className="text-2xl lg:text-3xl font-bold text-emerald-900 font-['Work_Sans'] mb-4">
      Strategi Pemulihan Ekosistem Mangrove di Pesisir Utara
    </h2>

    <p className="text-emerald-900 text-sm font-normal mb-6">
      Menelaah keberhasilan kolaborasi antara masyarakat adat dan teknologi
      pemantauan satelit dalam merevitalisasi 200 hektar hutan bakau yang
      terdampak abrasi.
    </p>

    <div className="flex items-center">
      <div className="w-12 h-12 bg-zinc-300 rounded-full mr-3"></div>
      <div className="text-emerald-900">
        <p className="font-semibold">Dr. Aris Setyawan</p>
        <p className="text-xs">Dokter Hewan</p>
      </div>
    </div>
  </div>
</div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap  gap-3 mb-10">
        <button className="px-4 py-2 bg-stone-50 rounded-full border border-emerald-950 text-emerald-900 text-sm font-['Work_Sans'] hover:bg-emerald-50 transition-colors">
          Semua
        </button>
        <button className="px-4 py-2 bg-stone-50 rounded-full border border-emerald-950 text-emerald-900 text-sm font-['Work_Sans'] hover:bg-emerald-50 transition-colors">
          Isu Lingkungan
        </button>
        <button className="px-4 py-2 bg-stone-50 rounded-full border border-emerald-950 text-emerald-900 text-sm font-['Work_Sans'] hover:bg-emerald-50 transition-colors">
          Edukasi dan Tips
        </button>
        <button className="px-4 py-2 bg-stone-50 rounded-full border border-emerald-950 text-emerald-900 text-sm font-['Work_Sans'] hover:bg-emerald-50 transition-colors">
          Berita Komunitas
        </button>
      </div>

      {/* Articles Grid - First 4 Articles (1 Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Article Card 1 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-40 bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-stone-50 rounded-full text-xs text-emerald-900 font-['Work_Sans']">18 april 2025</span>
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2 font-['Inter']">
              5 Langkah Sederhana Mengurangi Jejak Karbon ..
            </h3>
            <p className="text-emerald-900 text-xs mb-3">
              Panduan praktis bagi warga perkotaan untuk memulai gaya hidup berkelanjutan melalui pengolahan limbah organik dan efisiensi energi.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-900 text-xs">👤 Siti Aminah</span>
              <span className="text-emerald-900 text-xs flex items-center gap-2">
                Read More <span>→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Card 2 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-40 bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-stone-50 rounded-full text-xs text-emerald-900 font-['Work_Sans']">6 Februari 2026</span>
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2 font-['Inter']">
              Rangkuman Temu Wicara: Masa Depan Hutan ....
            </h3>
            <p className="text-emerald-900 text-xs mb-3">
              Catatan dari pertemuan relawan Forest Lestari membahas tantangan ekspansi lahan dan solusi ekonomi kreaktif lokal.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-900 text-xs">👤 Darmawan J.</span>
              <span className="text-emerald-900 text-xs flex items-center gap-2">
                Read More <span>→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Card 3 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-40 bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-stone-50 rounded-full text-xs text-emerald-900 font-['Work_Sans']">19 Januari 2026</span>
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2 font-['Inter']">
              Krisis Biodiversitas: Spesies Endemik yang Terancam ...
            </h3>
            <p className="text-emerald-900 text-xs mb-3">
              Laporan mendalam mengenai hilangnya habitat fauna langka di wilayah Wallacea dan upaya konservasi mendesak yang diperlukan.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-900 text-xs">👤 Rina Wijaya</span>
              <span className="text-emerald-900 text-xs flex items-center gap-2">
                Read More <span>→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Card 4 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-40 bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-stone-50 rounded-full text-xs text-emerald-900 font-['Work_Sans']">Kabupaten Bogor · 18 April 2025</span>
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2 font-['Inter']">
              5 Langkah Sederhana Mengurangi Jejak Karbon ..
            </h3>
            <p className="text-emerald-900 text-xs mb-3">
              Panduan praktis bagi warga perkotaan untuk memulai gaya hidup berkelanjutan melalui pengolahan limbah organik dan efisiensi energi.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-900 text-xs">👤 Siti Aminah</span>
              <span className="text-emerald-900 text-xs flex items-center gap-2">
                Read More <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid - Last 2 Articles (Wider) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Article Card 5 */}
        <div className="bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 bg-stone-50 rounded-full text-xs text-emerald-900 font-['Work_Sans']">27 Maret 2026</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-['Inter']">
              Pemanfaatan AI dalam Deteksi Dini Kebakaran Hutan di Lahan Gambut
            </h3>
            <p className="text-white text-sm mb-4">
              Bagaimana algoritma kecerdasan buatan memprediksi titik api dengan akurasi 94% sebelum bencana terjadi.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">👤 Taufik H.</span>
              <span className="text-white text-xs flex items-center gap-2">
                Read More <span>→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Card 6 */}
        <div className="bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 bg-stone-50 rounded-full text-xs text-emerald-900 font-['Work_Sans']">1 April 2026</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-['Inter']">
              Pemanfaatan AI dalam Deteksi Dini Kebakaran Hutan di Lahan Gambut
            </h3>
            <p className="text-white text-sm mb-4">
              Bagaimana algoritma kecerdasan buatan memprediksi titik api dengan akurasi 94% sebelum bencana terjadi.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">👤 Taufik H.</span>
              <span className="text-white text-xs flex items-center gap-2">
                Read More <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mb-12">
        <div className="flex gap-2">
          <button className="w-9 h-9 bg-emerald-300 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-emerald-400 transition-colors">1</button>
          <button className="w-9 h-9 bg-emerald-300 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-emerald-400 transition-colors">2</button>
          <button className="w-9 h-9 bg-emerald-300 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-emerald-400 transition-colors">3</button>
          <button className="w-9 h-9 bg-emerald-300 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-emerald-400 transition-colors">4</button>
          <button className="w-9 h-9 bg-emerald-300 rounded-full flex items-center justify-center text-white font-bold hover:bg-emerald-400 transition-colors">›</button>
        </div>
      </div>

      {/* Footer */}
      
    </main>
  );
}