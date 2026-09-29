import { Info, RefreshCw, Eye, Edit, AlertCircle, Home, FileText, Briefcase, Users, HelpCircle, Ticket, Menu, Search, Bell, Grid, User } from "lucide-react";

export default function ProfilMitraSppg() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-8 z-10 shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          BGN
        </div>
        <nav className="flex flex-col space-y-6">
          <button className="text-slate-400 hover:text-blue-600"><Home size={20} /></button>
          <button className="text-slate-400 hover:text-blue-600"><FileText size={20} /></button>
          <button className="text-blue-600 bg-blue-50 p-2 rounded-lg relative">
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            <Users size={20} />
          </button>
          <button className="text-slate-400 hover:text-blue-600"><Briefcase size={20} /></button>
          <button className="text-slate-400 hover:text-blue-600"><HelpCircle size={20} /></button>
          <button className="text-slate-400 hover:text-blue-600"><Ticket size={20} /></button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b h-14 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center space-x-6">
            <button className="text-slate-500"><Menu size={20} /></button>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="#" className="text-slate-600 hover:text-blue-600">Dashboards</a>
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-4 pt-4">Referensi</a>
              <a href="#" className="text-slate-600 hover:text-blue-600">Laporan Harian</a>
              <a href="#" className="text-slate-600 hover:text-blue-600">Keuangan</a>
              <a href="#" className="text-slate-600 hover:text-blue-600">Lain-lain</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <button><Grid size={18} /></button>
            <button><Bell size={18} /></button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">G</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">Profil Mitra & SPPG</h1>
                <div className="text-sm text-slate-500 mt-1">
                  Home - Mitra & SPPG - Profil Mitra & SPPG - <span className="text-slate-700">Profil SPPG & Yayasan</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium shadow-sm">
                  <RefreshCw size={16} /> Dashboards
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 text-sm font-medium shadow-sm">
                  <Eye size={16} /> Overview
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm">
                  <Edit size={16} /> Edit Profil SPPG
                </button>
              </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-800">Profil SPPG & Yayasan</h2>
                <button className="flex items-center gap-2 px-3 py-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md text-sm font-medium transition-colors">
                  <RefreshCw size={14} /> Refresh Data
                </button>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Alert */}
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3 text-sm leading-relaxed">
                  <div className="mt-0.5 shrink-0">
                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">!</div>
                  </div>
                  <p>
                    Silakan periksa kelengkapan maupun ketidaksesuaian data Profil SPPG & Yayasan ini beserta kelengkapan data lainnya, apabila terdapat kekurangan silakan klik tombol <span className="inline-flex items-center gap-1 border rounded px-1 py-0.5 bg-white text-xs"><Edit size={10} /> Edit Profil</span> untuk melengkapi maupun memperbaiki data yang ada.
                  </p>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* LEFT COLUMN */}
                  <div className="space-y-8">
                    {/* Section A: Identitas SPPG */}
                    <section>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Identitas SPPG
                      </h3>
                      <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <DataItem label="ID SPPG" value="4NFI4MPR" required info />
                        <DataItem label="Nomor BA. Verval" value="440/BA/VERVAL/JAKARTA/XII/2025" required info />
                        <DataItem label="Tanggal BA. Verval" value="30-12-2025" required info />
                        <DataItem label="Status Operasional" value="Beroperasi" required info />
                        <DataItem label="Tanggal Operasional/Rencana" value="06-01-2026" required info />
                        <DataItem label="Kode SPPG" value="32.01.06.2001.15" required info />
                        <DataItem label="Nama SPPG" value="SPPG Bogor Jonggol Sukamaju 3" required info />
                        <DataItem label="Provinsi" value="JAWA BARAT" required info />
                        <DataItem label="Kab./Kota" value="BOGOR" required info />
                        <DataItem label="Kecamatan" value="JONGGOL" required info />
                        <DataItem label="Kelurahan/Desa" value="SUKAMAJU" required info />
                        <DataItem label="Alamat" value="Ciganitri Tengah No.29, RT 004, RW 003" required info colSpan={2} />
                        <DataItem label="Kode Pos" value="40287" required info />
                        <DataItem label="Posisi Latitude" value="-6.9690927" info />
                        <DataItem label="Posisi Longitude" value="107.6489864" info />
                        <DataItem label="Jenis / Asal Bangunan SPPG" value="Rumah Tinggal" required info />
                        <DataItem label="Jenis SPPG" value="SPPG Mitra" required info />
                      </div>
                    </section>

                    {/* Section B: Data SPPI/Kasatpel/Ka SPPG */}
                    <section>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Data SPPI/Kasatpel/Ka SPPG
                      </h3>
                      <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <DataItem label="Nama" value="Ginanjar Surya Hardiansyah" required info />
                        <DataItem label="Email" value="ginanjarsuryah@gmail.com" required info />
                        <DataItem label="No. HP/Telepon" value="082120018449" required info />
                      </div>
                      <p className="text-xs text-red-600 italic font-medium mt-4">Kelengkapan data Kasatpel/Ka SPPG lainnya terdapat di menu petugas *</p>
                    </section>

                    {/* Section C: Identitas Mitra */}
                    <section>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Identitas Mitra
                      </h3>
                      <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
                      <p className="text-xs text-blue-600 font-medium italic mb-6 leading-relaxed">
                        Data dibawah ini merupakan pihak lain yang bermitra dengan yayasan, jika dominan aset dimiliki oleh yayasan yang bermitra langsung dengan BGN maka silakan isi dengan identitas dan alamat lengkap yayasan tersebut, jika tidak silakan diisi dengan identitas dan alamat mitra yang bekerjasama dengan yayasan <span className="text-red-500">*</span>
                      </p>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <DataItem label="Jenis Mitra/Instansi" value="Yayasan" required info />
                        <DataItem label="Nama Mitra/Instansi" value="Global Humanis Indonesia" required info />
                        <DataItem label="Nama Pimpinan" value="Yogie Subagya" required info />
                        <DataItem label="No. HP/Telepon" value="081210576976" required info />
                        <DataItem label="e-mail" value="globalhumanisindonesia@gmail.com" info />
                        <DataItem label="Bentuk dukungan/kepemilikan aset Mitra" value="Lahan, Bangunan, Alat Makan, Alat Masak, Kendaraan, Tenaga Kerja (Relawan)" required info colSpan={2} />
                        <DataItem label="Provinsi" value="DKI JAKARTA" required info />
                        <DataItem label="Kab./Kota" value="KOTA ADM. JAKARTA SELATAN" required info />
                        <DataItem label="Kecamatan" value="KEBAYORAN BARU" required info />
                        <DataItem label="Kelurahan/Desa" value="GANDARIA UTARA" required info />
                        <DataItem label="Alamat" value="Komplek Ruko Radio Dalam Square Nomr 1B" required info colSpan={2} />
                        <DataItem label="Kode Pos" value="12140" required info />
                      </div>
                    </section>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-8">
                    {/* Section D: Identitas Mitra/Yayasan */}
                    <section>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Identitas Mitra/Yayasan
                      </h3>
                      <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
                      <p className="text-xs text-blue-600 font-medium italic mb-6 leading-relaxed">
                        Data dibawah ini merupakan yayasan yang bermitra langsung dengan BGN, silakan isi dengan identitas dan alamat lengkap yayasan tersebut. <span className="text-red-500">*</span>
                      </p>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <DataItem label="Nama Mitra/Yayasan" value="Yayasan Darma Bandhawa Kulinari" required info />
                        <DataItem label="NPWP" value="1000000003216833" required info />
                        <DataItem label="Provinsi" value="JAWA BARAT" required info />
                        <DataItem label="Kab./Kota" value="KOTA BANDUNG" required info />
                        <DataItem label="Kecamatan" value="BANDUNG KULON" required info />
                        <DataItem label="Kelurahan/Desa" value="GEMPOL SARI" required info />
                        <DataItem label="Alamat" value="Jl. Gempol Asri Raya No 84, Malausma, Kabupaten Majalengka, Jawa Barat" required info colSpan={2} />
                        <DataItem label="Kode Pos" value="40215" required info />
                        <DataItem label="Email" value="darma.bhandawakulinari@gmail.com" required info />
                        <DataItem label="Telepon/HP" value="082315167789" info />
                      </div>
                      <p className="text-xs text-red-600 italic font-medium mt-4">Kelengkapan data yayasan lainnya terdapat di menu Kerjasama *</p>
                    </section>

                    {/* Section E: Data Bank/Rekening */}
                    <section>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Data Bank/Rekening
                      </h3>
                      <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <DataItem label="Nama Bank" value="BANK BNI" required info />
                        <DataItem label="Nomor Rekening" value="2917122527" required info />
                        <DataItem label="Nama Pemilik Rekening" value="Benteng Generasi Mandiri Yayasan" required info colSpan={2} />
                        <DataItem label="Nama Bank Virtual Account" value="BANK BNI" required info />
                        <DataItem label="Nomor Virtual Account" value="5268080020571600" required info />
                        <DataItem label="Nama Virtual Account" value="205716 OWJZUCPO DARMA BAND (IDR)" required info colSpan={2} />
                      </div>
                    </section>

                    {/* Section F: Data Perwakilan Yayasan di SPPG */}
                    <section>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        Data Perwakilan Yayasan di SPPG
                      </h3>
                      <div className="border-t-2 border-dashed border-slate-200 mb-4"></div>
                      <p className="text-xs text-blue-600 font-medium italic mb-6 leading-relaxed">
                        Data dibawah merupakan Perwakilan/PIC/Penanggung Jawab Yayasan yang memegang akun Virtual Account. <span className="text-red-500">*</span>
                      </p>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <DataItem label="Nama Perwakilan" value="DEVI NURJAMAN" required info />
                        <DataItem label="NIK" value="3205121311960006" required info />
                        <DataItem label="Email" value="dnur9414@gmail.com" required info />
                        <DataItem label="No. HP/Telepon" value="089507760120" required info />
                      </div>
                    </section>
                  </div>

                </div>
              </div>
            </div>

          </div>
          
          <footer className="mt-12 pb-4 text-xs text-slate-400 text-center">
            Sistem Manajemen Operasional© 2026 All Right Reserved.
          </footer>
        </main>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">2</span>
        </button>
        <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/></svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">4</span>
        </button>
      </div>
    </div>
  );
}

function DataItem({ label, value, required = false, info = false, colSpan = 1 }: { label: string, value: string, required?: boolean, info?: boolean, colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}>
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {required && <span className="text-red-500 text-xs">*</span>}
        {info && (
          <button className="text-slate-300 hover:text-slate-500" title="Information">
            <Info size={12} />
          </button>
        )}
      </div>
      <div className="text-sm text-slate-800 font-medium break-words">
        {value}
      </div>
    </div>
  );
}
