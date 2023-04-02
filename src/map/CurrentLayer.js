import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from '../constants/constants';

export default class CurrentLayer {
  #coords;

  #currentLocationLayer;

  #currentMarker;

  createCurrentMarker() {
    if (this.#currentMarker) this.#currentLocationLayer.removeLayer(this.#currentMarker);

    const blueIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-blue.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
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

  #createCurrentLocationLayer = () => {
    this.#currentLocationLayer = L.layerGroup();
    this.map.addLayer(this.#currentLocationLayer);
  };

  storeCoords = position => {
    const { latitude, longitude } = position.coords;
    this.#coords = [latitude, longitude];

    return this;
  };

  loadLayer = map => {
    this.map = map;
    this.#createCurrentLocationLayer();
  };
}
