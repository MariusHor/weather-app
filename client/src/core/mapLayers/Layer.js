import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from 'constants';

export default class Layer {
  constructor(parent) {
    this.parent = parent;
  }

  static create = () => {
    const layer = L.layerGroup();
    return layer;
  };

  setupLayer = (coords, map) => {
    const layer = Layer.create();
    const marker = this.createMarker(coords, map);
    layer.addLayer(marker);

    return layer;
  };

  loadLayer(coords, map) {
    this.layer = this.setupLayer(coords, map);
    map.addLayer(this.layer);
  }

  resetLayer = map => {
    if (this.layer) map.removeLayer(this.layer);
    this.layer = null;
  };

  initListeners = map => {
    map.on('click', () => {
      if (this.popupTimeout) clearTimeout(this.popupTimeout);

      this.marker.setOpacity(0.4);
      this.marker.closePopup();
    });
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
