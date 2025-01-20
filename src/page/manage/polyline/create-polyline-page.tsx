import React, { useEffect, useRef } from "react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import {
  useCreate,
  useGetMany,
  useGetManyReference,
  useGetOne,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import { BusRoute, BusStop, RouteStop } from "src/type";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DraggableLines from "leaflet-draggable-lines";
import useCalculateRoute from "./hooks/use-calculate-route";
import Typography from "@mui/material/Typography";

export default function CreatePolylinePage() {
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const calculateRoute = useCalculateRoute();
  const [searchParams] = useSearchParams();
  const [stops, setStops] = React.useState<LatLng[]>([]);
  const [create] = useCreate();

  const map = useRef<L.Map>();
  const points = useRef<LatLng[]>();
  const initialized = useRef(false);
  const pollingRef = useRef(false);

  const currentRouteId = Number(searchParams.get("routeId"));
  const { data: currentRoute } = useGetOne<BusRoute>(`busRoute`, {
    id: currentRouteId,
  });

  const { data: routeStops, refetch: refetchRouteStops } =
    useGetManyReference<RouteStop>(
      `routeStop/dataOnly`,
      {
        target: `busRoute`,
        id: currentRouteId,
        pagination: { page: 1, perPage: 100 },
        sort: { field: "sequence", order: "ASC" },
      },
      {
        enabled: !!currentRouteId && stops.length === 0,
      }
    );

  const { data: busStops } = useGetMany<BusStop>(
    `busStop`,
    { ids: routeStops?.map((rs) => rs.bus_stop_id) },
    { enabled: !!routeStops }
  );

  // Polling for routeStops if it's empty
  useEffect(() => {
    if (!pollingRef.current && !routeStops?.length) {
      pollingRef.current = true;
      const interval = setInterval(() => {
        console.log("Refetching routeStops...");
        refetchRouteStops();
      }, 2000);

      return () => {
        clearInterval(interval);
        pollingRef.current = false;
      };
    }
  }, [routeStops, refetchRouteStops]);

  useEffect(() => {
    if (busStops && routeStops) {
      const newStops = routeStops.map((rs) => {
        const stop = busStops.find((bs) => bs.id === rs.bus_stop_id);
        return new LatLng(stop?.latitude ?? 0, stop?.longitude ?? 0);
      });

      setStops(newStops);
    }
  }, [busStops, routeStops]);

  useEffect(() => {
    const updateRoute = async (route: L.Polyline) => {
      const { coords } = await calculateRoute(
        route.getDraggableLinesRoutePoints() || []
      );
      const keyCoords = route.getDraggableLinesRoutePoints() ?? [];

      if (JSON.stringify(keyCoords) !== JSON.stringify(stops)) {
        setStops(keyCoords);
      }

      points.current = coords;
      route.setLatLngs(coords);
    };

    const initializePolyline = async () => {
      if (map.current && stops.length > 0 && !initialized.current) {
        initialized.current = true;

        const route = new L.Polyline([], {
          draggableLinesRoutePoints: stops,
          color: currentRoute?.map_color || "#0066cc",
          weight: 4,
        }).addTo(map.current);

        await updateRoute(route);

        const draggable = new DraggableLines(map.current);
        draggable.enable();

        draggable.on("dragend remove insert", () => {
          points.current = route.getLatLngs() as LatLng[];
          setTimeout(() => updateRoute(route), 200);
        });
      }
    };

    initializePolyline();
  }, [stops, currentRoute?.map_color, calculateRoute]);

  const createPolyline = async () => {
    try {
      if (!points.current) {
        notify(translate("resources.polyline.validation.noPoints"), {
          type: "warning",
        });
        return;
      }

      const coord = points.current.map(({ lat, lng }) => [lat, lng]);
      const keyCoord = stops.map(({ lat, lng }) => [lat, lng]);

      await create(`polylinePlot/busRoute/${currentRouteId}`, {
        data: { keypoints: keyCoord, points: coord },
      });

      notify(translate("resources.polyline.validation.createSuccess"), {
        type: "success",
      });
      redirect(`/busRoute?routeId=${currentRouteId}`);
    } catch (error) {
      console.error("Error creating polyline plot:", error);
      notify(translate("resources.polyline.validation.createError"), {
        type: "error",
      });
    }
  };

  return (
    <Box width="100%" height="100%" position="relative">
      <Stack direction="row" spacing={2} width="100%" my={2}>
        <Typography variant="h4" gutterBottom mt={2}>
          {translate("resources.polyline.createPolyline")}
        </Typography>
        <Button variant="contained" color="primary" onClick={createPolyline}>
          {translate("resources.polyline.create")}
        </Button>
      </Stack>
      <Typography variant="body1" gutterBottom>
        {translate("resources.polyline.updateDesc")}
      </Typography>
      <MapContainer
        center={[3.125553, 101.655042]}
        zoom={16}
        scrollWheelZoom={true}
        ref={map as React.MutableRefObject<L.Map>}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </Box>
  );
}
