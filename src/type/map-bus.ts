import { Bus } from "./bus";
import { GpsData } from "./gps-data";

export interface MapBus extends Bus {
  gps_data?: GpsData;
}
