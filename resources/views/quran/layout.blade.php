<!DOCTYPE html>
<html lang="id">
  <head>
    @include('quran.partials.head')
  </head>
  <body>

    {{-- Three-column layout wrapper --}}
    <div class="app-wrapper">

      @include('quran.partials.sidebar-left')

      {{-- CENTER COLUMN: Search + Content --}}
      <main class="main-content">

        @include('quran.partials.topbar-mobile')

        @yield('search')
                <div class="info animate__animated animate__fadeIn" id="info-section" style="animation-duration:1s;">
          <div class="info-inner animate__animated animate__zoomIn" style="animation-delay:0.2s;animation-duration:0.8s;">
            <span class="info-ornament">﷽</span>
          </div>
          <p class="info-subtitle animate__animated animate__fadeInUp" style="animation-delay:0.5s;animation-duration:0.6s;" data-i18n="bismillah_subtitle">Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
        </div>
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
