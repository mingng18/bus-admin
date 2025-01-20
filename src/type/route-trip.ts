export interface RouteTrip {
  id: number;
  bus_route_id: number;
  start_time: string;
  end_time: string;
  active: boolean;
  start_route_stop_id: number;
  // created_at?: string;
  // updated_at?: string;
}
