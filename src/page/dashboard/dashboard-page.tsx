import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BusSVG from "src/image/bus-svg-1.svg";
import TripRecordLists from "./components/trip-records-list";
// import PercentageCard from "./components/percentage-card";
// import AnalysisGraph from "./components/analysis-graph";
import RouteStatus from "./components/route-status";

import { useEffect } from "react";
import { Title, useGetList, useTranslate } from "react-admin";
import { TripRecord } from "src/type";

export const DashboardPage = () => {
  const translate = useTranslate();

  const { data: tripRecords, refetch } = useGetList<TripRecord>("tripRecord", {
    filter: { end_datetime: null },
  });

  useEffect(() => {
    const interval = setInterval(() => refetch(), 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <Box p={2}>
      <Title title="resources.dashboard.name" />
      <Grid container spacing={2}>
        <Grid item container xs={12} md={4} spacing={2}>
          <Grid item xs={12}>
            <Stack
              spacing={1}
              width="100%"
              bgcolor="background.paper"
              borderRadius={2}
              border={1}
              borderColor="divider"
              position="relative"
              p={2}
              overflow="hidden"
              minHeight={200}
              height="100%"
            >
              <Box position="absolute" right={8} zIndex={1}>
                <img src={BusSVG} alt="Bus" height={200} />
              </Box>
              <Typography variant="h6" color="initial" sx={{ zIndex: 10 }}>
                {translate("resources.dashboard.title")}
              </Typography>
              <Typography variant="body1" color="initial" sx={{ zIndex: 10 }}>
                {translate("resources.dashboard.desc")}
              </Typography>
            </Stack>
          </Grid>
          {/* Routes Card */}
          <Grid item xs={12} md={12}>
            <RouteStatus tripRecords={tripRecords} />
          </Grid>
          {/* Metrics Cards */}
          {/* <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={2}>
              <PercentageCard title="User Sastification Rate" percentage={80} />
              <PercentageCard
                title="Bus Schedule Adherence Rate"
                percentage={80}
              />
              <PercentageCard title="Bus Occupancy Rate" percentage={80} />
            </Grid>
          </Grid> */}
          {/* Bottom Chart Card */}
          {/* <Grid item xs={12}>
            <AnalysisGraph />
          </Grid> */}
        </Grid>
        <Grid item container xs={12} md={8}>
          <TripRecordLists tripRecords={tripRecords} />
        </Grid>
      </Grid>
    </Box>
  );
};
