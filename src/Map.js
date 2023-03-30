import L from 'leaflet';
import 'leaflet.markercluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet/dist/leaflet.css';

export default class Map {
  #isMapInitialized = false;

  #map;

  #coords;

  #homeMarker;

  #mapZoomLevel = 1;

  #createMap(coords = [50, 20]) {
    const bounds = new L.LatLngBounds(new L.LatLng(-70, -180), new L.LatLng(180, 190));

    this.#map = L.map('map', {
      maxBounds: bounds,
      maxBoundsViscosity: 0.8,
    }).setView(coords, this.#mapZoomLevel);

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.MAP_TILER_KEY}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 2,

        crossOrigin: true,
      },
    ).addTo(this.#map);
  }

  bindMapClick = callback => {
    this.#map.on('click', e => {
      callback(e.latlng);
    });
  };

  #createClusterLayer() {
    this.clusterLayer = L.markerClusterGroup({
      iconCreateFunction: cluster =>
        L.divIcon({
          html: `<div class="cluster-div">${cluster.getChildCount()}</div>`,
        }),
    });
  }

  #createHomeMarker(coords) {
    const greenIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.#homeMarker = L.marker(coords, {
      opacity: 0.8,
      icon: greenIcon,
    })
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'current-position-popup',
        }),
      )
      .setPopupContent('You are here!')
      .on('click', () => {
        this.#homeMarker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.#homeMarker.openPopup();
      })
      .on('mouseout ', () => {
        this.#homeMarker.closePopup();
      })
      .openPopup()
      .addTo(this.#map);
  }

  #getCoords(position) {
    if (position) {
      const { latitude, longitude } = position.coords;
      this.#coords = [latitude, longitude];
    }
    return this.#coords;
  }

  loadMap(position) {
    this.#getCoords(position);

    if (!this.#isMapInitialized) {
      this.#createMap(this.#coords);
      this.#createClusterLayer();

      this.#isMapInitialized = true;
    }

    if (!position) return;

    this.#createHomeMarker(this.#coords);
    this.#map.on('click', () => {
      this.#homeMarker.setOpacity(0.4);
      this.#homeMarker.closePopup();
    });
  }
}
