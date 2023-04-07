import L from 'leaflet';
import { BLUE } from 'constants';
import { MapPopupSecondary } from 'components';
import Layer from './Layer';

export default class MapQueryLayerBuilder extends Layer {
  markerIcon;

  marker;

  popupTimeout;

  createMarker = (location, map) => {
    const { lat, lon } = location.coords;

    this.marker = L.marker([lat, lon], {
      opacity: 0.8,
      icon: this.getMarkerIcon(BLUE),
    })
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 80,
          autoClose: false,
          closeOnClick: false,
          className: 'current-position-popup',
        }),
      )
      .setPopupContent(MapPopupSecondary())
      .on('click', () => {
        if (this.popupTimeout) clearTimeout(this.popupTimeout);
        this.marker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        if (this.popupTimeout) clearTimeout(this.popupTimeout);
        this.marker.setOpacity(0.8);
        this.marker.openPopup();
      })
      .on('mouseout ', () => {
        this.popupTimeout = setTimeout(() => {
          this.marker.setOpacity(0.4);
          this.marker.closePopup();
        }, 4000);
      })
      .openPopup();

    this.initListeners(map);

    return this.marker;
  };
}
