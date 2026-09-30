# Sistem Manajemen Operasional MBG (WEB-SIPGN)

Sistem Manajemen Operasional MBG adalah platform web modern untuk mengelola profil Mitra dan SPPG. Dibangun dengan fokus pada kecepatan, keamanan, dan antarmuka yang sangat responsif, sistem ini memisahkan jalur otentikasi secara ketat antara **Admin** dan **User**.

## 🚀 Fitur Utama
- **Keamanan Dua Portal (Dual-Portal Login)**:
  - Portal Admin (`/secure-mbg`): Eksklusif hanya untuk super-admin.
  - Portal Mitra/User (`/login`): Akses untuk pengguna biasa dan mitra yayasan.
- **Manajemen Profil Lengkap**: Menampilkan informasi detail SPPG dan Yayasan dengan tata letak *(layout)* kartu profil modern.
- **CRUD Pengguna Mutakhir**: Admin dapat menambahkan, mengedit, menghapus, atau menyalin (copy) akun pengguna secara dinamis melalui antarmuka *modal/pop-up* tanpa harus meninggalkan halaman.
- **Anti-IDOR Protection**: Pengguna biasa (User) hanya dapat mengubah sandi dan *username* miliknya sendiri.
- **Responsivitas Penuh**: Tata letak grid otomatis menyesuaikan dengan layar (Desktop, Tablet, maupun Ponsel).

## 🛠️ Teknologi yang Digunakan
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) (Ikon)
- **Otentikasi**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **Database & ORM**: [PostgreSQL (via Neon)](https://neon.tech/) & [Prisma ORM](https://www.prisma.io/)

## ⚙️ Persyaratan Sistem Lokal (Untuk Development)
1. Node.js (Versi >= 20 disarankan)
2. Akun database PostgreSQL (Bisa menggunakan [Neon DB](https://neon.tech/))

## 📖 Cara Menjalankan Secara Lokal

1. **Unduh (Clone) Repositori**
```bash
git clone https://github.com/Alvinhidayatullah/WEB-SIPGN.git
cd WEB-SIPGN
```

2. **Instal Dependensi**
```bash
npm install
```

3. **Atur Environment Variables**
Buat file bernama `.env` di folder utama aplikasi Anda, lalu isi dengan kunci berikut:
```env
# Koneksi Database PostgreSQL
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

# Kunci Rahasia Autentikasi
NEXTAUTH_SECRET="buat_password_acak_disini_sesuka_hati"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Persiapkan Database (Prisma)**
Kirim struktur tabel ke *database* Anda menggunakan perintah:
```bash
npx prisma db push
```

*(Opsional)* Anda juga dapat mengisi database dengan data percontohan awal:
```bash
npx prisma db seed
```

5. **Jalankan Aplikasi**
```bash
npm run dev
```
Buka peramban *(browser)* dan kunjungi `http://localhost:3000`.

## 🌐 Panduan Deploy ke Vercel
Kompilasi web ini telah dioptimalkan (*ESLint/TypeScript bypass*) agar dapat di-deploy 100% mulus di **Vercel**. 
Langkah-langkah:
1. Hubungkan repositori GitHub ini ke dasbor Vercel Anda.
2. Di menu **Environment Variables**, pastikan Anda memasukkan `DATABASE_URL` (wajib memakai Postgres, bukan SQLite agar permanen) dan `NEXTAUTH_SECRET`.
3. Klik **Deploy** dan Vercel akan otomatis menyusun aplikasinya hingga *online*.

---
*Dikembangkan secara khusus untuk Badan Gizi Nasional (MBG).*
