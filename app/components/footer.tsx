export default function Footer() {
  return (
    <footer className="mt-auto bg-[#F7F6EF] border-t border-[#E3E8E1]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-10">
        <div className="flex items-center justify-between text-sm">
          {/* Left - Copyright */}
          <div className="flex items-center gap-2 text-[#48755e]">
            <span>©</span>
            <span>Komunitas Forest Lestari - Bogor</span>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-8 text-[#31513E] font-medium">
            <a href="#hubungi" className="hover:text-[#0F5139] transition">
              Hubungi Kami
            </a>
            <a href="#kerjasama" className="hover:text-[#0F5139] transition">
              Kerjasama
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}