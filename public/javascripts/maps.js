var mymap = L.map('mapid').setView([-27.4490561,-58.9850645], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FybG9zc2FsaW5hczk3IiwiYSI6ImNrZWJtb3hrbTBhNGcyeHFqbGV5dm41NWsifQ.qDA8SWng2dOJlZW4aAy0Dw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);


$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result)
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(mymap)
        })
    }
})