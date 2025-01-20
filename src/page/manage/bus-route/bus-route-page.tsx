import Stack from "@mui/material/Stack";
import RouteDetails from "./components/route-details";
import PolylineLayer from "src/page/map/components/polyline-layer";
import Box from "@mui/material/Box";
import AllRouteRow from "./components/all-route-row";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { Title, useGetList, useGetMany, useGetOne } from "react-admin";
import { RouteStop, PolylinePlot, BusStop, BusRoute, MapInfo } from "src/type";

export default function EditRoutePage() {
  const map = useRef<any>();
  const [searchParams] = useSearchParams();
  const currentRouteId = Number(searchParams.get("routeId"));

  const { data: routes } = useGetList("busRoute", {
    sort: { field: "name", order: "ASC" },
  });

  const { data: mapInfo } = useGetOne<MapInfo>(
    `mapInfo`,
    {
      id: currentRouteId,
    },
    {
      enabled: currentRouteId > 0,
    }
  );

  const { data: rawBusStops } = useGetMany<BusStop>(
    "busStop",
    {
      ids: mapInfo?.routeStops?.map((rs: RouteStop) => rs.bus_stop_id),
    },
    {
      enabled: !!mapInfo?.routeStops,
    }
  );

  const busStops = mapInfo?.routeStops
    ?.map((rs) => rawBusStops?.find((bs) => bs.id === rs.bus_stop_id))
    .filter((bs): bs is BusStop => bs !== undefined);

  const polylineV2: string = mapInfo?.polylinePlotsV2.coordinates ?? "";

  const polylinePlots: PolylinePlot[] = useMemo(() => {
    return polylineV2 != ""
      ? polylineV2.split(";").map((plot, index) => {
          const [lat, long] = plot.split(",").map(Number);
          return {
            sequence: index,
            latitude: lat,
            longitude: long,
          };
        })
      : [];
  }, [polylineV2]);

  const currentRoute: BusRoute = useMemo(() => {
    if (!routes) return null;
    return routes.find((route) => route.id === currentRouteId);
  }, [currentRouteId, routes]);

  // Use to focus on map when bus stop is clicked
  useEffect(() => {
    const pos = searchParams.get("pos");

    if (pos) {
      const [lat, long] = pos.split(",").map(Number);
      map.current?.setView([lat, long], 16);
    }
  }, [searchParams]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={[3.125553, 101.655042]}
        zoom={16}
        scrollWheelZoom={true}
        ref={map}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentRoute && (
          <PolylineLayer
            key={currentRoute.id}
            currentColor={currentRoute.map_color}
            polylinePlots={polylinePlots ?? []}
            busStops={rawBusStops ?? []}
          />
        )}
      </MapContainer>
    ),
    [rawBusStops, currentRoute, polylinePlots]
  );

  return (
    <Stack
      direction="row"
      spacing={2}
      width="100%"
      height="100%"
      position="relative"
    >
      <Title title="resources.busRoute.name" />
      <AllRouteRow />
      <Box width="100%" height="100%">
        {displayMap}
      </Box>
      {currentRoute && (
        <RouteDetails
          currentRoute={currentRoute}
          busStops={busStops ?? []}
          isPolylineExists={(polylinePlots?.length ?? 0) > 0}
        />
      )}
    </Stack>
  );
}
