import { RouteStop } from "./route-stop";
import { RouteTrip } from "./route-trip";

export interface MapInfo {
  id: number;
  polylinePlotsV2: {
    coordinates: string;
  };
  polylinePlotsV2KP: {
    coordinates: string;
  };
  routeStops: RouteStop[];
  routeTrips: RouteTrip[];
}
