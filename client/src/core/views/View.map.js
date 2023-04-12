import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { getEl, fetchSingle } from 'utils/helpers';

import {
  MAP_MAX_BOUNDS,
  MAP_MAX_VISCOSITY,
  MAP_MAX_ZOOM,
  MAP_SELECTOR,
  MAP_DEFAULT_COORDS,
  CURRENT,
  FAVORITES,
  MAP_QUERY,
  API_SERVER_URI,
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

  #createTileLayer = async () => {
    const url = `${API_SERVER_URI}tileLayer`;
    try {
      const data = await fetchSingle(url);
      const { tileLayerUrl } = data;

      L.tileLayer(tileLayerUrl, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 2,
        crossOrigin: true,
      }).addTo(this.#map);
    } catch (error) {
      console.log(error);
      throw error;
    }
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
