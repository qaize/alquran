@extends('quran.layout')

@section('content')
<div class="banner"><h1>Al Qur'an</h1></div>
<div id="search">
  <input id="search-input" type="text" placeholder="surah" />
  <button id="search-button">
    <i class="fa-solid fa-magnifying-glass"></i>
  </button>
</div>
    <div id="main-body" class="main-body"></div>
    <div id="pagination" class="pagination">
      <button id="prev" class="buttons">Prev</button>
      <button id="next" class="buttons">Next</button>
    </div>
@endsection
