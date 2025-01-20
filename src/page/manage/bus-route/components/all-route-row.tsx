import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { useSearchParams } from "react-router-dom";
import { useGetList, useTranslate } from "react-admin";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AllRouteRow() {
  const translate = useTranslate();
  const { data: routes } = useGetList("busRoute", {
    sort: { field: "name", order: "ASC" },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

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

  // Filter routes based on search query
  const filteredRoutes =
    routes?.filter(
      (route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!showActiveOnly || route.is_active)
    ) || [];

  return (
    <Stack
      spacing={2}
      py={2}
      mr={1}
      width={160}
      justifyContent="space-between"
      height="calc(100vh - 48px)"
      sx={{
        overflowY: "auto",
      }}
    >
      <Stack spacing={2}>
        <TextField
          id="search-route"
          label={translate("resources.busRoute.searchRoutes")}
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              onChange={(_, checked) => {
                setShowActiveOnly(checked);
              }}
            />
          }
          label={translate("resources.busRoute.showActiveOnly")}
        />
        <Divider />
        {filteredRoutes.map((r) => (
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
      </Stack>
      <Link to={"/busRoute/create"}>
        <Button variant="contained" color="primary">
          {translate("resources.busRoute.createRoute")}
        </Button>
      </Link>
    </Stack>
  );
}
