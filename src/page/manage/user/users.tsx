import {
  Datagrid,
  DateField,
  EmailField,
  List,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  usePermissions,
  useTranslate,
  required,
  SearchInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceArrayField,
} from "react-admin";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const UserList = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" />
      <TextField source="google_id" />
      <TextField source="fullname" />
      <EmailField source="email" />
      <DateField source="email_verified_at" />
      <ReferenceArrayField source="roles" reference="roles" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
);

export const UserEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="fullname" validate={[required()]} />
        <TextInput source="email" validate={[required()]} />
        <ReferenceArrayInput source="roles" reference="roles">
          <SelectArrayInput />
        </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export const UserCreate = () => {
  const translate = useTranslate();
  const { permissions } = usePermissions();

  if (permissions != undefined && permissions.name !== "Super Admin")
    return (
      <Box mx="auto" my="auto">
        <Typography variant="h4" color="initial">
          {translate("resources.users.notAllowed")}
        </Typography>
      </Box>
    );

  return (
    <Create>
      <SimpleForm>
        <TextInput source="fullname" validate={[required()]} />
        <TextInput source="email" validate={[required()]} />
        <TextInput source="password" type="password" validate={[required()]} />
        <ReferenceArrayInput source="roles" reference="roles">
          <SelectArrayInput />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
