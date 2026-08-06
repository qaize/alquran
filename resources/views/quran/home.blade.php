@extends('quran.layout')

@section('search')
    @include('quran.component._search')
@endsection

@section('content')
    <div id='title-detail-surah'></div>
    @include('quran.component._homepage')
@endsection

@section('script')
    @include('quran.component._script')
@endsection
