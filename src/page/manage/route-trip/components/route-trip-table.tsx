import renderTimeEditCell from "./time-edit-input-cell";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import TrueIcon from "@mui/icons-material/Done";
import FalseIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import validateTimeFormat from "../hooks/validate-time";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useDataProvider,
  useGetMany,
  useGetManyReference,
  useNotify,
  useTranslate,
} from "react-admin";
import { BusStop, RouteStop, RouteTrip } from "src/type";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridSlotProps,
  GridToolbarContainer,
  useGridApiContext,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowsProp,
} from "@mui/x-data-grid";

export default function RouteTripTable({ routeId }: { routeId: number }) {
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [, setSearchParams] = useSearchParams();

  // Fetch all routeTrips for the current route
  const { data: rawRouteTrips } = useGetManyReference("routeTrip/dataOnly", {
    target: "busRoute",
    id: routeId,
    pagination: { page: 1, perPage: 100 },
    sort: { field: "start_time", order: "ASC" },
  });

  const { data: routeStops } = useGetManyReference<RouteStop>(
    "routeStop/dataOnly",
    {
      target: "busRoute",
      id: routeId,
      pagination: { page: 1, perPage: 100 },
      sort: { field: "sequence", order: "ASC" },
    },
    { enabled: routeId > 0 }
  );

  const { data: busStops } = useGetMany<BusStop>(
    "busStop",
    {
      ids: routeStops?.map((rs: RouteStop) => rs.bus_stop_id),
    },
    {
      enabled: !!routeStops,
    }
  );

  useEffect(() => {
    if (!rawRouteTrips) return;
    setRows(rawRouteTrips);
  }, [rawRouteTrips]);

  const renderBusStopCell: GridColDef["renderCell"] = ({ value }) => {
    const routeStopId = value as number;
    const routeStop = routeStops?.find((rs) => rs.id === routeStopId);
    const busStop = busStops?.find((bs) => bs.id === routeStop?.bus_stop_id);

    return <span>{busStop?.name}</span>;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await dataProvider.delete("routeTrip", {
        id: Number(id),
      });

      // Delete the searchParams
      setSearchParams((prevParams) => {
        prevParams.delete("tripId");
        return prevParams;
      });

      if (rows.length === 1) {
        window.location.reload();
      } else {
        setRows(rows.filter((row) => row.id !== id));
      }
      notify("resources.routeTrip.notification.deleted", {
        type: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);
      notify("resources.routeTrip.notification.delete_error", {
        type: "error",
      });
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);

    if (rows.length === 1) {
      window.location.reload();
    } else if (editedRow!.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "sequence",
      headerName: translate("resources.routeTrip.fields.sequence"),
      width: 40,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "start_time",
      headerName: translate("resources.routeTrip.fields.start_time"),
      width: 140,
      editable: true,
      renderEditCell: renderTimeEditCell,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        let error = validateTimeFormat(params.props.value);
        if (error) {
          if (error === "Invalid time format (HH:MM:SS)") {
            error = translate(
              "resources.routeTrip.validation.invalidTimeFormat"
            );
          } else if (error === "Invalid time values") {
            error = translate(
              "resources.routeTrip.validation.invalidTimeValues"
            );
          }
        }

        return { ...params.props, error };
      },
    },
    {
      field: "end_time",
      headerName: translate("resources.routeTrip.fields.end_time"),
      width: 140,
      editable: true,
      renderEditCell: renderTimeEditCell,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        let error = validateTimeFormat(params.props.value);
        if (error) {
          if (error === "Invalid time format (HH:MM:SS)") {
            error = translate(
              "resources.routeTrip.validation.invalidTimeFormat"
            );
          } else if (error === "Invalid time values") {
            error = translate(
              "resources.routeTrip.validation.invalidTimeValues"
            );
          }
        }
        return { ...params.props, error };
      },
    },
    {
      field: "active",
      headerName: translate("resources.routeTrip.fields.active"),
      width: 80,
      editable: true,
      renderCell: (params) =>
        params.value ? (
          <TrueIcon sx={{ m: 1.75 }} />
        ) : (
          <FalseIcon sx={{ m: 1.75 }} />
        ),
      renderEditCell: renderSwitchEditInputCell,
    },
    {
      field: "start_route_stop_id",
      headerName: translate("resources.routeTrip.fields.start_point"),
      width: 120,
      editable: true,
      renderCell: renderBusStopCell,
      renderEditCell: renderSelectEditInputCell,
    },
    {
      field: "actions",
      type: "actions",
      headerName: translate("resources.routeTrip.fields.actions"),
      width: 100,
      align: "right",
      cellClassName: "actions",
      getActions: ({ id }: { id: GridRowId }) => {
        if (rowModesModel[id]?.mode === GridRowModes.Edit) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label={translate("resources.routeTrip.save")}
              color="primary"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CloseIcon />}
              label={translate("resources.routeTrip.cancel")}
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="error"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label={translate("resources.routeTrip.edit")}
            onClick={handleEditClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label={translate("resources.routeTrip.delete")}
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
  ];

  const processRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ) => {
    if (newRow.isNew) {
      if (newRow.start_time === newRow.end_time) {
        throw new Error(
          translate("resources.routeTrip.notification.same_time")
        );
      }

      // Handle create
      const { data: createdData } = await dataProvider.create("routeTrip", {
        data: {
          bus_route_id: routeId,
          start_time: newRow.start_time,
          end_time: newRow.end_time,
          start_route_stop_id:
            newRow.start_route_stop_id ?? routeStops?.[0]?.id,
          active: newRow.active,
        },
      });

      setRows((oldRows) =>
        [...oldRows.filter((row) => row.id !== newRow.id), createdData].sort(
          (a, b) => a.start_time.localeCompare(b.end_time)
        )
      );

      notify("resources.routeTrip.notification.created", { type: "success" });

      return createdData;
    }

    // Handle update
    const { data: updatedData } = await dataProvider.update("routeTrip", {
      id: newRow.id,
      data: newRow,
      previousData: oldRow,
    });

    setRows((oldRows) =>
      oldRows.map((row) => (row.id === newRow.id ? updatedData : row))
    );

    notify("resources.routeTrip.notification.updated", { type: "success" });

    return updatedData;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  function EditToolbar(props: GridSlotProps["toolbar"]) {
    const { setRows, setRowModesModel } = props;

    const handleAddTrip = () => {
      // Check if there is an existing new row pending to fill
      const existingNewRow = rows.find((row) => row.isNew);
      if (existingNewRow) {
        return;
      }

      // Generate a temporary negative ID to ensure uniqueness
      const tempId = -Math.floor(Math.random() * 1000000);
      setRows((oldRows: RouteTrip[]) => [
        {
          id: tempId,
          bus_route_id: routeId,
          start_time: "00:00:00",
          end_time: "00:00:00",
          active: false,
          isNew: true,
        },
        ...oldRows,
      ]);
      setRowModesModel((oldModel: GridRowModesModel) => ({
        ...oldModel,
        [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "start_time" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddTrip}>
          {translate("resources.routeTrip.addSchedule")}
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      mt={2}
      sx={{
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows || []}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        getRowId={(row) => {
          if (!row) {
            // console.warn("Received null or undefined row");
            return -1;
          }
          return row.id;
        }}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error: Error) => {
          console.error(error);
          notify(`${error.message}`, { type: "error" });
        }}
        onRowClick={({ id }) => {
          if (id != null) {
            setSearchParams((prevParams) => {
              prevParams.set("tripId", id.toString());
              return prevParams;
            });
          }
        }}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
const renderSwitchEditInputCell: GridColDef["renderCell"] = (params) => {
  return <SwitchEditInputCell {...params} />;
};

function SwitchEditInputCell(props: GridRenderCellParams<any, number>) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLButtonElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    apiRef.current.setEditCellValue({ id, field, value: checked ? 1 : 0 });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
      <Switch
        ref={ref}
        name="active"
        onChange={handleChange}
        checked={value === 1}
        readOnly
        inputProps={{ "aria-label": `Switch at ${id}` }}
      />
    </Box>
  );
}

const renderSelectEditInputCell: GridColDef["renderCell"] = (params) => {
  return <SelectEditInputCell {...params} />;
};

function SelectEditInputCell(props: GridRenderCellParams<any, number>) {
  const { id, value, field } = props;
  const [searchParams] = useSearchParams();
  const currentRouteId = Number(searchParams.get("routeId"));
  const apiRef = useGridApiContext();

  const { data: routeStops } = useGetManyReference<RouteStop>(
    "routeStop/dataOnly",
    {
      target: "busRoute",
      id: currentRouteId,
      pagination: { page: 1, perPage: 100 },
      sort: { field: "sequence", order: "ASC" },
    },
    { enabled: currentRouteId > 0 }
  );

  const { data: busStops } = useGetMany<BusStop>(
    "busStop",
    {
      ids: routeStops?.map((rs: RouteStop) => rs.bus_stop_id),
    },
    {
      enabled: !!routeStops,
    }
  );

  const handleChange = (event: SelectChangeEvent) => {
    apiRef.current.setEditCellValue({ id, field, value: event.target.value });
  };

  return (
    <FormControl fullWidth>
      <Select
        labelId="route-stop-input-label"
        id="route-stop-input"
        value={value?.toString() || routeStops?.[0]?.id?.toString()}
        onChange={handleChange}
      >
        {routeStops?.map((stop) => {
          const associatedBusStop = busStops?.find(
            (bs) => bs.id === stop.bus_stop_id
          );
          return (
            <MenuItem key={stop.id} value={stop?.id}>
              {associatedBusStop?.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
