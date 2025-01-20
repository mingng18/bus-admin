export interface SubmitData {
  driver_id: number | null;
  bus_id: number;
  bus_route_id: number | null;
  is_active: boolean;
  current_route_stop_sequence: number | null;
}
