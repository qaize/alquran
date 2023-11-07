@extends('quran.layout')

@section('search')
    @include('quran.component.search')
@endsection

@section('surah')
<div id='title-detail-surah'></div>
@endsection

@section('content')
    @include('quran.component.homepage')
@endsection


@section('script')
    @include('quran.component.script')
    $(function() {
       var listSurah  =  [];
       loadAllSurah().then((data)=>{
        data.forEach(element => {
            listSurah.push(element.nama_latin)

        });
       });

       $( "#search-input" ).autocomplete({
          source: listSurah
       });
    });
 </script>
@endsection
