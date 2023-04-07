import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from 'constants';

export default class ClusterLayer {
  static create = () => {
    const layer = L.markerClusterGroup();
    return layer;
  };

  getLayer = (favorites, map) => {
    const layer = ClusterLayer.create();

    favorites.forEach(favorite => {
      const marker = this.createMarker(favorite, map);
      layer.addLayer(marker);
    });

    return layer;
  };

  loadLayer(favorites, map) {
    this.layer = this.getLayer(favorites, map);
    map.addLayer(this.layer);
  }

  resetLayer = map => {
    if (this.layer) map.removeLayer(this.layer);
    this.layer = null;
  };

  initListeners = ({ marker, popupTimeout, map }) => {
    map.on('click', () => {
      if (popupTimeout) clearTimeout(popupTimeout);
      marker.setOpacity(0.4);
      marker.closePopup();
    });

    return this;
  };

  getMarkerIcon = color => {
    this.markerIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-${color}.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    return this.markerIcon;
  };
}
