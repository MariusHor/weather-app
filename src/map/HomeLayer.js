import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from '../constants/constants';

export default class HomeLayer {
  #homeLayer;

  #homeMarker;

  #coords;

  createHomeMarker() {
    const greenIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-green.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    this.#homeMarker = L.marker(this.#coords, {
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
      .openPopup();

    this.#homeLayer.addLayer(this.#homeMarker);

    this.map.on('click', () => {
      this.#homeMarker.setOpacity(0.4);
      this.#homeMarker.closePopup();
    });
  }

  storeCoords = position => {
    const { latitude, longitude } = position.coords;
    this.#coords = [latitude, longitude];

    return this;
  };

  #createHomeLayer = () => {
    this.#homeLayer = L.layerGroup();
    this.map.addLayer(this.#homeLayer);
  };

  loadLayer = map => {
    this.map = map;
    this.#createHomeLayer();
  };
}
