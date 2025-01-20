import { LatLng } from "leaflet";

const osrmUrl = import.meta.env.VITE_OSRM_URL;

export default function UseCalculateDuration() {
  return async function calculateDuration(waypoints: LatLng[]) {
    const coordString = waypoints
      .map((point) => `${point.lng},${point.lat}`)
      .join(";");

    const response = await fetch(
      `${osrmUrl}/route/v1/driving/${coordString}?overview=full&geometries=geojson`
    );
    const data = await response.json();

    // 20 seconds to load and unload people
    const duration: number = data.routes[0].duration + 20;

    return duration;
  };
}
