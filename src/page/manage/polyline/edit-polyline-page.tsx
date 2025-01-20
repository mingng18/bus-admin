import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DraggableLines from "leaflet-draggable-lines";
import Typography from "@mui/material/Typography";
import useCalculateRoute from "./hooks/use-calculate-route";
import React, { useEffect, useRef } from "react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import {
  useGetOne,
  useNotify,
  useRedirect,
  useTranslate,
  useUpdate,
} from "react-admin";
import { BusRoute } from "src/type";
import { LineString, MultiLineString } from "geojson";

export default function EditPolylinePage() {
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();
  const calculateRoute = useCalculateRoute();

  const [searchParams] = useSearchParams();
  const [stops, setStops] = React.useState<LatLng[]>([]);
  const [isRendered, setIsRendered] = React.useState(false);
  const [update] = useUpdate();

  const map = useRef<L.Map>();
  const points = useRef<LatLng[]>();
  const distance = useRef<number>(0);

  const currentRouteId = Number(searchParams.get("routeId"));

  const { data: currentRoute } = useGetOne<BusRoute>(
    `busRoute`,
    {
      id: currentRouteId,
    },
    {
      enabled: currentRouteId > 0,
    }
  );

  const { data: rawPolylinePlot } = useGetOne(`polylinePlot/busRoute`, {
    id: currentRouteId,
  });

  useEffect(() => {
    if (rawPolylinePlot) {
      const keypoints: LatLng[] =
        rawPolylinePlot &&
        rawPolylinePlot.keypoints.map((keypoint: any) => {
          return new LatLng(keypoint[0], keypoint[1]);
        });

      setStops(keypoints);
    }
  }, [rawPolylinePlot]);

  useEffect(() => {
    const updateRoute = async (
      route: L.Polyline<LineString | MultiLineString, any>
    ) => {
      const { coords, dis } = await calculateRoute(
        route.getDraggableLinesRoutePoints() ?? []
      );
      const keyCoords = route.getDraggableLinesRoutePoints() ?? [];
      setStops(keyCoords);
      points.current = coords;
      distance.current = dis;
      route.setLatLngs(coords);
    };

    const initializePolyline = () => {
      if (map.current && stops.length > 0 && !isRendered) {
        const route = new L.Polyline([], {
          draggableLinesRoutePoints: stops,
          color: currentRoute?.map_color || "#0066cc",
          weight: 4,
        }).addTo(map.current);

        updateRoute(route);

        const draggable = new DraggableLines(map.current);
        draggable.enable();

        draggable.on("dragend remove insert", () => {
          points.current = route.getLatLngs() as LatLng[];
          updateRoute(route);
        });
        setIsRendered(true);
      }
    };

    initializePolyline();
  }, [calculateRoute, currentRoute?.map_color, isRendered, stops]);

  const updatePolyline = async () => {
    try {
      const coord =
        points.current &&
        points.current.map((coordinate) => {
          return [coordinate.lat, coordinate.lng];
        });

      const keyCoord = stops.map((coordinate) => {
        return [coordinate.lat, coordinate.lng];
      });

      const body = {
        keypoints: keyCoord,
        points: coord,
      };

      await update("polylinePlot/busRoute", { id: currentRouteId, data: body });

      await update("busRoute", {
        id: currentRouteId,
        data: { distance: distance.current },
      });

      notify(translate("resources.polyline.validation.updateSuccess"), {
        type: "success",
      });
      redirect(`/busRoute?routeId=${currentRouteId}`);
    } catch (error) {
      console.error("Error updating polyline plot:", error);
      notify(translate("resources.polyline.validation.updateError"), {
        type: "error",
      });
    }
  };

  return (
    <Box width="100%" height="100%" position="relative">
      <Stack direction="row" spacing={2} width="100%" my={2}>
        <Typography variant="h4">
          {translate("resources.polyline.editPolyline")}
        </Typography>
        <Button variant="contained" color="primary" onClick={updatePolyline}>
          {translate("resources.polyline.update")}
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
