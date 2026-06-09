"use client"

type MenuKey =
  | "upload"
  | "list"
  | "artikel"
  | "artikelList"
  | "database"
  | "lokasiPenanaman"
  | "daftarLokasiPenanaman"
  | "das"
  | "daftarDas"
  | "pohon"
  | "daftarPohon"
  | "profil"
  | "organisasi"
  | "tonggak"
  | "tonggakList"
  | "mitra"
  | "mitraList"
  | "laporan"
  | "laporanList"
  | "relawan"
  | "relawanList"
  | "program"
  | "programList"
  | "konten"
  | "kontenList"

type Props = {
  menu: MenuKey
  setMenu: (menu: MenuKey) => void
  onLogout: () => void

  setEditingKegiatan: (value: any) => void
  setEditingArtikel: (value: any) => void
  setEditingLokasi: (value: any) => void
  setEditingDas: (value: any) => void
  setEditingPohon: (value: any) => void
  setEditingTonggak: (value: any) => void
  setEditingMitra: (value: any) => void
  setEditingLaporan: (value: any) => void
  setEditingRelawan: (value: any) => void
  setEditingProgram: (value: any) => void
}

export default function AdminSidebar({ menu, setMenu, onLogout, setEditingKegiatan, setEditingArtikel, setEditingLokasi, setEditingDas, setEditingPohon, setEditingTonggak, setEditingMitra, setEditingLaporan, setEditingRelawan, setEditingProgram }: Props) {
  const isKegiatanActive = menu === "upload" || menu === "list"

  const isArtikelActive =
    menu === "artikel" || menu === "artikelList"

  const isDatabaseActive = [
    "database",
    "lokasiPenanaman",
    "daftarLokasiPenanaman",
    "das",
    "daftarDas",
    "pohon",
    "daftarPohon",
  ].includes(menu)

  const isTentangActive = [
    "organisasi",
    "tonggak",
    "tonggakList",
    "mitra",
    "mitraList",
    "laporan",
    "laporanList",
    "relawan",
    "relawanList",
    "program",
    "programList",
  ].includes(menu)

  const isKontenActive =
    menu === "konten" ||
    menu === "kontenList"

  const mainMenuClass = (active: boolean) =>
    `w-full text-left px-4 py-2 rounded-md mb-2 transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139] text-white hover:bg-[#0A3D2A] active:bg-[#06291C]"
        : "text-[#0F5139] hover:bg-gray-100 active:bg-gray-200"
    }`

  const subMenuClass = (active: boolean) =>
    `ml-4 w-[calc(100%-1rem)] text-left px-4 py-2 rounded-md mb-2 text-sm transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139]/10 text-[#0F5139] font-semibold"
        : "text-[#0F5139] hover:bg-gray-100"
    }`

  const subSubMenuClass = (active: boolean) =>
    `ml-8 w-[calc(100%-2rem)] text-left px-4 py-2 rounded-md mb-2 text-sm transition-all duration-150 cursor-pointer active:scale-95 ${
      active
        ? "bg-[#0F5139]/10 text-[#0F5139] font-semibold"
        : "text-[#0F5139] hover:bg-gray-100"
    }`

  const tentangSubmenus: {
    key: MenuKey
    listKey: MenuKey
    label: string
  }[] = [
    {
      key: "organisasi",
      listKey: "organisasi",
      label: "Struktur Organisasi",
    },
    {
      key: "tonggak",
      listKey: "tonggakList",
      label: "Tonggak Pencapaian",
    },
    {
      key: "mitra",
      listKey: "mitraList",
      label: "Jaringan & Mitra",
    },
    {
      key: "laporan",
      listKey: "laporanList",
      label: "Laporan Tahunan",
    },
    {
      key: "relawan",
      listKey: "relawanList",
      label: "Relawan",
    },
    {
      key: "program",
      listKey: "programList",
      label: "Program",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-88px)] w-[260px] border-r bg-[#F7F6EF] p-4">
      <button
        onClick={() => {
          setEditingKegiatan(null)
          setMenu("upload")
        }}
        className={`${mainMenuClass(isKegiatanActive)} flex items-center gap-2`}
      >
        <span
          className={`transition-transform duration-200 ${
            isKegiatanActive ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>

        <span>Kelola Kegiatan</span>
      </button>

      {isKegiatanActive && (
        <button
          onClick={() => setMenu("list")}
          className={subMenuClass(menu === "list")}
        >
          Daftar Kegiatan
        </button>
      )}

      <button
        onClick={() => {
          setEditingArtikel(null)
          setMenu("artikel")
        }}
        className={`${mainMenuClass(isArtikelActive)} flex items-center gap-2`}
      >
        <span
          className={`transition-transform duration-200 ${
            isArtikelActive ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span>Kelola Artikel</span>
      </button>

      {isArtikelActive && (
        <button
          onClick={() => setMenu("artikelList")}
          className={subMenuClass(menu === "artikelList")}
        >
          Daftar Artikel
        </button>
      )}

      <button
        onClick={() => {
          setEditingLokasi(null)
          setMenu("database")
        }}
        className={`${mainMenuClass(isDatabaseActive)} flex items-center gap-2`}
      >
        <span
          className={`transition-transform duration-200 ${
            isDatabaseActive ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span>Kelola Database</span>
      </button>

      {isDatabaseActive && (
        <>
          <button
            onClick={() => {
              setEditingLokasi(null)
              setMenu("lokasiPenanaman")
            }}
            className={subMenuClass(
              menu === "lokasiPenanaman" ||
              menu === "daftarLokasiPenanaman"
            )}
          >
            Lokasi Penanaman
          </button>

          {(menu === "lokasiPenanaman" ||
            menu === "daftarLokasiPenanaman") && (
            <button
              onClick={() => setMenu("daftarLokasiPenanaman")}
              className={subSubMenuClass(
                menu === "daftarLokasiPenanaman"
              )}
            >
              Daftar Lokasi Penanaman
            </button>
          )}

          <button
            onClick={() => {
              setEditingDas(null)
              setMenu("das")
            }}
            className={subMenuClass(menu === "das" || menu === "daftarDas")}
          >
            DAS
          </button>

          {(menu === "das" || menu === "daftarDas") && (
            <button
              onClick={() => setMenu("daftarDas")}
              className={subSubMenuClass(menu === "daftarDas")}
            >
              Daftar DAS
            </button>
          )}

          <button
            onClick={() => {
              setEditingPohon(null)
              setMenu("pohon")
            }}
            className={subMenuClass(menu === "pohon" || menu === "daftarPohon")}
          >
            Pohon
          </button>

          {(menu === "pohon" || menu === "daftarPohon") && (
            <button
              onClick={() => setMenu("daftarPohon")}
              className={subSubMenuClass(menu === "daftarPohon")}
            >
              Daftar Pohon
            </button>
          )}
        </>
      )}

      <button
        onClick={() => setMenu("organisasi")}
        className={`${mainMenuClass(isTentangActive)} flex items-center gap-2`}
      >
        <span
          className={`transition-transform duration-200 ${
            isTentangActive ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span>Kelola Tentang Kami</span>
      </button>
      {isTentangActive &&
        tentangSubmenus.map((item) => {
          const isSubActive = menu === item.key || menu === item.listKey
          return (
            <div key={item.key}>
              <button
                onClick={() => {
                  if (item.key === "tonggak") setEditingTonggak(null)
                  if (item.key === "mitra") setEditingMitra(null)
                  if (item.key === "laporan") setEditingLaporan(null)
                  if (item.key === "relawan") setEditingRelawan(null)
                  if (item.key === "program") setEditingProgram(null)

                  setMenu(item.key)
                }}
                className={subMenuClass(isSubActive)}
              >
                {item.label}
              </button>

              {isSubActive && (
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

        <button
          onClick={() => setMenu("kontenList")}
          className={`${mainMenuClass(isKontenActive)} flex items-center gap-2`}
        >
          <span
            className={`transition-transform duration-200 ${
              isKontenActive ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>

          <span>Kelola Konten Halaman</span>
        </button>

        {isKontenActive && (
          <button
            onClick={() => setMenu("kontenList")}
            className={subMenuClass(menu === "kontenList")}
          >
            Daftar Konten
          </button>
        )}
        <button
          onClick={onLogout}
          className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-left text-white transition hover:bg-red-700 active:scale-95"
        >
          Logout
        </button>
    </div>
  )
}