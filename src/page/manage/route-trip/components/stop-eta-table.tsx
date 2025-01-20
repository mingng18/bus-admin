import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import renderNumberEditCell from "./number-input-cell";
import Button from "@mui/material/Button";
import UseCalculateDuration from "../hooks/use-calculate-duration";
import {
  useGetMany,
  useGetManyReference,
  useGetOne,
  useNotify,
  useTranslate,
  useUpdate,
} from "react-admin";
import { BusStop, RouteStop, RouteTrip } from "src/type";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { LatLng } from "leaflet";

export default function StopEtaTable({
  routeId,
  tripId,
}: {
  routeId: number;
  tripId: number;
}) {
  const notify = useNotify();
  const translate = useTranslate();
  const calculateDuration = UseCalculateDuration();

  const [routeStopsData, setRouteStopsData] = useState<
    RouteStop[] | undefined
  >();

  // Fetch all routeStop for the current routeId
  const { data: routeStops } = useGetManyReference<RouteStop>(
    "routeStop/dataOnly",
    {
      target: "busRoute",
      id: routeId,
      pagination: { page: 1, perPage: 100 },
      sort: { field: "sequence", order: "ASC" },
    },
    {
      enabled: routeId > 0,
    }
  );

  const { data: busStops } = useGetMany<BusStop>(
    "busStop",
    {
      ids: routeStops?.map((rs: RouteStop) => rs.bus_stop_id),
    },
    {
      enabled: !!routeStops,
    }
  );

  const { data: routeTrip } = useGetOne<RouteTrip>(
    "routeTrip",
    {
      id: tripId,
    },
    {
      enabled: !!tripId,
    }
  );

  const [update] = useUpdate<RouteStop, Error>("routeStop", undefined, {
    onError: (error) => {
      console.error("update error", error);
    },
    onSettled: () => {
      notify("resources.routeTrip.notification.updated", {
        type: "success",
      });
    },
  });

  useEffect(() => {
    setRouteStopsData(routeStops);
  }, [routeStops]);

  const columns: GridColDef[] = [
    {
      field: "bus_stop_id",
      headerName: translate("resources.routeTrip.fields.bus_stop"),
      width: 200,
      renderCell: (params) => {
        const busStop = busStops?.find(
          (bs) => bs.id === params.row.bus_stop_id
        ) as BusStop;
        return busStop?.name ?? "";
      },
    },
    {
      field: "eta",
      headerName: translate("resources.routeTrip.fields.eta"),
      width: 100,
      renderCell: (params) => {
        const startTime = routeTrip?.start_time;
        if (!startTime) return "";

        let cumulativeTime = dayjs(`1970-01-01T${startTime}`);
        const index = params.api.getAllRowIds().indexOf(params.id);

        for (let i = 0; i <= index; i++) {
          const row = params.api.getRow(params.api.getAllRowIds()[i]);
          const duration = (row?.duration || 0) / 60; // `eta` is actually duration in minutes
          cumulativeTime = cumulativeTime.add(duration, "minute");
        }

        return cumulativeTime.format("HH:mm:ss");
      },
    },
    {
      field: "duration",
      headerName: translate("resources.routeTrip.fields.duration"),
      editable: true,
      width: 120,
      renderCell: (params) => {
        if (params.row.sequence === 1) return ""; // Render nothing for index 0
        const durationInSeconds = params.row.duration ?? 0;
        return `${durationInSeconds} s`;
      },
      renderEditCell: renderNumberEditCell,
    },
  ];

  const processRowUpdate = async (
    updatedRow: RouteStop,
    originalRow: RouteStop
  ) => {
    if (updatedRow.duration === originalRow.duration) return originalRow;

    await update(`routeStop`, {
      id: updatedRow.id,
      data: updatedRow,
    });

    setRouteStopsData((prev) =>
      prev?.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    return updatedRow;
  };

  const calculateDurations = async () => {
    if (!routeStopsData) return;

    for (let i = 1; i < routeStopsData.length; i++) {
      // find the current bus stop
      const currentRouteStop = routeStopsData[i];
      const busStop = busStops?.find(
        (bs) => bs.id === routeStopsData[i].bus_stop_id
      ) as BusStop;

      //find the previous bus stop
      const prevBusStop = busStops?.find(
        (bs) => bs.id === routeStopsData[i - 1].bus_stop_id
      ) as BusStop;

      if (!busStop || !prevBusStop) return;

      // calculate the route
      const duration = await calculateDuration([
        new LatLng(busStop.latitude, busStop.longitude),
        new LatLng(prevBusStop.latitude, prevBusStop.longitude),
      ]);

      update(`routeStop`, {
        id: currentRouteStop.id,
        data: {
          ...currentRouteStop,
          duration: duration,
        },
      });

      currentRouteStop.duration = duration;

      setRouteStopsData((prev) =>
        prev?.map((rs) =>
          rs.id === currentRouteStop.id ? currentRouteStop : rs
        )
      );
    }
  };

  return (
    <Stack direction="column" spacing={2} mt={2}>
      <Button variant="contained" onClick={calculateDurations}>
        {translate("resources.routeTrip.autoCalculateDuration")}
      </Button>
      <DataGrid
        rows={routeStopsData || []}
        columns={columns}
        getRowId={(row) => row.id}
        editMode="row"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error: Error) => {
          console.error(error);
          notify("resources.routeTrip.notification.data_error", {
            type: "error",
          });
        }}
      />
    </Stack>
  );
}
