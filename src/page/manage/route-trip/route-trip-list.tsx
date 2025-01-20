import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import RouteColumn from "./components/route-column";
import Typography from "@mui/material/Typography";
import RouteTripTable from "./components/route-trip-table";
import StopEtaTable from "./components/stop-eta-table";
import CircularProgress from "@mui/material/CircularProgress";

import { useSearchParams } from "react-router-dom";
import { Title, useGetList, useTranslate } from "react-admin";

export default function BusScheduleList() {
  const [searchParams] = useSearchParams();
  const translate = useTranslate();

  const {
    data: routes,
    isLoading,
    error,
  } = useGetList("busRoute", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
  });

  const currentRoute = routes?.find(
    (route) => route.id === Number(searchParams.get("routeId"))
  );

  const tripId = Number(searchParams.get("tripId"));

  if (isLoading)
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <div>Error...</div>;
  if (!routes) return <div>No data...</div>;

  return (
    <Stack spacing={2} direction="row">
      <Title title="resources.routeTrip.name" />
      <RouteColumn routes={routes} />
      <Box pt={2}>
        <Typography variant="h4" color="initial" gutterBottom>
          {currentRoute
            ? `${translate(
                "resources.routeTrip.operationSchedule"
              )} (${translate("resources.routeTrip.route")} ${
                currentRoute?.name
              })`
            : `${translate("resources.routeTrip.selectRoute")}`}
        </Typography>
        <Typography variant="body1" color="initial">
          {translate("resources.routeTrip.detailsDesc")}
        </Typography>
        {currentRoute && <RouteTripTable routeId={currentRoute.id} />}
      </Box>
      {!!tripId && (
        <Box pt={2}>
          <Typography variant="h6" color="initial" gutterBottom>
            {translate("resources.routeTrip.fullEta")}
          </Typography>
          <Typography variant="body1" color="initial" gutterBottom>
            {translate("resources.routeTrip.desc")}
          </Typography>
          <StopEtaTable routeId={currentRoute.id} tripId={tripId} />
        </Box>
      )}
    </Stack>
  );
}
