import React, { useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RouteRow from "./components/route-row";
import PolylineLayer from "./components/polyline-layer";
import CenterIcon from "./components/center-icon";
import BusMarker from "./components/bus-marker";
import CurrentOperatingBus from "./components/bus-details";
import createMarkerIcon from "./components/marker-icon";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { Title, useGetList, useGetOne, useTranslate } from "react-admin";
import { BusRoute, BusStop, MapBus, MapInfo, PolylinePlot } from "src/type";

import "leaflet/dist/leaflet.css";

export const MapPage: React.FC = () => {
  const mapRef = useRef<any>();
  const translate = useTranslate();
  const [searchParams] = useSearchParams();
  const currentRouteId = Number(searchParams.get("routeId"));

  // Fetch data using react-admin hooks
  const { data: currentRoute } = useGetOne<BusRoute>(
    "busRoute",
    { id: currentRouteId },
    { enabled: currentRouteId > 0 }
  );

  const { data: buses } = useGetList<MapBus>("bus", {
    filter: { car_status_id: 1 },
    pagination: { page: 1, perPage: 100 },
  });

  const { data: busStops } = useGetList<BusStop>("busStop", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
  });

  const { data: mapInfo } = useGetOne<MapInfo>(
    "mapInfo",
    { id: currentRouteId },
    { enabled: currentRouteId > 0 }
  );

  // Process polyline plots
  const polylinePlots: PolylinePlot[] = useMemo(() => {
    if (!mapInfo?.polylinePlotsV2.coordinates) return [];
    return mapInfo.polylinePlotsV2.coordinates.split(";").map((plot, index) => {
      const [lat, long] = plot.split(",").map(Number);
      return { sequence: index, latitude: lat, longitude: long };
    });
  }, [mapInfo]);

  // Filter bus stops based on route info
  const filteredBusStops = useMemo(() => {
    if (!mapInfo?.routeStops || !busStops) return [];
    return busStops.filter((stop) =>
      mapInfo.routeStops.some((rs) => rs.bus_stop_id === stop.id)
    );
  }, [mapInfo, busStops]);

  return (
    <Box width="100%" height="100%" position="relative">
      <Title title="resources.map.name" />
      {/* Leaflet Map */}
      <MapContainer
        center={[3.125553, 101.655042]}
        zoom={16}
        scrollWheelZoom
        ref={mapRef}
      >
        {/* Tile layer */}
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Render buses */}
        {buses?.map((bus) => (
          <BusMarker key={bus.id} bus={bus} />
        ))}

        {/* Render route polyline and bus stops */}
        {currentRoute && (
          <PolylineLayer
            key={currentRoute.id}
            currentColor={currentRoute.map_color}
            polylinePlots={polylinePlots}
            busStops={filteredBusStops}
          />
        )}

        {/* Render all bus stops if no route is selected */}
        <FeatureGroup>
          {!currentRouteId &&
            busStops?.map((busStop) => (
              <Marker
                key={`busStop-${busStop.id}`}
                position={[busStop.latitude, busStop.longitude]}
                icon={createMarkerIcon(busStop.is_hide ? "6b7c96" : "#0066cc")(
                  busStop.short_name
                )}
              >
                <Popup closeOnClick closeOnEscapeKey closeButton>
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="h6">{busStop.name}</Typography>
                    <Typography variant="body1">
                      {translate("resources.map.busStop.shortName")}:{" "}
                      {busStop.short_name}
                    </Typography>
                    <Typography variant="body1">
                      {translate("resources.map.busStop.status")}:{" "}
                      {busStop.is_hide ? "Hidden" : "Visible"}
                    </Typography>
                    <Typography variant="caption">{busStop.address}</Typography>
                  </Stack>
                </Popup>
              </Marker>
            ))}
        </FeatureGroup>
      </MapContainer>

      {/* Utility components */}
      <CenterIcon map={mapRef} />
      <RouteRow />
      <CurrentOperatingBus />
    </Box>
  );
};
