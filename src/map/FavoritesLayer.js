import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from '../constants/constants';

export default class FavoritesLayer {
  #favLocationsLayer;

  #favMarker;

  #coords;

  createFavMarker = () => {
    const redIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-red.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    this.#favMarker = L.marker(this.#coords, {
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
        this.#favMarker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.#favMarker.openPopup();
      })
      .on('mouseout ', () => {
        this.#favMarker.closePopup();
      })
      .openPopup()
      .addTo(this.map);
  };

  #createFavLocationsLayer() {
    this.#favLocationsLayer = L.markerClusterGroup();
    this.map.addLayer(this.#favLocationsLayer);
  }

  storeCoords = position => {
    const { latitude, longitude } = position.coords;
    this.#coords = [latitude, longitude];

    return this;
  };

  loadLayer = map => {
    this.map = map;
    this.#createFavLocationsLayer();
  };
}
