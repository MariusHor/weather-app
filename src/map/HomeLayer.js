import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from '../constants/constants';
import Layer from './Layer';

export default class HomeLayer extends Layer {
  createMarker() {
    const greenIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-green.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    this.marker = L.marker(this.coords, {
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
      .setPopupContent('Home!')
      .on('click', () => {
        this.marker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.marker.openPopup();
      })
      .on('mouseout ', () => {
        this.marker.closePopup();
      })
      .openPopup();

    this.map.on('click', () => {
      this.marker.setOpacity(0.4);
      this.marker.closePopup();
    });
  }
}
