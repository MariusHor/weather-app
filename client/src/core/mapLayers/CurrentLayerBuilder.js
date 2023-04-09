import L from 'leaflet';
import { GREEN } from 'constants';
import { MapPopup } from 'components';
import Layer from './Layer';

export default class CurrentLayerbuilder extends Layer {
  markerIcon;

  marker;

  popupTimeout;

  createMarker = (location, map) => {
    const { lat, lon } = location.coords;
    const { temp } = location.weatherReport[0].main;
    const weatherIcon = location.weatherReport[0].weather[0].icon;

    this.marker = L.marker([lat, lon], {
      opacity: 0.8,
      icon: this.getMarkerIcon(GREEN),
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
      .setPopupContent(MapPopup(temp, weatherIcon))
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
        }, 2000);
      })
      .openPopup();

    this.initListeners(map);

    return this.marker;
  };
}
