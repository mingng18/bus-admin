export interface BusStopWithETA extends BusStop {
  eta: string;
}

export interface BusStop {
  id: number;
  name: string;
  short_name: string;
  latitude: number;
  longitude: number;
  address: string;
  geofence_id: number;
  is_hide: number;
  picture_url?: string;
  created_at?: string;
  updated_at?: string;
}
