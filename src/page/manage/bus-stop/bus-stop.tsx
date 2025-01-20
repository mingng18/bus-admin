import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  Edit,
  List,
  NumberField,
  NumberInput,
  SimpleForm,
  TextField,
  TextInput,
  number,
  required,
  SearchInput,
} from "react-admin";
import CustomToolbar from "src/components/custom-toolbar";

export const BusStopList = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="short_name" />
      <TextField source="address" />
      <BooleanField source="is_hide" looseValue />
      <NumberField source="latitude" />
      <NumberField source="longitude" />
      {/* <TextField source="picture_url" /> */}
    </Datagrid>
  </List>
);

export const BusStopEdit = () => (
  <Edit>
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput source="name" multiline validate={[required()]} />
      <TextInput source="short_name" validate={[required()]} />
      <TextInput source="address" multiline validate={[required()]} />
      <NumberInput source="longitude" validate={[required(), number()]} />
      <NumberInput source="latitude" validate={[required(), number()]} />
      <BooleanInput source="is_hide" />
      {/* <TextInput source="picture_url" /> */}
    </SimpleForm>
  </Edit>
);

export const BusStopCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" multiline validate={[required()]} />
      <TextInput source="short_name" validate={[required()]} />
      <TextInput source="address" multiline validate={[required()]} />
      <NumberInput source="longitude" validate={[required(), number()]} />
      <NumberInput source="latitude" validate={[required(), number()]} />
      <BooleanInput source="is_hide" />
      {/* <TextInput source="picture_url" /> */}
    </SimpleForm>
  </Create>
);
