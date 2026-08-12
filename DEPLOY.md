# Deploy Al Quran Digital → InfinityFree

## Persiapan Sebelum Upload

### 1. Copy `.env.production` → `.env`
Edit file `.env` dan isi dengan data InfinityFree kamu:

```env
APP_URL=https://YOURDOMAIN.infinityfreeapp.com
APP_DEBUG=false
APP_ENV=production

DB_HOST=sql200.infinityfree.com     # cek di cPanel InfinityFree
DB_DATABASE=YOURUSERNAME_dbname
DB_USERNAME=YOURUSERNAME_dbuser
DB_PASSWORD=YOUR_DB_PASSWORD
```

> ⚠️ Pastikan `APP_DEBUG=false` di production!

### 2. Generate production app key (kalau belum)
```bash
php artisan key:generate
```

### 3. Optimize Laravel untuk production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## File Structure yang Di-upload ke InfinityFree

InfinityFree menggunakan **htdocs** sebagai root folder.
Upload SEMUA file project (kecuali yang di `.gitignore`) ke folder `htdocs`.

```
htdocs/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/           ← file web (CSS, JS, img, index.php)
│   ├── .htaccess     ← PENTING: harus ada
│   ├── .well-known/
│   │   └── assetlinks.json
│   ├── css/
│   ├── js/
│   ├── img/
│   ├── manifest.json
│   ├── service-worker.js
│   └── index.php
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env              ← sudah diisi dengan data production
└── index.php         ← root redirect ke public/
```

### Root `index.php`
Buat file `index.php` di root htdocs (bukan di dalam public/):

```php
<?php

$publicPath = __DIR__ . '/public';

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

if ($uri !== '/' && file_exists($publicPath . $uri)) {
    return false;
}

require_once $publicPath . '/index.php';
```

### Root `.htaccess`
Buat file `.htaccess` di root htdocs:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews
    </IfModule>

    RewriteEngine On

    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    RewriteCond %{REQUEST_FILENAME} -d [OR]
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ ^$1 [N]

    RewriteCond %{REQUEST_URI} (\.\w+$) [NC]
    RewriteRule ^(.*)$ public/$1

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php
</IfModule>
```

---

## Upload via FileZilla FTP

### Cara connect FileZilla:
1. Buka FileZilla
2. Host: `ftpupload.net`
3. Username & Password: dari cPanel InfinityFree → FTP Accounts
4. Port: `21`

### Yang tidak perlu di-upload:
- `node_modules/` (kalau ada)
- `.git/`
- `tests/`
- `.env.example`
- `.env.production`
- `README.md`
- `DEPLOY.md`

---

## Setelah Upload

### 1. Set folder permissions
Via FileZilla, klik kanan folder `storage/` → File permissions → `755` (recursive)
Sama untuk `bootstrap/cache/`

### 2. Cek Laravel berjalan
Buka `https://yourdomain.infinityfreeapp.com` — harus muncul halaman Al Quran.

### 3. Verifikasi PWA
Buka Chrome DevTools (F12) → Application tab:
- ✅ Manifest: tidak ada error
- ✅ Service Workers: status "activated and running"
- ✅ Icons: tampil

### 4. Test install di HP Android
Buka Chrome di HP → buka URL → muncul banner "Tambahkan ke layar utama" → Install.

---

## Generate APK via PWABuilder

1. Buka **https://pwabuilder.com**
2. Masukkan URL: `https://yourdomain.infinityfreeapp.com`
3. Tunggu analisis selesai (semua harus hijau/kuning)
4. Klik **Package for Stores** → pilih **Android**
5. Download zip → di dalam ada APK

### Update `assetlinks.json` (untuk TWA proper):
Setelah download dari PWABuilder, buka file `assetlinks.json` yang ada di dalam zip.
Copy isi SHA-256 fingerprint-nya → paste ke `public/.well-known/assetlinks.json`:

```json
[{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
        "namespace": "android_app",
        "package_name": "com.yourname.alquran",
        "sha256_cert_fingerprints": [
            "AA:BB:CC:DD:..."
        ]
    }
}]
```

Upload ulang `assetlinks.json` ke server.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| 500 Internal Server Error | Cek `.env` sudah diisi, `APP_DEBUG=true` sementara untuk lihat error |
| CSS/JS tidak load | Cek `APP_URL` di `.env` sudah sesuai domain |
| Service Worker tidak register | Pastikan HTTPS aktif, cek header di DevTools → Network |
| PWA tidak bisa di-install | Cek manifest.json valid, harus ada icon 192 & 512 |
| Storage permission error | Set chmod 755 untuk `storage/` dan `bootstrap/cache/` |
| Halaman 404 | Pastikan root `.htaccess` dan `index.php` ada di htdocs root |

---

## Checklist Akhir

- [ ] `.env` sudah diisi dengan data production
- [ ] `APP_DEBUG=false`
- [ ] Root `index.php` dan `.htaccess` dibuat
- [ ] Semua file ter-upload ke `htdocs/`
- [ ] `storage/` permission 755
- [ ] HTTPS aktif di cPanel
- [ ] Test buka di browser → halaman muncul
- [ ] Test PWA install di Chrome Android
- [ ] (Opsional) Generate APK via PWABuilder
- [ ] (Opsional) Update `assetlinks.json` dengan SHA-256 dari APK
