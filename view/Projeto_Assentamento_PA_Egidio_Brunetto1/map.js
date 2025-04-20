// Criar o mapa
const map = L.map('map').setView([-23.1404, -45.1509], 14); // Centraliza o mapa no ponto desejado

// Adicionar camada base (OpenStreetMap) 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Modificar a atribuição do Leaflet
map.attributionControl.setPrefix('');
map.attributionControl.addAttribution('&copy; <a href="https://leafletjs.com/" target="_blank">Leaflet</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors |');

// URLs dos arquivos GeoJSON
const geojsonUrl1 = 'http://localhost:3000/geojson?tabela=Cursos_dagua';
const geojsonUrl2 = 'http://localhost:3000/geojson?tabela=Estradas';
const geojsonUrl3 = 'http://localhost:3000/geojson?tabela=Lotes_polgonos';
const geojsonUrl4 = 'http://localhost:3000/geojson?tabela=Nascentes';
const geojsonUrl5 = 'http://localhost:3000/geojson?tabela=Perimetro';
const geojsonUrl6 = 'http://localhost:3000/geojson?tabela=Reserva_Legal'; // <- esta camada vai ter rachura
const geojsonUrl7 = 'http://localhost:3000/geojson?tabela=Reserva_Legal_Compensação';
const geojsonUrl8 = 'http://localhost:3000/geojson?tabela=Rio';


//Estilos
const Cursos_daguaStyle = {
    color: "#1f78b4",   
    weight: 2,          
    opacity: 1,   
};

const EstradasStyle = {
    color: "#a3a694",   
    weight: 1,          
    opacity: 1,             
};

const Lotes_polgonosStyle = {
    color: "#232323",   
    weight: 1,          
    opacity: 1,         
    fillOpacity: 0.1,
    fillColor: "#e8ff10"      
};

const NascentesStyle = {
    pointToLayer: function (feature, latlng) {
        return L.circle(latlng, {
            color: '#1f78b4',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0,
            radius: 10,
            fill: false
        });
    }
};



const PerimetroStyle = {
    color: "#e31a1c",   
    weight: 2,          
    opacity: 1,         
    fillOpacity: 0      
};

const RioStyle = {
    color: "#a6cee3",   
    weight: 2,          
    opacity: 1,         
    fillOpacity: 1,
    fillColor: "#a6cee3"      
};

const Reserva_Legal_CompensaçãoStyle = {
    color: "#33a02c",
    weight: 2,
    opacity: 1,
    fillOpacity: 1,
    fillColor: "url(#hachuraReservaLegal)" // Aponta pro padrão que vamos criar
};


const Reserva_LegalStyle = {
    color: "#d6c316",
    weight: 2,
    opacity: 1,
    fillOpacity: 1,
    fillColor: "url(#pontosReservaLegal)" // Aponta pro padrão que vamos criar
};


// Criar padrão SVG de hachura e pontos (tudo junto em um SVG só!)
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "0");
svg.setAttribute("height", "0");
svg.innerHTML = `
<defs>
  <!-- Padrão de hachura (linhas inclinadas) -->
  <pattern id="hachuraReservaLegal" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
    <line x1="0" y="0" x2="0" y2="8" stroke="#33a02c" stroke-width="2" />
  </pattern>

  <!-- Padrão de pontos (bolinhas) -->
  <pattern id="pontosReservaLegal" patternUnits="userSpaceOnUse" width="8" height="8">
    <circle cx="2" cy="2" r="1" fill="#d6c316" />
  </pattern>
</defs>
`;
document.body.appendChild(svg);



// Função para carregar GeoJSONs com estilos
function loadGeoJSON(url, style, bringToBack = false) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const layer = L.geoJSON(data, {
                style: typeof style.pointToLayer === "undefined" ? style : null,
                pointToLayer: style.pointToLayer || null,
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        let popupContent = '<b>Informações:</b><br>';
                        for (const key in feature.properties) {
                            popupContent += `<b>${key}</b>: ${feature.properties[key]}<br>`;
                        }
                        layer.bindPopup(popupContent);
                    }
                }
            }).addTo(map);

            if (bringToBack) layer.bringToBack();
        })
        .catch(error => console.error('Erro ao carregar o GeoJSON:', error));
}

// Carregar os GeoJSONs
loadGeoJSON(geojsonUrl1, Cursos_daguaStyle, true);
loadGeoJSON(geojsonUrl2, EstradasStyle, true);
loadGeoJSON(geojsonUrl3, Lotes_polgonosStyle, true);
loadGeoJSON(geojsonUrl4, NascentesStyle, true);
loadGeoJSON(geojsonUrl5, PerimetroStyle, true);
loadGeoJSON(geojsonUrl6, Reserva_Legal_CompensaçãoStyle, true); // Aqui usamos o estilo rachurado
loadGeoJSON(geojsonUrl7, Reserva_LegalStyle, true);
loadGeoJSON(geojsonUrl8, RioStyle, true);



