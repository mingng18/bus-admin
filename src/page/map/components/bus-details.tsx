import Stack from "@mui/material/Stack";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import Typography from "@mui/material/Typography";
import BusTripRecord from "./bus-trip-record";

import { TripRecord } from "src/type";
import { useGetList, useTranslate } from "react-admin";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function CurrentOperatingBus() {
  const translate = useTranslate();

  const { data: tripRecords, refetch } = useGetList<TripRecord>("tripRecord", {
    filter: { end_datetime: null },
  });

  const [searchParams] = useSearchParams();
  const currentRouteId = Number(searchParams.get("routeId"));

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  const filteredTripRecords =
    currentRouteId !== 0
      ? tripRecords?.filter(
          (tripRecord) => tripRecord.bus_route_id === currentRouteId
        )
      : tripRecords;

  const numberOfBusesMessage = (numberOfBus: number) => {
    let message = "";
    if (numberOfBus === 0) {
      message = translate("resources.map.noOfBus.noBus");
    } else if (numberOfBus === 1) {
      message = translate("resources.map.noOfBus.oneBus");
    } else {
      message = `${numberOfBus} ${translate("resources.map.noOfBus.manyBus")}`;
    }
    return message;
  };

  return (
    <Stack
      spacing={2}
      position="absolute"
      top={0}
      p={1}
      right={0}
      zIndex={1000}
      width={320}
      height="calc(100vh - 48px)"
      sx={{
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        px={2}
        py={1}
        borderRadius={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor: "background.paper",
        }}
      >
        <DirectionsBusIcon />
        <Typography variant="overline">
          {numberOfBusesMessage(filteredTripRecords?.length ?? 0)}
        </Typography>
      </Stack>
      {filteredTripRecords &&
        filteredTripRecords.map((tripRecord) => {
          return <BusTripRecord key={tripRecord.id} tripRecord={tripRecord} />;
        })}
    </Stack>
  );
}
