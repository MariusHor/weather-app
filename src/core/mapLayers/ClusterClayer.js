import L from 'leaflet';

export default class ClusterLayer {
  static create = () => {
    const layer = L.markerClusterGroup();
    return layer;
  };

  getLayer = favorites => {
    const layer = ClusterLayer.create();

    favorites.forEach(favorite => {
      const marker = this.createMarker(favorite.coords);
      layer.addLayer(marker);
    });

    return layer;
  };

  loadLayer(favorites, map) {
    this.layer = this.getLayer(favorites);
    map.addLayer(this.layer);
  }

  resetLayer = map => {
    if (this.layer) map.removeLayer(this.layer);
    this.layer = null;
  };
}
