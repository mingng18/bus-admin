import { Menu, usePermissions } from "react-admin";
import Divider from "@mui/material/Divider";

export const MyMenu = () => {
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItem name="map" />
      <Divider />
      <Menu.ResourceItem name="bus" />
      <Menu.ResourceItem name="busStop" />
      <Menu.ResourceItem name="busRoute" />
      <Menu.ResourceItem name="routeTrip" />
      <Menu.ResourceItem name="tripRecord" />
      <UserResource />
      <Divider />
      <Menu.ResourceItem name="boardNotification" />
    </Menu>
  );
};

const UserResource = () => {
  const { permissions } = usePermissions();

  if (permissions != undefined && permissions.name === "Super Admin")
    return <Menu.ResourceItem name="users" />;
  return null;
};
