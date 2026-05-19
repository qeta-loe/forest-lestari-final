"use client"

type MenuKey =
  | "upload" | "list"
  | "artikel" | "artikelList"
  | "database"
  | "lokasiPenanaman" | "daftarLokasiPenanaman"
  | "das" | "daftarDas"
  | "pohon" | "daftarPohon"
  | "profil"
  | "organisasi"
  | "tonggak" | "tonggakList"
  | "mitra" | "mitraList"
  | "laporan" | "laporanList"
  | "relawan" | "relawanList"
  | "program" | "programList"

type Props = {
  menu: MenuKey
  setMenu: (menu: MenuKey) => void
  onLogout: () => void
}

export default function AdminSidebar({ menu, setMenu, onLogout }: Props) {
  const isKegiatanActive = menu === "upload" || menu === "list"
  const isArtikelActive = menu === "artikel" || menu === "artikelList"
  const isDatabaseActive = ["database","lokasiPenanaman","daftarLokasiPenanaman","das","daftarDas","pohon","daftarPohon"].includes(menu)
  const isTentangActive = [
    "organisasi",
    "tonggak", "tonggakList",
    "mitra", "mitraList",
    "laporan", "laporanList",
    "relawan", "relawanList",
    "program", "programList",
  ].includes(menu) 

  const mainMenuClass = (active: boolean) =>
    `w-full text-left px-4 py-2 rounded-md mb-2 transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139] text-white hover:bg-[#0A3D2A] active:bg-[#06291C]"
        : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
    }`

  const subMenuClass = (active: boolean) =>
    `ml-4 w-[calc(100%-1rem)] text-left px-4 py-2 rounded-md mb-2 text-sm transition-all duration-150 cursor-pointer active:scale-95 ${
      active ? "bg-[#0F5139]/10 text-[#0F5139] font-semibold" : "text-[#0F5139] hover:bg-gray-100"
    }`

  const subSubMenuClass = (active: boolean) =>
    `ml-8 w-[calc(100%-2rem)] text-left px-4 py-2 rounded-md mb-2 text-sm transition-all duration-150 cursor-pointer active:scale-95 ${
      active ? "bg-[#0F5139]/10 text-[#0F5139] font-semibold" : "text-[#0F5139] hover:bg-gray-100"
    }`

  const tentangSubmenus: { key: MenuKey; listKey: MenuKey; label: string }[] = [
    { key: "organisasi", listKey: "organisasi", label: "Struktur Organisasi" },
    { key: "tonggak", listKey: "tonggakList", label: "Tonggak Pencapaian" },
    { key: "mitra", listKey: "mitraList", label: "Jaringan & Mitra" },
    { key: "laporan", listKey: "laporanList", label: "Laporan Tahunan" },
    { key: "relawan", listKey: "relawanList", label: "Relawan" },
    { key: "program", listKey: "programList", label: "Program" },
  ]

  return (
    <div className="w-[250px] bg-white border-r p-4">
      <h2 className="text-[#0F5139] font-bold mb-6">Admin Panel</h2>

      {/* Kegiatan */}
      <button onClick={() => setMenu("upload")} className={`${mainMenuClass(isKegiatanActive)} flex items-center gap-2`}>
        <span>▶</span><span>Upload Kegiatan</span>
      </button>
      {isKegiatanActive && (
        <button onClick={() => setMenu("list")} className={subMenuClass(menu === "list")}>
          Daftar Kegiatan
        </button>
      )}

  
      {/* Artikel */}
      <button onClick={() => setMenu("artikel")} className={`${mainMenuClass(isArtikelActive)} flex items-center gap-2`}>
        <span>▶</span><span>Upload Artikel</span>
      </button>
      {isArtikelActive && (
        <button onClick={() => setMenu("artikelList")} className={subMenuClass(menu === "artikelList")}>
          Daftar Artikel
        </button>
      )}

      {/* Database */}
      <button onClick={() => setMenu("database")} className={`${mainMenuClass(isDatabaseActive)} flex items-center gap-2`}>
        <span>▶</span><span>Upload Database</span>
      </button>
      {isDatabaseActive && (
        <>
          <button onClick={() => setMenu("lokasiPenanaman")} className={subMenuClass(menu === "lokasiPenanaman" || menu === "daftarLokasiPenanaman")}>
            Lokasi Penanaman
          </button>
          {(menu === "lokasiPenanaman" || menu === "daftarLokasiPenanaman") && (
            <button onClick={() => setMenu("daftarLokasiPenanaman")} className={subSubMenuClass(menu === "daftarLokasiPenanaman")}>
              Daftar Lokasi Penanaman
            </button>
          )}

          <button onClick={() => setMenu("das")} className={subMenuClass(menu === "das" || menu === "daftarDas")}>
            DAS
          </button>
          {(menu === "das" || menu === "daftarDas") && (
            <button onClick={() => setMenu("daftarDas")} className={subSubMenuClass(menu === "daftarDas")}>
              Daftar DAS
            </button>
          )}

          <button onClick={() => setMenu("pohon")} className={subMenuClass(menu === "pohon" || menu === "daftarPohon")}>
            Pohon
          </button>
          {(menu === "pohon" || menu === "daftarPohon") && (
            <button onClick={() => setMenu("daftarPohon")} className={subSubMenuClass(menu === "daftarPohon")}>
              Daftar Pohon
            </button>
          )}
        </>
      )}

      {/* Tentang Kami */}
      <button
        onClick={() => setMenu("organisasi")}
        className={mainMenuClass(isTentangActive)}
      >
        <span className={`text-xs transition-transform duration-200 ${isTentangActive ? "rotate-90" : ""}`}>▶</span>
        <span>Tentang Kami</span>
      </button>
      {isTentangActive && tentangSubmenus.map((item) => {
        const isSubActive = menu === item.key || menu === item.listKey
        return (
          <div key={item.key}>
            <button
              onClick={() => setMenu(item.key)}
              className={subMenuClass(isSubActive)}
            >
              {item.label}
            </button>
            {/* Sub-list untuk yang punya daftar terpisah */}
            {item.key !== "organisasi" && isSubActive && (
              <button
                onClick={() => setMenu(item.listKey)}
                className={subSubMenuClass(menu === item.listKey)}
              >
                Daftar {item.label}
              </button>
            )}
          </div>
        )
      })}

      {/* Profil */}
      <button onClick={() => setMenu("profil")} className={mainMenuClass(menu === "profil")}>
        Kelola Profil Komunitas
      </button>

      <button
        onClick={onLogout}
        className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-left text-white transition hover:bg-red-700 active:scale-95"
      >
        Logout
      </button>
    </div>
  )
}