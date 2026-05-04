import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#F7F6EF] border-b border-[#E3E8E1] sticky top-0 z-50">
      <div className="mx-auto max-w-[1280px] px-4 py-4 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo dan Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950 text-white font-bold text-sm">
              FL
            </div>
            <span className="text-sm font-semibold text-emerald-900 uppercase tracking-[0.15em]">
              Forest Lestari
            </span>
          </Link>

          {/* Menu Navigasi */}
          <ul className="flex items-center gap-8 text-sm text-[#31513E] font-medium">
            <li>
              <Link href="/" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/articles" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
                Artikel
              </Link>
            </li>
            <li>
              <Link href="/kegiatan" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
                Kegiatan
              </Link>
            </li>
            <li>
              <a href="#database" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
                Database
              </a>
            </li>
            <li>
              <a href="#tentang" className="px-3 py-3 rounded-md hover:text-white hover:bg-[#0F5139] transition">
                Tentang Kami
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}