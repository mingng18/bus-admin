export interface TripRecord {
  id: number;
  driver_id?: number;
  bus_id: number;
  bus_route_id: number;
  start_datetime: string;
  end_datetime?: string;
  current_route_stop_sequence: number;
  trip_status: "COMPLETED" | "ON_THE_WAY" | "ARRIVING";
}
