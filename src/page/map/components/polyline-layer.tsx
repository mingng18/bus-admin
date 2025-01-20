import L from "leaflet";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import createMarkerIcon from "./marker-icon";
import { useMemo } from "react";
import { FeatureGroup, Marker, Polyline, Popup } from "react-leaflet";
import { BusStop, PolylinePlot } from "src/type";
import { useTranslate } from "react-admin";

export default function PolylineLayer({
  currentColor,
  polylinePlots,
  busStops,
}: {
  currentColor: string;
  polylinePlots: PolylinePlot[];
  busStops: BusStop[];
}) {
  const translate = useTranslate();

  const pos: L.LatLngExpression[] = useMemo(
    () => polylinePlots?.map((plot) => [plot.latitude, plot.longitude]) || [],
    [polylinePlots]
  );

  // Memoize the marker icon to avoid re-creating it on each render
  const markerIcon = useMemo(
    () => createMarkerIcon(currentColor),
    [currentColor]
  );

  return (
    <FeatureGroup>
      <Polyline
        positions={pos}
        pathOptions={{ color: currentColor }}
        weight={4}
      />
      {busStops &&
        busStops.map((busStop, index) => (
          <Marker
            key={`${stop.toString()}-${index}`}
            position={[busStop.latitude, busStop.longitude]}
            icon={markerIcon(busStop.short_name)}
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
  );
}
