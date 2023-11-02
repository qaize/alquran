<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/ico" href="{{asset('img/quran.png')}}" />
    <link rel="stylesheet" href="{{asset('css/styles.css')}}">
    <script src="{{asset('js/script.js')}}" defer></script>
    <script
      src="https://kit.fontawesome.com/4cbbb9fb69.js"
      crossorigin="anonymous"
      defer
    ></script>

    <title>al - qur'an</title>
  </head>
  <body>
    @yield('search')
    @yield('surah')
    @yield('content')
  </body>
</html>
