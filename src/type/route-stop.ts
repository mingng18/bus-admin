export interface RouteStop extends CreatingRouteStop {
  id: number;
  bus_route_id: number;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatingRouteStop {
  bus_stop_id: number;
  sequence: number;
}
