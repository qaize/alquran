@extends('quran.layout')

@section('search')
<div class="banner"><h1>Al Qur'an</h1></div>
<div id="search">
  <input id="search-input" type="text" placeholder="Cari berdasarkan Surah, Nomor Surah, Arti Surah" />
  <button id="search-button">
    <i class="fa-solid fa-magnifying-glass"></i>
  </button>
  <div class="suggestion"></div>
</div>

@endsection

@section('surah')
<div id='title-detail-surah'></div>
@endsection

@section('content')
    <div id="main-body" class="main-body"></div>
    <div id="loading-screen">
        <div class="loader"></div>
        <p>Loading...</p>
      </div>
    <div id="pagination" class="pagination">
      <button id="prev" class="buttons">Prev</button>
      <button id="next" class="buttons">Next</button>
    </div>
@endsection


@section('script')
<script src="{{asset('js/script.js')}}"></script>
@endsection
