import {
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
  Create,
  useGetIdentity,
  SelectInput,
  required,
  DateTimeInput,
  SearchInput,
} from "react-admin";

export const BoardNotificationList = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users" />
      <TextField source="title" />
      <TextField source="content" />
      <DateField source="scheduled_at" />
      <DateField source="end_at" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
);

export const BoardNotificationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" multiline validate={[required()]} />
      <TextInput source="content" multiline validate={[required()]} />
      <DateTimeInput source="scheduled_at" validate={[required()]} />
      <DateTimeInput source="end_at" validate={[required()]} />
    </SimpleForm>
  </Edit>
);

export const BoardNotificationCreate = () => {
  const { data } = useGetIdentity();

  return (
    <Create>
      <SimpleForm>
        <ReferenceInput source="user_id" reference="users">
          <SelectInput source="user_id" defaultValue={data?.id} disabled />
        </ReferenceInput>
        <TextInput source="title" validate={[required()]} />
        <TextInput source="content" multiline validate={[required()]} />
        <DateTimeInput source="scheduled_at" validate={[required()]} />
        <DateTimeInput source="end_at" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};
