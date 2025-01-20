import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { useGetList, useTranslate } from "react-admin";
import { BusRoute, TripRecord } from "src/type";

export default function RouteStatus({
  tripRecords,
}: {
  tripRecords: TripRecord[] | undefined;
}) {
  const translate = useTranslate();

  const { data: routes } = useGetList<BusRoute>("busRoute", {
    filter: { is_active: true },
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
  });

  return (
    <Stack
      width="100%"
      spacing={2}
      justifyContent="space-between"
      bgcolor="background.paper"
      borderRadius={2}
      border={1}
      borderColor="divider"
      p={2}
    >
      {!!routes &&
        routes.map((route) => (
          <Stack key={route.id} direction="row" spacing={2}>
            <Chip
              label={route.name}
              variant="outlined"
              sx={{
                flex: 1,
                color: route.map_color,
                borderColor: route.map_color,
              }}
            />
            {!!tripRecords &&
            tripRecords.filter((t) => t.bus_route_id === route.id).length >
              0 ? (
              <>
                <Stack direction="row" spacing={1} flex={2} alignItems="center">
                  <Box
                    width={8}
                    height={8}
                    bgcolor="info.main"
                    borderRadius={16}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {tripRecords.filter((t) => t.bus_route_id === route.id)
                      .length > 0
                      ? translate("resources.dashboard.normalService")
                      : translate("resources.dashboard.planned")}
                  </Typography>
                </Stack>
                <Stack flex={2} direction="row" spacing={1} alignItems="center">
                  <DirectionsBusIcon />
                  <Typography variant="caption" color="text.secondary">
                    {`${
                      tripRecords.filter((t) => t.bus_route_id === route.id)
                        .length
                    } ${translate("resources.dashboard.bus")}`}
                  </Typography>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={1} flex={2} alignItems="center">
                  <Box
                    width={8}
                    height={8}
                    bgcolor="error.main"
                    borderRadius={16}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {translate("resources.dashboard.unavailable")}
                  </Typography>
                </Stack>
                <Box flex={2} />
              </>
            )}
          </Stack>
        ))}
    </Stack>
  );
}
