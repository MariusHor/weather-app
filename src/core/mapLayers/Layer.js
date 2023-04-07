import L from 'leaflet';

export default class Layer {
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
}

// marker;

// markers = [];

// coords;

// layer;

// createLayer = () => {
//   this.layer = L.layerGroup();
// };

// createClusterLayer = () => {
//   this.layer = L.markerClusterGroup({});
// };

// loadLayer(map) {
//   map.addLayer(this.layer);
//   return this;
// }

// resetLayer() {
//   this.map.removeLayer(this.layer);
//   this.layer = null;

//   return this;
// }

// resetMarkers() {
//   this.marker = null;
//   this.markers = [];

//   return this;
// }

// mount = map => {
//   this.map = map;

//   if (!this.layer) {
//     this.createLayer();
//   }
//   if (this.marker) this.layer.removeLayer(this.marker);

//   this.createMarker();
//   this.layer.addLayer(this.marker);
//   this.map.addLayer(this.layer);
// };

// storeCoords = position => {
//   const { lat, lon } = position.coords;
//   this.coords = [lat, lon];

//   return this;
// };
