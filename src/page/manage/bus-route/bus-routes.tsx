import {
  BooleanInput,
  Create,
  Edit,
  ImageField,
  ImageInput,
  NumberInput,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  required,
  useTranslate,
} from "react-admin";
import Box from "@mui/material/Box";
import { ColorInput } from "react-admin-color-picker";

const UserEditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

export const BusRouteEdit = () => {
  const translate = useTranslate();
  return (
    <Edit>
      <SimpleForm toolbar={<UserEditToolbar />}>
        <TextInput source="name" validate={[required()]} />
        <TextInput source="desc" validate={[required()]} />
        <NumberInput source="distance" label="Distance (m)" />
        <Box mb="20px">
          <ColorInput
            source="map_color"
            label={translate("resources.busRoute.fields.map_color")}
            variant="outlined"
            helperText=""
            picker="Swatches"
          />
        </Box>
        <BooleanInput
          source="is_active"
          label={translate("resources.busRoute.fields.is_active")}
        />
        <ImageInput
          source="schedule_file"
          label={translate("resources.busRoute.fields.schedule_file")}
          accept="image/*"
          multiple={false}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};

export const BusRouteCreate = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data: any) => {
    notify("resources.busRoute.notification.createSuccess", {
      type: "success",
    });
    redirect(`/routeStop/create?routeId=${data.id}`);
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="name" validate={[required()]} autoComplete="off" />
        <TextInput
          source="desc"
          validate={[required()]}
          multiline
          autoComplete="off"
        />
        {/* <NumberInput source="distance" /> */}
        <Box mb="20px">
          <ColorInput
            source="map_color"
            label={translate("resources.busRoute.fields.map_color")}
            variant="outlined"
            helperText=""
            picker="Swatches"
          />
        </Box>
        <BooleanInput
          source="is_active"
          label={translate("resources.busRoute.fields.is_active")}
        />
        <TextInput
          source="schedule_file"
          label={translate("resources.busRoute.fields.schedule_file")}
        />

        {/* <ImageInput
        source="schedule_file"
        label="Schedule File"
        accept="image/*"
        multiple={false}
      >
        <ImageField source="src" title="title" />
      </ImageInput> */}
      </SimpleForm>
    </Create>
  );
};
