import {
  Create,
  Datagrid,
  DateField,
  Edit,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  maxLength,
  regex,
  required,
  useRecordContext,
  SearchInput,
} from "react-admin";
import CustomToolbar from "src/components/custom-toolbar";

export const BusList = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" />
      <ReferenceField
        source="car_type_id"
        reference="carType"
        label="resources.bus.fields.car_type"
      />
      <ReferenceField
        source="car_status_id"
        reference="carStatus"
        label="resources.bus.fields.car_status"
      />
      <TextField source="plate_no" label="resources.bus.fields.plate_number" />
      <TextField source="imei_number" />
      <TextField source="year" />
      <TextField source="model" />
      <TextField source="brand" />
      {/* <TextField source="image_path" /> */}
      <TextField source="created_by" />
      <TextField source="updated_by" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
);

const BusTitle = () => {
  const record = useRecordContext();
  return <span>Edit Bus {record ? `"${record.plate_no}"` : ""}</span>;
};

export const BusEdit = () => (
  <Edit title={<BusTitle />}>
    <SimpleForm toolbar={<CustomToolbar />}>
      <ReferenceInput
        source="car_type_id"
        reference="carType"
        label="resources.bus.fields.car_type"
      >
        <SelectInput validate={[required()]} />
      </ReferenceInput>
      <ReferenceInput
        source="car_status_id"
        reference="carStatus"
        label="resources.bus.fields.car_status"
      >
        <SelectInput validate={[required()]} />
      </ReferenceInput>
      <TextInput
        source="imei_number"
        validate={[maxLength(20, "resources.bus.validation.imeiLessThan20")]}
      />
      <TextInput
        source="plate_no"
        validate={[
          required(),
          maxLength(20, "resources.bus.validation.plateNoLessThan20"),
        ]}
      />
      <TextInput
        source="year"
        validate={[regex(/^\d{4}$/, "resources.bus.validation.zipCodeValid")]}
      />
      <TextInput source="model" />
      <TextInput source="brand" />
      {/* <TextInput source="image_path" /> */}
    </SimpleForm>
  </Edit>
);

export const BusCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput
        source="car_type_id"
        reference="carType"
        label="resources.bus.fields.car_type"
      >
        <SelectInput validate={[required()]} />
      </ReferenceInput>
      <ReferenceInput
        source="car_status_id"
        reference="carStatus"
        label="resources.bus.fields.car_status"
      >
        <SelectInput validate={[required()]} />
      </ReferenceInput>
      <TextInput
        source="imei_number"
        validate={[maxLength(20, "resources.bus.validation.imeiLessThan20")]}
      />
      <TextInput
        source="plate_no"
        validate={[
          required(),
          maxLength(20, "resources.bus.validation.plateNoLessThan20"),
        ]}
      />
      <TextInput
        source="year"
        validate={[regex(/^\d{4}$/, "resources.bus.validation.zipCodeValid")]}
      />
      <TextInput source="model" />
      <TextInput source="brand" />
      {/* <TextInput source="image_path" /> */}
    </SimpleForm>
  </Create>
);
