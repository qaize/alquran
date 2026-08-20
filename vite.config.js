import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            // Hanya CSS yang di-bundle Vite
            // JS di-handle terpisah oleh esbuild (lihat package.json scripts)
            input: ['resources/css/app.css'],
            refresh: true,
        }),
    ],
    build: {
        outDir: 'public/build',
        emptyOutDir: false, // false agar output JS esbuild tidak dihapus
        minify: 'esbuild',
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
});
