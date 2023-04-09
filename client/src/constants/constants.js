import L from 'leaflet';

export const MAP_SELECTOR = 'map';
export const CURRENT = 'current';
export const MAP_QUERY = 'mapQuery';
export const FAVORITES = 'favorites';
export const BLUE = 'blue';
export const GREEN = 'green';
export const RED = 'red';

export const API_MAPTILER_URI = 'https://api.maptiler.com/';
export const API_WEATHER_URI = 'https://api.openweathermap.org/';

export const MARKER_ICON_URI =
  'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/';
export const MARKER_SHADOW_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';

export const MAX_FAV_COUNT = 3;
export const MAP_MAX_VISCOSITY = 0.8;
export const MAP_MAX_ZOOM = 1;
export const MAP_DEFAULT_COORDS = [50, 20];

export const MAP_MAX_BOUNDS = new L.LatLngBounds(new L.LatLng(-70, -180), new L.LatLng(180, 190));
export const MARKER_ICON_PARAMS = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};
