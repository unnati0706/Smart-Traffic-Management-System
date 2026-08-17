export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'http://localhost:3000',
  MAP_TILE_URL: import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  MAP_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  IS_DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true' || true,
};
