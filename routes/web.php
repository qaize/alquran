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
    // Generate versi dinamis berdasarkan waktu modifikasi file CSS/JS
    $latestMtime = max(array_map('filemtime', array_merge(
        glob(public_path('css/*.css')),
        glob(public_path('js/*.js'))
    )));
    $version = 'v1.0.1-' . $latestMtime;

    $content = file_get_contents(public_path('service-worker.js'));
    // Ganti SW_VERSION secara dinamis
    $content = preg_replace(
        "/const SW_VERSION\s*=\s*'[^']*'/",
        "const SW_VERSION   = '{$version}'",
        $content
    );

    return Response::make($content, 200, [
        'Content-Type' => 'application/javascript',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Service-Worker-Allowed' => '/',
    ]);
});
