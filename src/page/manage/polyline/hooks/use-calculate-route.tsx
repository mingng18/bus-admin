import { LatLng } from "leaflet";
import { useCallback } from "react";

const osrmUrl = import.meta.env.VITE_OSRM_URL;

export default function UseCalculateRoute() {
  const calculateRoute = useCallback(async (waypoints: LatLng[]) => {
    const coordString = waypoints
      .map((point) => `${point.lng},${point.lat}`)
      .join(";");

    try {
      const response = await fetch(
        `${osrmUrl}/route/v1/driving/${coordString}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch route: ${response.statusText}`);
      }

      const data = await response.json();

      const coords: LatLng[] = data.routes[0].geometry.coordinates.map(
        (coordinate: number[]) => {
          return new LatLng(coordinate[1], coordinate[0]);
        }
      );

      const dis: number = data.routes[0].distance;
      console.log("distance", dis);

      return { coords, dis };
    } catch (error) {
      console.error("Error calculating route:", error);
      throw error;
    }
  }, []);

  return calculateRoute;
}
