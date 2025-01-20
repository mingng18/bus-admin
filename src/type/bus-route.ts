import { PolylinePlot } from "./polyline-plot";
import { RouteStop } from "./route-stop";

export interface BusRoute {
  id: number;
  name: string;
  desc: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  map_color: string;
  schedule_file: string;
  is_active: boolean;
  
  route_stops?: RouteStop[];
  polyline_plots?: PolylinePlot[];
}
