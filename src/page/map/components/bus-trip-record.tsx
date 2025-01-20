import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useCustomStepStyles from "src/page/manage/bus-route/components/custom-step";
// import formatDuration from "src/util/duration-formatter";

import { Bus, BusRoute, BusStop, RouteStop, TripRecord } from "src/type";
import { useGetMany, useGetManyReference, useGetOne } from "react-admin";

export default function BusTripRecord({
  tripRecord,
}: {
  tripRecord: TripRecord;
}) {
  const { data: currentBus } = useGetOne<Bus>("bus", {
    id: tripRecord.bus_id,
  });

  const { data: currentRoute } = useGetOne<BusRoute>(
    "busRoute",
    {
      id: tripRecord.bus_route_id,
    },
    {
      enabled: tripRecord.bus_route_id > 0,
    }
  );

  const { CustomConnector, CustomStepIcon } = useCustomStepStyles(
    currentRoute?.map_color ?? "#0066cc"
  );

  const { data: routeStops } = useGetManyReference<RouteStop>(
    "routeStop/dataOnly",
    {
      target: "busRoute",
      id: currentRoute!.id,
      pagination: { page: 1, perPage: 100 },
      sort: { field: "sequence", order: "ASC" },
    },
    {
      enabled: !!currentRoute,
    }
  );

  const { data: rawBusStops } = useGetMany<BusStop>(
    "busStop",
    {
      ids: routeStops?.map((rs: RouteStop) => rs.bus_stop_id),
    },
    {
      enabled: !!routeStops,
    }
  );

  const busStops = routeStops
    ?.map((rs) => rawBusStops?.find((bs) => bs.id === rs.bus_stop_id))
    .filter((bs): bs is BusStop => bs !== undefined);



  return (
    <Accordion
      key={tripRecord.id}
      sx={{
        borderRadius: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${tripRecord.id}-details`}
        id={`trip-record-${tripRecord.id.toString()}`}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={currentRoute?.name}
            variant="outlined"
            sx={{
              color: currentRoute?.map_color,
              borderColor: currentRoute?.map_color,
            }}
          />
          <Typography variant="body1">{currentBus?.plate_no}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {busStops && routeStops && (
          <Stepper
            activeStep={tripRecord.current_route_stop_sequence - 1}
            orientation="vertical"
            connector={<CustomConnector />}
          >
            {busStops.map((busStop, index) => {
              return (
                <Step key={`${tripRecord.id}-${busStop.id}-${index}`}>
                  <StepLabel sx={{ p: 0 }} StepIconComponent={CustomStepIcon}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography variant="body1" style={{ flex: 3 }}>
                        {busStop.name}
                      </Typography>
                      {/* TODO query out current time and add */}
                      {/* <Typography
                        variant="body1"
                        align="right"
                        style={{ flex: 1 }}
                      >
                        {formatDuration(routeStops[index].duration ?? 0)}
                      </Typography> */}
                    </Stack>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
