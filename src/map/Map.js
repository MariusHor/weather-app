import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

import {
  MAP_MAX_BOUNDS,
  MAP_MAX_VISCOSITY,
  MAP_MAX_ZOOM,
  MARKER_CURRENT,
  MARKER_FAVORITE,
} from '../constants/constants';
import HomeLayer from './HomeLayer';
import CurrentLayer from './CurrentLayer';
import FavoritesLayer from './FavoritesLayer';

export default class Map {
  hasHomePosition;

  map;

  createMap(coords = [50, 20]) {
    if (this.map) this.map.remove();

    this.map = L.map('map', {
      maxBounds: MAP_MAX_BOUNDS,
      maxBoundsViscosity: MAP_MAX_VISCOSITY,
    }).setView(coords, MAP_MAX_ZOOM);

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.MAP_TILER_KEY}`,
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
      case MARKER_CURRENT:
        this.currentLayer.storeCoords(position).mount(this.map);
        break;
      case MARKER_FAVORITE:
        this.favoritesLayer.storeCoords(position).mount(this.map);
        break;
      default:
        this.homeLayer.storeCoords(position).mount(this.map);
        this.hasHomePosition = true;
    }
  };

  bindMapClick = callback => {
    this.map.on('click', e => {
      callback(e.latlng);
    });

    return this;
  };

  resetLayer(layer) {
    switch (layer) {
      case 'current':
        this.currentLayer.layer.removeLayer(this.currentLayer.marker);
        this.currentLayer.marker = null;
        break;
      case 'favorites':
        this.favoritesLayer.layer = null;
        this.favoritesLayer.markers = [];
        break;
      default:
        this.homeLayer.layer = null;
        this.hasHomePosition = false;
    }
  }

  createLayers() {
    this.homeLayer = new HomeLayer(this.map);
    this.currentLayer = new CurrentLayer(this.map);
    this.favoritesLayer = new FavoritesLayer(this.map);
  }

  loadLayers() {
    if (this.homeLayer.layer) this.homeLayer.loadLayer(this.map);
    if (this.favoritesLayer.layer) this.favoritesLayer.loadLayer(this.map);

    return this;
  }
}
