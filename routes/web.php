<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

Route::get('/', [HomeController::class, 'index']);

// PWA — serve dengan Content-Type yang benar
Route::get('/manifest.json', function () {
    return Response::file(public_path('manifest.json'), [
        'Content-Type' => 'application/manifest+json',
        'Cache-Control' => 'no-cache',
    ]);
});

Route::get('/service-worker.js', function () {
    // Baca Vite manifest untuk dapat path JS dan CSS yang sudah di-hash
    $manifestPath = public_path('build/manifest.json');
    $jsBuildPath  = null;
    $cssBuildPath = null;

    if (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        $jsBuildPath  = isset($manifest['resources/js/app.js']['file'])
            ? '/build/' . $manifest['resources/js/app.js']['file']
            : null;
        $cssBuildPath = isset($manifest['resources/css/app.css']['file'])
            ? '/build/' . $manifest['resources/css/app.css']['file']
            : null;
    }

    // Susun STATIC_ASSETS — gunakan build path kalau ada, fallback ke path lama
    $staticAssets = array_filter([
        '/',
        $cssBuildPath,
        $jsBuildPath,
        '/img/quran.png',
        '/img/icon-192.png',
        '/manifest.json',
    ]);

    $staticAssetsJson = json_encode(array_values($staticAssets));

    // Gunakan mtime file build sebagai versi agar SW update otomatis setiap build
    $version = 'v1.0.1-' . ($jsBuildPath
        ? filemtime(public_path(ltrim($jsBuildPath, '/')))
        : time());

    $content = file_get_contents(public_path('service-worker.js'));

    // Inject SW_VERSION
    $content = preg_replace(
        "/const SW_VERSION\s*=\s*'[^']*'/",
        "const SW_VERSION   = '{$version}'",
        $content
    );

    // Inject STATIC_ASSETS dengan path build yang benar
    $content = preg_replace(
        '/const STATIC_ASSETS\s*=\s*\[[\s\S]*?\];/',
        "const STATIC_ASSETS = {$staticAssetsJson};",
        $content
    );

    return Response::make($content, 200, [
        'Content-Type' => 'application/javascript',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Service-Worker-Allowed' => '/',
    ]);
});
