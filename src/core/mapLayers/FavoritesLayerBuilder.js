import L from 'leaflet';
import { RED } from 'constants';
import { MapPopup } from 'components';

import ClusterLayer from './ClusterClayer';

export default class FavoritesLayerBuilder extends ClusterLayer {
  markerIcon;

  createMarker = (location, map) => {
    const { lat, lon } = location.coords;
    const { temp } = location.weatherReport[0].main;
    const weatherIcon = location.weatherReport[0].weather[0].icon;
    let popupTimeout;

    const marker = L.marker([lat, lon], {
      opacity: 0.8,
      icon: this.getMarkerIcon(RED),
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
        if (popupTimeout) clearTimeout(popupTimeout);
        marker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        if (popupTimeout) clearTimeout(popupTimeout);
        marker.setOpacity(0.8);
        marker.openPopup();
      })
      .on('mouseout ', () => {
        popupTimeout = setTimeout(() => {
          marker.setOpacity(0.4);
          marker.closePopup();
        }, 2000);
      })
      .openPopup();

    this.initListeners({ marker, popupTimeout, map });

    return marker;
  };
}
