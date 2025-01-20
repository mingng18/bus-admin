import React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";

import { useSearchParams } from "react-router-dom";
import { BusRoute } from "src/type/bus-route";
import { Link } from "react-router-dom";
import { useTranslate } from "react-admin";

export default function RouteColumn({ routes }: { routes: BusRoute[] }) {
  const translate = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the route from the URL search params, or default to "AB"
  const [currentRoute, setCurrentRoute] = React.useState<number>(
    Number(searchParams.get("routeId")) ?? -1
  );

  const handleRouteChange = (id: number) => {
    if (id === -1) {
      // Clear the route
      setCurrentRoute(-1);
      setSearchParams((params) => {
        params.delete("routeId");
        return params;
      });
      return;
    }

    // Update the search params with the new route
    setCurrentRoute(id);
    setSearchParams({ routeId: id.toString() });
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      p={1}
      py={2}
      sx={{
        borderRadius: 16,
        transition: "all 0.3s",
      }}
    >
      {routes.map((r) => (
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
      {currentRoute !== -1 && (
        <Link to={"/busRoute/create"}>
          <Chip
            label={translate("resources.routeTrip.addRoute")}
            icon={<AddIcon color="inherit" />}
          />
        </Link>
      )}
    </Stack>
  );
}
