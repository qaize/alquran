/**
 * app.js — Vite entry point
 *
 * Import semua JS sebagai virtual module (plain script, bukan ES module).
 * Dengan cara ini semua global function tetap tersedia di window scope.
 */
import 'virtual:global-js';
