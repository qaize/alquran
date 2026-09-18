# Al-Quran Digital

Aplikasi Al-Quran digital berbasis web dengan fitur lengkap: baca Al-Quran, tajwid, jadwal sholat, dzikir, hadist, dan lainnya.

🌐 **Live:** [https://qurandigi.xo.je/](https://qurandigi.xo.je/)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | PHP 8.2+, Laravel 11 |
| Frontend | Blade Template, Vanilla JS, CSS |
| Build Tool | Vite (CSS), esbuild (JS) |
| PWA | Service Worker, Web App Manifest |
| HTTP Client | Axios, Guzzle |
| Testing | PHPUnit 10 |
| Code Quality | Laravel Pint |

---

## Struktur Proyek

```
alquran/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── HomeController.php      # Controller utama
│   ├── Models/
│   │   └── User.php
│   └── Providers/
│       └── AppServiceProvider.php
├── resources/
│   ├── views/
│   │   └── quran/
│   │       ├── layout.blade.php        # Layout utama
│   │       ├── home.blade.php          # Halaman utama
│   │       ├── partials/               # Komponen partial (sidebar, topbar, modal, dll)
│   │       └── component/             # Komponen blade (script, search, homepage)
│   ├── css/
│   │   └── app.css                    # CSS entry point (di-bundle Vite)
│   └── js/
│       └── app.js                     # JS entry point
├── public/
│   ├── js/                            # JS hasil build (esbuild)
│   │   ├── script.js                  # Script utama Al-Quran
│   │   ├── prayer-time.js             # Jadwal sholat
│   │   ├── dzikir.js                  # Dzikir & doa
│   │   ├── hadist.js                  # Hadist
│   │   ├── tajweed.js                 # Ilmu tajwid
│   │   ├── audio.js                   # Pemutar audio
│   │   ├── bookmarks.js               # Bookmark ayat
│   │   ├── favorites.js               # Favorit surat
│   │   ├── last-read.js               # Terakhir dibaca
│   │   ├── settings.js                # Pengaturan
│   │   └── ...
│   ├── css/                           # CSS hasil build (Vite)
│   ├── fonts/                         # Font Al-Quran
│   ├── img/                           # Gambar & ikon
│   ├── service-worker.js              # PWA Service Worker
│   └── manifest.json                  # PWA Manifest
├── routes/
│   └── web.php                        # Routing (/, /manifest.json, /service-worker.js)
├── database/
│   └── migrations/
├── vite.config.js                     # Konfigurasi Vite (CSS build)
├── build-js.mjs                       # Script build JS dengan esbuild
└── package.json
```

---

## Cara Penggunaan (Shared Hosting / Apache)

### 1. Buat file `index.php` pada root folder

```php
<?php

$publicPath = __DIR__ . '/public';

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

/**
 * This file allows us to emulate Apache's "mod_rewrite" functionality from the
 * built-in PHP web server. This provides a convenient way to test a Laravel
 * application without having installed a "real" web server software here.
 */
if ($uri !== '/' && file_exists($publicPath . $uri)) {
    return false;
}

require_once $publicPath . '/index.php';
```

### 2. Buat file `.htaccess` pada root folder

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
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

### 3. Buat file `.htaccess` pada folder `public`

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```
