<!DOCTYPE html>
<html lang="id">
  <head>
    @include('quran.partials.head')
    {{-- Init splash secepat mungkin sebelum bundle JS load --}}
    <script>
    (function() {
        // Jika bukan PWA standalone dan sudah pernah tampil di sesi ini, skip
        var isPWA = window.matchMedia('(display-mode: standalone)').matches
                 || window.navigator.standalone === true;
        var shown = sessionStorage.getItem('quran_splash_last_shown');
        if (!isPWA && shown) {
            // Tandai untuk JS bundle agar langsung skip
            window.__splashSkip = true;
        }
    })();
    </script>
  </head>
  <body>

    {{-- ══════════════════════════════════════
         SPLASH SCREEN — muncul saat app dibuka
         ══════════════════════════════════════ --}}
    <div id="splash-screen" aria-hidden="true">
      <div class="splash-bg"></div>

      {{-- Ornamen atas --}}
      <div class="splash-ornament-top">
        <span class="splash-star">✦</span>
        <span class="splash-line"></span>
        <span class="splash-star">✦</span>
      </div>

      {{-- Konten utama --}}
      <div class="splash-content">

        {{-- Ikon --}}
        <div class="splash-icon-wrap">
          <img src="{{ asset('img/icon-192.png') }}" alt="Al Quran Digital" class="splash-icon">
          <div class="splash-icon-ring"></div>
        </div>

        {{-- Bismillah --}}
        <div class="splash-bismillah">﷽</div>

        {{-- Salam --}}
        <div class="splash-salam">
          <p class="splash-salam-arab">اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ</p>
          <p class="splash-salam-latin">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
        </div>

        {{-- Nama app --}}
        <h1 class="splash-title">Al Quran Digital</h1>

        {{-- Kalimat baik (berganti-ganti) --}}
        <div class="splash-quote-wrap">
          <p class="splash-quote" id="splash-quote"></p>
        </div>

      </div>

      {{-- Ornamen bawah --}}
      <div class="splash-ornament-bottom">
        <span class="splash-star">✦</span>
        <span class="splash-line"></span>
        <span class="splash-star">✦</span>
      </div>

      {{-- Loading dots --}}
      <div class="splash-dots">
        <span></span><span></span><span></span>
      </div>
    </div>{{-- #splash-screen --}}

    {{-- Three-column layout wrapper --}}
    <div class="app-wrapper">

      @include('quran.partials.sidebar-left')

      {{-- CENTER COLUMN: Search + Content --}}
      <main class="main-content">

        @include('quran.partials.topbar-mobile')

        @yield('search')
        @yield('surah')
        @yield('content')
      </main>

      @include('quran.partials.sidebar-right')

    </div>{{-- .app-wrapper --}}

    @include('quran.partials.footer')
    @include('quran.partials.loading-screen')

    {{-- Modals & Panels --}}
    @include('quran.partials.modals.juz-panel')
    @include('quran.partials.modals.settings')
    @include('quran.partials.modals.bookmark-panel')
    @include('quran.partials.modals.favorites-panel')

    {{-- Page-specific scripts (e.g. home.blade.php @section('script')) --}}
    @yield('script')

    {{-- Smooth scroll shim — native scroll, compatible dengan CSS Grid layout --}}
    <script>
    (function initScroll() {
        window.__lenis = {
            scrollTo: function(target, opts) {
                if (typeof target === 'number') {
                    window.scrollTo({ top: target, behavior: 'smooth' });
                    return;
                }
                if (typeof target === 'string') {
                    target = document.querySelector(target);
                }
                if (!target) return;
                var offset = (opts && opts.offset) ? opts.offset : -80;
                var rect = target.getBoundingClientRect();
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({
                    top: rect.top + scrollTop + offset,
                    behavior: 'smooth'
                });
            }
        };
    })();
    </script>

  </body>
</html>
