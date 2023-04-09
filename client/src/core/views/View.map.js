import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { getEl } from 'utils/helpers';

import {
  MAP_MAX_BOUNDS,
  MAP_MAX_VISCOSITY,
  MAP_MAX_ZOOM,
  API_MAPTILER_URI,
  MAP_SELECTOR,
  MAP_DEFAULT_COORDS,
  CURRENT,
  FAVORITES,
  MAP_QUERY,
} from 'constants';

import { FavoritesLayerBuilder, MapQueryLayerBuilder, CurrentLayerBuilder } from '../mapLayers';

export default class Map {
  constructor(root, events) {
    this.parent = getEl(root, '[data-root="home"]');

    events.on('setHomeView', this.render);
    events.on('setCurrentLocation', this.#renderCurrentLocation);
    events.on('setMapQuery', this.#renderMapQuery);
  }

  #map;

  render = state => {
    this.#resetMap().#createMap();

    if (state.hasCurrentLocation) this.#loadLayer(CURRENT, state.currentLocation);
    if (state.favorites.length) this.#loadLayer(FAVORITES, state.favorites);
  };

  #renderCurrentLocation = state => {
    if (this.mapQueryLayerBuilder) this.mapQueryLayerBuilder.resetLayer(this.#map);

    this.currentLayerBuilder = new CurrentLayerBuilder();
    this.#loadLayer(CURRENT, state.currentLocation);
  };

  #renderMapQuery = state => {
    if (!this.mapQueryLayerBuilder)
      this.mapQueryLayerBuilder = new MapQueryLayerBuilder(this.parent);

    this.mapQueryLayerBuilder.resetLayer(this.#map);
    this.#loadLayer(MAP_QUERY, state.currentSearch);
  };

  #loadLayer = (layer, payload) => {
    switch (layer) {
      case CURRENT:
        this.currentLayerBuilder.loadLayer(payload, this.#map);
        break;
      case MAP_QUERY:
        this.mapQueryLayerBuilder.loadLayer(payload, this.#map);
        break;
      case FAVORITES:
        if (!this.favoritesLayerBuilder) this.favoritesLayerBuilder = new FavoritesLayerBuilder();

        setTimeout(() => {
          this.favoritesLayerBuilder.loadLayer(payload, this.#map);
        }, 100);
        break;
      default:
        return 'Layer not found';
    }
    return this;
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

  bindMapClick = callback => {
    this.#map.on('click', e => {
      callback(e.latlng);
    });

    return this;
  };

  bindMapQueryGetReport = callback => {
    const getReportCallback = event => {
      this.parent.removeEventListener('click', getReportCallback);

      const getReportBtn = event.target.closest("[data-btn='mapQuery']");
      if (!getReportBtn) return;

      callback();
    };

    this.parent.addEventListener('click', getReportCallback);
  };
}
