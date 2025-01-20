import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import Typography from "@mui/material/Typography";
import TripRecordCard from "./trip-record-card";

import { useTranslate } from "react-admin";
import { TripRecord } from "src/type";

export default function TripRecordLists({
  tripRecords,
}: {
  tripRecords: TripRecord[] | undefined;
}) {
  const translate = useTranslate();
  return (
    <Grid item xs={12}>
      <Stack
        spacing={1}
        bgcolor="background.paper"
        borderRadius={2}
        border={1}
        borderColor="divider"
        position="relative"
        overflow="hidden"
        height="100%"
      >
        <Stack
          direction="row"
          spacing={2}
          p={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <DirectionsBusIcon />
          <Stack alignItems="flex-end">
            <Typography variant="overline">
              {translate("resources.dashboard.trip.currentBusOnTrip")}
            </Typography>
            <Typography variant="h5">{tripRecords?.length ?? 0}</Typography>
          </Stack>
        </Stack>
        <Divider />
        {!!tripRecords &&
          tripRecords.map((tripRecord) => (
            <TripRecordCard key={tripRecord.id} tripRecord={tripRecord} />
          ))}
      </Stack>
    </Grid>
  );
}
