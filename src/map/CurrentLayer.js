import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from '../constants/constants';
import Layer from './Layer';

export default class CurrentLayer extends Layer {
  createMarker() {
    const blueIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-blue.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    this.marker = L.marker(this.coords, {
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
      .setPopupContent('Current!')
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
  }
}
