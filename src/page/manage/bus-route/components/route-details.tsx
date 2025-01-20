import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useCustomStepStyles from "./custom-step";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { useState } from "react";
import { BusRoute, BusStop } from "src/type";
import { useSearchParams, Link } from "react-router-dom";
import { useDelete, useNotify, useRefresh, useTranslate } from "react-admin";

export default function RouteDetails({
  currentRoute,
  busStops,
  isPolylineExists,
}: {
  currentRoute: BusRoute;
  busStops: BusStop[];
  isPolylineExists: boolean;
}) {
  const notify = useNotify();
  const translate = useTranslate();
  const refresh = useRefresh();

  const [, setSearchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);

  const { CustomConnector, CustomStepIcon } = useCustomStepStyles(
    currentRoute.map_color
  );

  const handleStepClick = (index: number, lat: number, long: number) => {
    setActiveStep(index);
    setSearchParams((prevParams) => ({
      ...Object.fromEntries(prevParams.entries()),
      pos: `${lat},${long}`,
    }));
  };

  const [deleteOne, { isLoading: isDeleting }] = useDelete<BusRoute, Error>(
    undefined,
    undefined,
    {
      onError: (error) => {
        console.error("create error", error);
      },
      onSettled: () => {
        notify("resources.busRoute.notification.deleteSuccess", {
          type: "success",
        });

        refresh();
        setSearchParams((params) => {
          params.delete("routeId");
          return params;
        });
      },
    }
  );

  const handleDeleteClick = () => {
    if (window.confirm(translate("resources.busRoute.confirmDelete"))) {
      deleteOne("busRoute", { id: currentRoute.id });
    }
  };

  return (
    <Stack
      key={currentRoute?.id}
      direction="column"
      spacing={2}
      py={2}
      mr={1}
      width={320}
      height="calc(100vh - 48px)"
      sx={{
        overflowY: "auto",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h6" color="initial">
          {translate("resources.busRoute.route")} {currentRoute?.name}
        </Typography>
        {isDeleting ? (
          <CircularProgress
            size={24}
            sx={{ p: 2 }}
            color="inherit"
            thickness={5}
          />
        ) : (
          <Tooltip title={translate("resources.busRoute.deleteRoute")}>
            <IconButton
              aria-label={translate("resources.busRoute.deleteRoute")}
              onClick={handleDeleteClick}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Typography variant="body1" color="initial">
        {currentRoute?.desc}
      </Typography>
      <Link to={`/busRoute/${currentRoute?.id}`}>
        <Button variant="contained" startIcon={<EditIcon />}>
          {translate("resources.busRoute.editRoute")}
        </Button>
      </Link>
      {busStops.length === 0 ? (
        <Link to={`/routeStop/create?routeId=${currentRoute?.id}`}>
          <Button variant="contained" startIcon={<EditIcon />}>
            {translate("resources.busRoute.addBusStop")}
          </Button>
        </Link>
      ) : (
        <Link to={`/routeStop/edit?routeId=${currentRoute?.id}`}>
          <Button variant="contained" startIcon={<EditIcon />}>
            {translate("resources.busRoute.editBusStop")}
          </Button>
        </Link>
      )}
      {isPolylineExists ? (
        <Link to={`/polyline/edit?routeId=${currentRoute?.id}`}>
          <Button variant="contained" startIcon={<EditIcon />}>
            {translate("resources.busRoute.editPolyline")}
          </Button>
        </Link>
      ) : (
        <Link to={`/polyline/create?routeId=${currentRoute?.id}`}>
          <Button variant="contained" startIcon={<EditIcon />}>
            {translate("resources.busRoute.addPolyline")}
          </Button>
        </Link>
      )}
      <Divider />
      <Typography variant="h6" color="initial">
        {translate("resources.busRoute.busStops")}
      </Typography>
      {busStops && (
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={<CustomConnector />}
        >
          {busStops.map((busStop, index) => {
            return (
              <Step
                key={busStop.id + index}
                sx={{ cursor: "pointer !important", pointerEvents: "all" }}
              >
                <StepLabel
                  sx={{
                    p: 0,
                  }}
                  StepIconComponent={CustomStepIcon}
                  onClick={() =>
                    handleStepClick(index, busStop.latitude, busStop.longitude)
                  }
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1">
                      {busStop.short_name}
                    </Typography>
                  </Stack>
                </StepLabel>
                <StepContent
                  sx={(theme) => ({
                    ml: 0.5,
                    borderLeft: `4px solid ${theme.palette.divider}`,
                  })}
                >
                  <Typography variant="body1" color="initial">
                    {busStop.name}
                  </Typography>
                  <Typography variant="body2" color="initial">
                    {busStop.address}
                  </Typography>
                  <Typography variant="body2" color="initial">
                    {busStop.latitude}, {busStop.longitude}
                  </Typography>
                  <Typography variant="body2" color="initial">
                    {translate("resources.busRoute.picture")}:{" "}
                    {busStop.picture_url}
                  </Typography>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      )}
    </Stack>
  );
}
