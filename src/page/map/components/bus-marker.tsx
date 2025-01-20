import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import L from "leaflet";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { Marker, Popup } from "react-leaflet";
import { BusRoute, GpsData, MapBus, TripRecord } from "src/type";
import { renderToStaticMarkup } from "react-dom/server";
import {
  useGetList,
  useGetManyReference,
  useGetOne,
  useNotify,
  useRedirect,
  useTranslate,
  useUpdate,
} from "react-admin";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function BusMarker({ bus }: { bus: MapBus }) {
  const translate = useTranslate();
  const popupRef = useRef<any>(null);
  const notify = useNotify();

  const { data: tripRecords, refetch: tripRefetch } = useGetList<TripRecord>(
    "tripRecord",
    {
      filter: { end_datetime: null, bus_id: bus.id },
    }
  );

  const { data: rawGpsData, refetch } = useGetManyReference<GpsData>(
    "gpsDatas/dataOnly",
    {
      target: "bus",
      id: bus.id,
    },
    {
      onError: (error) => {
        console.error("Error fetching GPS data", error);
      },
    }
  );

  const gpsData: GpsData | undefined = rawGpsData?.[0];
  const [searchParams] = useSearchParams();
  const [update] = useUpdate();
  const redirect = useRedirect();

  useEffect(() => {
    // Stop refetching if no GPS data is initially available
    if (!gpsData) return;
    const interval = setInterval(() => refetch(), tripRecords ? 5000 : 30000); // Adjust interval based on tripRecords availability
    return () => clearInterval(interval);
  }, [refetch, gpsData, tripRecords]);

  useEffect(() => {
    const interval = setInterval(() => tripRefetch(), 5000); // 20 seconds
    return () => clearInterval(interval);
  }, [tripRefetch]);

  const currentRouteId = tripRecords?.[0]?.bus_route_id ?? null;

  const { data: currentRoute } = useGetOne<BusRoute>(
    "busRoute",
    { id: currentRouteId ?? 0 },
    { enabled: !!currentRouteId }
  );

  const filteredRouteId = Number(searchParams.get("routeId"));

  const endTripHandler = () => {
    const tripRecord = tripRecords?.[0];

    if (!tripRecord) {
      return;
    }

    const endDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    update("tripRecord", {
      id: tripRecord.id,
      data: {
        ...tripRecord,
        end_datetime: endDate,
      },
    });

    // Close the popup
    popupRef.current._closeButton.click();
    notify("resources.map.bus.endTripSuccess", {
      type: "success",
    });
  };

  const newTripHandler = () => {
    redirect(`/tripRecord/create?bus_id=${bus.id}`);
  };

  if (filteredRouteId !== 0 && filteredRouteId !== currentRouteId) {
    return null;
  }

  return (
    <Marker
      icon={createBusIcon(gpsData?.direction ?? 0, !!currentRoute)}
      key={bus.id}
      position={[
        gpsData ? gpsData.latitude : 0,
        gpsData ? gpsData.longitude : 0,
      ]}
    >
      <Popup ref={popupRef} closeOnClick closeOnEscapeKey closeButton>
        <Stack spacing={1} alignItems="center">
          <DirectionsBusIcon color="primary" />
          <Typography variant="h6">{bus.plate_no}</Typography>
          <Typography variant="body1">Id: {bus.id}</Typography>
          <Typography variant="body1">
            {gpsData
              ? `${translate("resources.map.bus.speed")}: ${gpsData.speed} km/h`
              : translate("resources.map.bus.noData")}
          </Typography>
          <Typography variant="body1">
            {gpsData
              ? `${translate("resources.map.bus.status")}: ${gpsData.status}`
              : translate("resources.map.bus.noData")}
          </Typography>
          <Typography variant="body1">
            {currentRoute
              ? `${translate("resources.map.bus.route")}: ${currentRoute.name}`
              : translate("resources.map.bus.noData")}
          </Typography>
          {currentRoute ? (
            <Button onClick={endTripHandler}>
              {translate("resources.map.bus.endTrip")}
            </Button>
          ) : (
            <Button onClick={newTripHandler}>
              {translate("resources.map.bus.newTrip")}
            </Button>
          )}
        </Stack>
      </Popup>
    </Marker>
  );
}

const createBusIcon = (direction: number, status: boolean) => {
  const busHtml = renderToStaticMarkup(
    <div
      style={{
        transformOrigin: "center center",
        transform: `rotate(${direction}deg)`,
        width: 12,
        height: 12,
      }}
    >
      <img
        src={`${status ? "bus-icon.svg" : "bus-icon-parked.svg"}`}
        alt="bus"
        width="40"
        height="40"
        style={{
          transform: "translate(-20%, -30%)",
        }}
      />
    </div>
  );

  return new L.DivIcon({
    html: busHtml,
    iconSize: new L.Point(0, 0),
    iconAnchor: [0, 0],
  });
};
