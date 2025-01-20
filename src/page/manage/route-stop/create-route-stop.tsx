import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ArrayInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  useDataProvider,
  useGetManyReference,
  useGetOne,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import { useSearchParams } from "react-router-dom";
import { RouteStop } from "src/type";

export default function RouteStopCreate() {
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const [searchParams] = useSearchParams();

  const currentRouteId = Number(searchParams.get("routeId"));

  const { data: currentRoute } = useGetOne("busRoute", { id: currentRouteId });
  const { data: routeStops } = useGetManyReference<RouteStop>(
    "routeStop/dataOnly",
    {
      target: "busRoute",
      id: currentRouteId,
      pagination: { page: 1, perPage: 100 },
      sort: { field: "sequence", order: "ASC" },
    },
    {
      enabled: currentRouteId > 0,
    }
  );

  const onSubmit = async (data: any) => {
    if (!Array.isArray(data.bus_stop_id)) {
      notify(translate("resources.routeStop.validation.inValidData"), {
        type: "warning",
      });
      return;
    }

    const body = data.bus_stop_id.map((stop: any, index: number) => ({
      bus_stop_id: stop.bus_stop_id,
      bus_route_id: currentRouteId,
      sequence: index + 1,
    }));

    try {
      const { data: resData } = await dataProvider.create(
        `routeStop/busRoute/${currentRouteId}`,
        { data: body }
      );

      if (resData) {
        notify(translate("resources.routeStop.validation.createSuccess"), {
          type: "success",
        });
        redirect(`/polyline/create?routeId=${currentRouteId}`);
      }
    } catch (error) {
      console.error("error", error);
      notify(
        `${translate("resources.routeStop.validation.createError")}: ${error}`,
        { type: "error" }
      );
    }
  };

  const defaultValues = {
    bus_stop_id:
      routeStops?.map((stop) => ({ bus_stop_id: stop.bus_stop_id })) || [],
  };

  if (!currentRoute || !routeStops) {
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
  }

  return (
    <>
      <Typography variant="h4" color="initial" pl={2} pt={2}>
        {translate("resources.routeStop.route")} {currentRoute.name}
      </Typography>
      <SimpleForm onSubmit={onSubmit} defaultValues={defaultValues}>
        <ArrayInput source="bus_stop_id">
          <SimpleFormIterator inline>
            <ReferenceInput
              source="bus_stop_id"
              reference="busStop"
              label="resources.routeStop.fields.bus_stop"
              perPage={300}
            >
              <SelectInput sx={{ width: 600 }} />
            </ReferenceInput>
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </>
  );
}
