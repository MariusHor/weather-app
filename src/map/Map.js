import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

import {
  MAP_MAX_BOUNDS,
  MAP_MAX_VISCOSITY,
  MAP_MAX_ZOOM,
  CURRENT,
  FAVORITE,
  API_MAPTILER_URI,
  MAP_SELECTOR,
} from '../constants/constants';
import HomeLayer from './HomeLayer';
import CurrentLayer from './CurrentLayer';
import FavoritesLayer from './FavoritesLayer';

export default class Map {
  hasHomePosition;

  map;

  createMap(coords = [50, 20]) {
    this.map = L.map(MAP_SELECTOR, {
      maxBounds: MAP_MAX_BOUNDS,
      maxBoundsViscosity: MAP_MAX_VISCOSITY,
    }).setView(coords, MAP_MAX_ZOOM);

    L.tileLayer(
      `${API_MAPTILER_URI}maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.MAP_TILER_KEY}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 2,
        crossOrigin: true,
      },
    ).addTo(this.map);

    return this;
  }

  setMarker = (type, position) => {
    switch (type) {
      case CURRENT:
        this.currentLayer.storeCoords(position).mount(this.map);
        break;
      case FAVORITE:
        this.favoritesLayer.storeCoords(position).mount(this.map);
        break;
      default:
        this.homeLayer.storeCoords(position).mount(this.map);
        this.hasHomePosition = true;
    }
  };

  resetMarkers(marker) {
    switch (marker) {
      case CURRENT:
        this.currentLayer.resetMarkers();
        break;
      case FAVORITE:
        this.favoritesLayer.resetMarkers();
        break;
      default:
        this.homeLayer.resetMarkers();
    }

    return this;
  }

  createLayer = layer => {
    switch (layer) {
      case CURRENT:
        this.currentLayer = new CurrentLayer();
        break;
      case FAVORITE:
        this.favoritesLayer = new FavoritesLayer();
        break;
      default:
        this.homeLayer = new HomeLayer();
    }
  };

  resetLayer(layer) {
    switch (layer) {
      case CURRENT:
        this.currentLayer.resetLayer();
        break;
      case FAVORITE:
        this.favoritesLayer.resetLayer();
        break;
      default:
        this.homeLayer.resetLayer();
    }

    return this;
  }

  loadLayers() {
    if (this.homeLayer) this.homeLayer.loadLayer(this.map);
    if (this.favoritesLayer) this.favoritesLayer.loadLayer(this.map);

    return this;
  }

  bindMapClick = callback => {
    this.map.on('click', e => {
      callback(e.latlng);
    });

    return this;
  };
}
