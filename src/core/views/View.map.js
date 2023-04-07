import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';

import {
  MAP_MAX_BOUNDS,
  MAP_MAX_VISCOSITY,
  MAP_MAX_ZOOM,
  API_MAPTILER_URI,
  MAP_SELECTOR,
  MAP_DEFAULT_COORDS,
} from 'constants';

import { FavoritesLayerBuilder, MapQueryLayerBuilder, CurrentLayerBuilder } from '../mapLayers';

export default class Map {
  constructor(events) {
    events.on('setHomeView', this.render);
    events.on('setCurrentLocation', this.#renderCurrentLocation);
    events.on('setMapQuery', this.#renderMapQuery);
  }

  #map;

  bindMapClick = callback => {
    this.#map.on('click', e => {
      callback(e.latlng);
    });

    return this;
  };

  render = state => {
    this.#resetMap().#createMap();

    if (state.hasCurrentLocation) this.#loadCurrentLayer(state.currentLocation.coords);
    if (state.favorites.length) this.#loadFavoritesLayer(state.favorites);
  };

  #renderCurrentLocation = state => {
    if (this.mapQueryLayerBuilder) this.mapQueryLayerBuilder.resetLayer(this.#map);

    this.currentLayerBuilder = new CurrentLayerBuilder();
    this.currentLayerBuilder.loadLayer(state.currentLocation.coords, this.#map);
  };

  #renderMapQuery = state => {
    if (!this.mapQueryLayerBuilder) this.mapQueryLayerBuilder = new MapQueryLayerBuilder();

    this.mapQueryLayerBuilder.resetLayer(this.#map);
    this.mapQueryLayerBuilder.loadLayer(state.currentSearch.coords, this.#map);
  };

  #loadFavoritesLayer = favorites => {
    if (!this.favoritesLayerBuilder) this.favoritesLayerBuilder = new FavoritesLayerBuilder();

    setTimeout(() => {
      this.favoritesLayerBuilder.loadLayer(favorites, this.#map);
    }, 100);
  };

  #loadCurrentLayer = coords => {
    this.currentLayerBuilder.loadLayer(coords, this.#map);
  };

  #createMap(coords = MAP_DEFAULT_COORDS) {
    this.#map = L.map(MAP_SELECTOR, {
      maxBounds: MAP_MAX_BOUNDS,
      maxBoundsViscosity: MAP_MAX_VISCOSITY,
    }).setView(coords, MAP_MAX_ZOOM);

    this.#createTileLayer();

    return this;
  }

  #resetMap = () => {
    if (this.#map) this.#map = null;
    return this;
  };

  #createTileLayer = () => {
    L.tileLayer(
      `${API_MAPTILER_URI}maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.MAP_TILER_KEY}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 2,
        crossOrigin: true,
      },
    ).addTo(this.#map);
  };
}
