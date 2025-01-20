import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";

import { useSearchParams } from "react-router-dom";
import { useGetList, useTranslate } from "react-admin";

export default function RouteRow() {
  const translate = useTranslate();
  const { data: routes } = useGetList("busRoute", {
    filter: { is_active: true },
    sort: { field: "name", order: "ASC" },
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const handleRouteChange = (id: number) => {
    if (id === -1) {
      // Clear the route
      setSearchParams((params) => {
        params.delete("routeId");
        return params;
      });
      return;
    }

    // Update the search params with the new route
    setSearchParams({ routeId: id.toString() });
  };

  const currentRoute = Number(searchParams.get("routeId"));

  if (!routes) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      position="absolute"
      bottom={8}
      left={8}
      zIndex={1000}
      sx={{
        backgroundColor: "background.default",
        p: 1,
        borderRadius: 16,
        transition: "all 0.3s",
      }}
    >
      {routes &&
        routes.map((r) => (
          <Chip
            key={r.id}
            label={r.name}
            variant={currentRoute === r.id ? "filled" : "outlined"}
            onClick={() => handleRouteChange(r.id)}
            sx={{
              backgroundColor: currentRoute === r.id ? r.map_color : "",
              color: currentRoute === r.id ? "" : r.map_color,
              borderColor: currentRoute === r.id ? "" : r.map_color,
            }}
          />
        ))}
      {currentRoute !== 0 && (
        <Chip
          label={translate("resources.map.clear")}
          onClick={() => handleRouteChange(-1)}
          icon={<CloseIcon color="inherit" />}
        />
      )}
    </Stack>
  );
}
