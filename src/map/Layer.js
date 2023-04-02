import L from 'leaflet';

export default class Layer {
  marker;

  coords;

  layer;

  createLayer = () => {
    this.layer = L.layerGroup();
  };

  createClusterLayer = () => {
    this.layer = L.markerClusterGroup();
  };

  loadLayer(map) {
    map.addLayer(this.layer);

    return this;
  }

  mount(map) {
    if (!this.layer) this.createLayer();
    if (this.marker) this.layer.removeLayer(this.marker);

    this.createMarker();

    this.layer.addLayer(this.marker);
    map.addLayer(this.layer);
  }

  storeCoords = position => {
    const { latitude, longitude } = position.coords;
    this.coords = [latitude, longitude];

    return this;
  };
}
