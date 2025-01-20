import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
  Edit,
  ReferenceInput,
  SimpleForm,
  Create,
  DateTimeInput,
  AutocompleteInput,
  useCreate,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  useTranslate,
  SearchInput,
} from "react-admin";
import { useSearchParams } from "react-router-dom";

export const TripRecordList = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" />
      <ReferenceField
        source="driver_id"
        reference="users"
        label="resources.tripRecord.fields.driver"
      />
      <ReferenceField
        source="bus_id"
        reference="bus"
        label="resources.tripRecord.fields.bus"
      />
      <ReferenceField
        source="bus_route_id"
        reference="busRoute"
        label="resources.tripRecord.fields.bus_route"
      />
      <DateField
        source="start_datetime"
        label="resources.tripRecord.fields.start_datetime"
        showTime
      />
      <DateField
        source="end_datetime"
        label="resources.tripRecord.fields.end_datetime"
        showTime
      />
      <DateField
        source="created_at"
        label="resources.tripRecord.fields.created_at"
        showTime
      />
      <DateField
        source="updated_at"
        label="resources.tripRecord.fields.updated_at"
        showTime
      />
    </Datagrid>
  </List>
);

export const TripRecordCreate = () => {
  const [create] = useCreate();
  const [searchParams] = useSearchParams();
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();

  const onSubmit = async (data: any) => {
    // format in 2024-11-24 11:19:58
    try {
      const startTime = new Date().toISOString().slice(0, 19).replace("T", " ");

      const body = {
        ...data,
        start_datetime: startTime,
        current_route_stop_sequence: 1,
        trip_status: "ON_THE_WAY",
      };

      await create(`tripRecord`, { data: body });
      notify("resources.tripRecord.notification.createSuccess", {
        type: "success",
      });
      redirect(`/tripRecord`);
    } catch (error) {
      notify(
        `${translate(
          "resources.tripRecord.notification.createError"
        )} ${error}`,
        {
          type: "error",
        }
      );
    }
  };

  console.log("searchParams", searchParams.get("bus_id"));

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit}>
        <ReferenceInput source="driver_id" reference="users" />
        <ReferenceInput source="bus_id" reference="bus" perPage={300}>
          <AutocompleteInput
            optionText="plate_no"
            defaultValue={Number(searchParams.get("bus_id"))}
          />
        </ReferenceInput>
        <ReferenceInput
          source="bus_route_id"
          reference="busRoute"
          recordRepresentation="plate_no"
        />
      </SimpleForm>
    </Create>
  );
};

export const TripRecordEdit = () => {
  return (
    <Edit>
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton />
          </Toolbar>
        }
      >
        <ReferenceInput source="driver_id" reference="users" />
        <ReferenceInput source="bus_id" reference="bus" perPage={300}>
          <AutocompleteInput optionText="plate_no" />
        </ReferenceInput>
        <ReferenceInput source="bus_route_id" reference="busRoute" />
        <DateTimeInput source="start_datetime" readOnly />
        <DateTimeInput
          source="end_datetime"
          parse={(value: string) => {
            return value.slice(0, 19).replace("T", " ");
          }}
        />
      </SimpleForm>
    </Edit>
  );
};
