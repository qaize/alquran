<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Proxy Asbabun Nuzul API (CORS workaround)
Route::get('/asbab/surah/{id}', function ($id) {
    $response = Http::withoutVerifying()->get("https://muslim-api-three.vercel.app/v1/quran/ayah/surah", ['id' => $id]);
    return response()->json($response->json());
});

Route::get('/asbab/detail/{id}', function ($id) {
    $response = Http::withoutVerifying()->get("https://muslim-api-three.vercel.app/v1/quran/asbab", ['id' => $id]);
    return response()->json($response->json());
});
