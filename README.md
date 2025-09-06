# Aplikasi Kasir (Point of Sales) - Mini Project

Aplikasi ini adalah mini project **Point of Sale (POS)** sederhana yang digunakan untuk mencatat transaksi penjualan, mengelola produk dan pelanggan, serta menghitung diskon otomatis berdasarkan total belanja.  
Project ini dibangun menggunakan **Laravel 12**, **Inertia.js + React**, **TailwindCSS**, dan **MySQL**.

## Tech Stack

- Laravel 11.x
- Inertia
- React
- TailwindCSS
- MySQL

## Authors

- [Rasya Razaqa Setiawan](https://www.github.com/RasyaRazaqaSetiawan)

## 📌 Fitur Utama

| No | Nama Fitur                 | Deskripsi                                                                                     | Status       |
|----|-----------------------------|-----------------------------------------------------------------------------------------------|--------------|
| 1  | **Autentikasi**             | Login sederhana untuk pengguna. Akses fitur lain dibatasi hanya untuk pengguna login.         | ✅ Done      |
| 2  | **Manajemen Produk**        | CRUD produk (kode, nama, harga, stok, kategori) + pencarian & pagination.                     | ✅ Done      |
| 3  | **Manajemen Pelanggan**     | CRUD pelanggan (nama, no HP, email opsional). Bisa ditambahkan langsung dari halaman transaksi.| ✅ Done      |
| 4  | **Transaksi Penjualan (POS)** | Pilih customer, tambahkan produk, input qty, otomatis hitung subtotal, diskon, dan total.    | ✅ Done      |
| 5  | **Skema Diskon Otomatis**   | Diskon otomatis berdasarkan total belanja (≥500K → 10%, ≥1JT → 15%).                          | ✅ Done      |
| 6  | **Manajemen Transaksi**     | Simpan transaksi + detail item, update stok otomatis setiap pembelian.                        | ✅ Done      |
| 7  | **Riwayat Transaksi**       | Lihat daftar transaksi yang sudah dilakukan.                                                  | ✅ Done      |
| 8  | **Print Invoice**           | Cetak nota transaksi.                                                                         | ⏳ On Progress |

---

## 🗄️ Skema Database

Berikut adalah tabel utama yang digunakan pada aplikasi ini:

| No | Nama Tabel            | Deskripsi                                                                 |
|----|-----------------------|---------------------------------------------------------------------------|
| 1  | **users**             | Data pengguna/admin sistem.                                               |
| 2  | **customers**         | Data pelanggan (nama, telepon, email).                                    |
| 3  | **products**          | Data produk (kode, nama, harga, stok, kategori).                          |
| 4  | **transactions**      | Data transaksi (no transaksi, user, customer, subtotal, diskon, total).   |
| 5  | **transactions_items**| Detail item transaksi (produk, qty, harga, subtotal).                     |

### 📷 Diagram Database
![Database Schema](https://github.com/RasyaRazaqaSetiawan/pos-laravel-react/blob/c823c3c8b61748306393b3ab2db2fab5d22a66b9/skema-pos.png)

---

## 💡 Skema Diskon

- Jika total belanja **≥ Rp 500.000** → diskon **10%**  
- Jika total belanja **≥ Rp 1.000.000** → diskon **15%**  
- Diskon hanya berlaku jika memenuhi syarat & dihitung otomatis oleh sistem.  

------------
## 💻 Panduan Instalasi Project

1. **Clone Repository**
```bash
git clone https://github.com/RasyaRazaqaSetiawan/pos-laravel-react 
```

2. **Buka terminal, lalu ketik**
```bash
cd pos-laravel-react
composer install
npm install
cp .env.example .env
php artisan key:generate
```

3. **Buka ```.env``` lalu ubah baris berikut sesuaikan dengan databasemu yang ingin dipakai**
```bash
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

3. **Jalankan bash**
```bash
php artisan config:cache
php artisan storage:link
php artisan route:clear
```

4. **Jalankan migrations dan seeders**
```bash
php artisan migrate --seed
```

5. **Jalankan nodejs (pastikan selalu dijalankan diterminal)**
```bash
npm run dev
```

6. **Jalankan website (pastikan selalu dijalankan diterminal)**
```bash
php artisan serve
```

## Jika ada pertanyaan silahkan hubungi saya di email :

```bash
rasyarazaqasetiawan@gmail.com
```

## Request Fitur Baru dan Pelaporan Bug

Anda dapat meminta fitur baru maupun melaporkan bug melalui menu **issues** yang sudah disediakan oleh GitHub (lihat menu di atas), posting issues baru dan kita akan berdiskusi disana.

## Berkontribusi

Siapapun dapat berkontribusi pada proyek ini mulai dari pemrograman, pembuakan buku manual, sampai dengan mengenalkan produk ini kepada masyarakat Indonesia agar mengurangi kesenjangan pendidikan teknologi dengan cara membuat postingan issue di repository ini.
