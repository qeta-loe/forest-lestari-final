import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#E3E8E1] bg-[#F7F6EF]">
      <div className="mx-auto max-w-[1280px] px-4 py-4 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo dan Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950 text-sm font-bold text-white">
              FL
            </div>

            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-900">
              Forest Lestari
            </span>
          </Link>

          {/* Menu Navigasi */}
          <ul className="flex items-center gap-3 text-sm font-medium text-[#31513E] sm:gap-5 lg:gap-8">
            <li>
              <Link
                href="/"
                className="rounded-md px-3 py-3 transition hover:bg-[#0F5139] hover:text-white"
              >
                Beranda
              </Link>
            </li>

            <li>
              <Link
                href="/articles"
                className="rounded-md px-3 py-3 transition hover:bg-[#0F5139] hover:text-white"
              >
                Artikel
              </Link>
            </li>

            <li>
              <Link
                href="/kegiatan"
                className="rounded-md px-3 py-3 transition hover:bg-[#0F5139] hover:text-white"
              >
                Kegiatan
              </Link>
            </li>

            <li>
              <a
                href="#database"
                className="rounded-md px-3 py-3 transition hover:bg-[#0F5139] hover:text-white"
              >
                Database
              </a>
            </li>

            <li>
              <a
                href="#tentang"
                className="flex min-w-[72px] flex-col items-center justify-center rounded-md px-3 py-2 text-center leading-tight transition hover:bg-[#0F5139] hover:text-white sm:min-w-0 sm:flex-row sm:gap-1 sm:whitespace-nowrap sm:py-3"
              >
                <span>Tentang</span>
                <span>Kami</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}