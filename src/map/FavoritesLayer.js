import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from '../constants/constants';
import Layer from './Layer';

export default class FavoritesLayer extends Layer {
  createMarker = () => {
    const redIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-red.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    const marker = L.marker(this.coords, {
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
      .setPopupContent('Favorite!')
      .on('click', () => {
        marker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        marker.openPopup();
      })
      .on('mouseout ', () => {
        marker.closePopup();
      })
      .openPopup();

    return marker;
  };

  mount(map) {
    this.map = map;

    if (!this.layer) {
      this.createClusterLayer();
      this.map.addLayer(this.layer);
    }

    const marker = this.createMarker();
    this.layer.addLayer(marker);
  }
}
