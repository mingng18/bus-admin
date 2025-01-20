import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import useCustomStepStyles from "src/page/manage/bus-route/components/custom-step";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import PinDropIcon from "@mui/icons-material/PinDrop";
import formatDuration from "src/util/duration-formatter";
import {
  Link,
  useGetMany,
  useGetManyReference,
  useGetOne,
  useTranslate,
} from "react-admin";
import { useRef, useEffect } from "react";
import { TripRecord, BusRoute, RouteStop, BusStop } from "src/type";
const TripRecordCard = ({ tripRecord }: { tripRecord: TripRecord }) => {
  const translate = useTranslate();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      id: currentRoute?.id,
      pagination: { page: 1, perPage: 100 },
      sort: { field: "sequence", order: "ASC" },
    },
    { enabled: !!currentRoute }
  );

  const { data: rawBusStops } = useGetMany<BusStop>(
    "busStop",
    { ids: routeStops?.map((rs: RouteStop) => rs.bus_stop_id) },
    { enabled: !!routeStops }
  );

  const busStops = routeStops?.map((rs) =>
    rawBusStops?.find((bs) => bs.id === rs.bus_stop_id)
  );

  useEffect(() => {
    if (busStops?.length) {
      const currentStepIndex = tripRecord.current_route_stop_sequence - 1;
      const currentRef = stepRefs.current[currentStepIndex];

      if (currentRef) {
        currentRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [tripRecord.current_route_stop_sequence, busStops]);

  if (!routeStops || !busStops) return null;

  return (
    <Stack width="100%">
      <Stepper
        activeStep={tripRecord.current_route_stop_sequence - 1}
        connector={<CustomConnector />}
        sx={{
          overflowX: "hidden",
          width: "100%",
          display: "flex",
          mt: 2,
        }}
      >
        {busStops.map((busStop, index) => {
          if (!busStop) return null;
          return (
            <Step key={busStop.id} sx={{ flex: "0 0 auto" }}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <div
                  ref={(el) => (stepRefs.current[index] = el)}
                  style={{ width: "100%" }}
                >
                  <Stack direction="column" alignItems="start">
                    <Typography variant="body1">
                      {busStop.short_name}
                    </Typography>
                    <Typography variant="body1">
                      {formatDuration(routeStops[index].duration ?? 0)}
                    </Typography>
                  </Stack>
                </div>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        m={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={currentRoute?.name}
            variant="outlined"
            sx={{
              width: 100,
              color: currentRoute?.map_color,
              borderColor: currentRoute?.map_color,
            }}
          />
          <PinDropIcon />
          <Typography variant="body1" color="text.secondary">
            {tripRecord.current_route_stop_sequence}/{routeStops?.length}{" "}
            {translate("resources.dashboard.trip.stopLeft")}
          </Typography>
        </Stack>
        <Link to={`/map?routeId=${currentRoute?.id}`}>
          <Button variant="contained">
            {translate("resources.dashboard.trip.seeMore")}
          </Button>
        </Link>
      </Stack>
      <Divider />
    </Stack>
  );
};

export default TripRecordCard;
