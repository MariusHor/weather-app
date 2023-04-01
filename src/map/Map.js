import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

import { MAP_MAX_BOUNDS, MAP_MAX_VISCOSITY, MAP_MAX_ZOOM } from '../constants/constants';
import HomeLayer from './HomeLayer';
import CurrentLayer from './CurrentLayer';
import FavoritesLayer from './FavoritesLayer';

export default class Map {
  constructor() {
    this.homeLayer = new HomeLayer();
    this.currentLayer = new CurrentLayer();
    this.favoritesLayer = new FavoritesLayer();
  }

  isHomeSaved;

  #createMap(coords = [50, 20]) {
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
  }

  setCurrentMarker = position => {
    this.currentLayer.storeCoords(position).createCurrentMarker();
  };

  setHomeMarker = position => {
    this.homeLayer.storeCoords(position).createHomeMarker();
    this.isHomeSaved = true;
  };

  setFavMarker = position => {
    this.favoritesLayer.storeCoords(position).createFavMarker();
  };

  bindMapClick = callback => {
    this.map.on('click', e => {
      callback(e.latlng);
    });

    return this;
  };

  loadMap = () => {
    this.#createMap();

    this.homeLayer.loadLayer(this.map);
    this.currentLayer.loadLayer(this.map);
    this.favoritesLayer.loadLayer(this.map);

    return this;
  };
}
