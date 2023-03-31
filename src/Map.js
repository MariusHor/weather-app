import L from 'leaflet';
import 'leaflet.markercluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

export default class Map {
  #favLocationsLayer;

  #currentLocationLayer;

  #map;

  #coords;

  homeCoords;

  #homeMarker;

  #currentMarker;

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

  #createFavLocationsLayer() {
    this.#favLocationsLayer = L.markerClusterGroup();
    this.#map.addLayer(this.#favLocationsLayer);
  }

  #createCurrentLocationLayer = () => {
    this.#currentLocationLayer = L.layerGroup();
    this.#map.addLayer(this.#currentLocationLayer);
  };

  #createCurrentMarker() {
    if (this.#currentMarker) this.#currentLocationLayer.removeLayer(this.#currentMarker);

    const blueIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.#currentMarker = L.marker(this.#coords, {
      opacity: 0.8,
      icon: blueIcon,
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
        this.#currentMarker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.#currentMarker.openPopup();
      })
      .on('mouseout ', () => {
        this.#currentMarker.closePopup();
      })
      .openPopup();

    this.#currentLocationLayer.addLayer(this.#currentMarker);
  }

  #createHomeMarker() {
    // if (this.#currentMarker) this.#currentLocationLayer.removeLayer(this.#currentMarker);

    const greenIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.#homeMarker = L.marker(this.homeCoords, {
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

    this.#map.on('click', () => {
      this.#homeMarker.setOpacity(0.4);
      this.#homeMarker.closePopup();
    });
  }

  #createFavMarker = () => {
    if (this.#currentMarker) this.#currentLocationLayer.removeLayer(this.#currentMarker);

    const redIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.marker(this.#coords, {
      opacity: 0.8,
      icon: redIcon,
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

    // this.#map.on('click', () => {
    //   this.#homeMarker.setOpacity(0.4);
    //   this.#homeMarker.closePopup();
    // });
  };

  #storeCoords = position => {
    if (position) {
      const { latitude, longitude } = position.coords;
      this.#coords = [latitude, longitude];
    }
    return this.#coords;
  };

  setCurrentMarker = position => {
    this.#storeCoords(position);
    this.#createCurrentMarker();
  };

  setHomeMarker = position => {
    if (position) {
      const { latitude, longitude } = position.coords;
      this.homeCoords = [latitude, longitude];
    }

    this.#createHomeMarker();
  };

  setFavMarker = position => {
    this.#storeCoords(position);
    this.#createFavMarker();
  };

  bindMapClick = callback => {
    this.#map.on('click', e => {
      callback(e.latlng);
    });

    return this;
  };

  loadMap() {
    this.#createMap();
    this.#createCurrentLocationLayer();
    // this.#createFavLocationsLayer();

    return this;
  }
}
