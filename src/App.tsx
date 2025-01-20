import DirectionsIcon from "@mui/icons-material/Directions";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import BusRouteMapPage from "./page/manage/bus-route/bus-route-page";
import CreatePolylinePage from "./page/manage/polyline/create-polyline-page";
import RouteTripList from "./page/manage/route-trip/route-trip-list";
import EditPolylinePage from "./page/manage/polyline/edit-polyline-page";
import RouteStopEdit from "./page/manage/route-stop/edit-route-stop";
import RouteStopCreate from "./page/manage/route-stop/create-route-stop";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { Route } from "react-router-dom";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { MyAuthProvider, MyDataProvider, i18nProvider } from "./providers";
import { MyLayout } from "./components/my-layout";
import { BusList, BusEdit, BusCreate } from "./page/manage/buses/buses";
import { UserList, UserEdit, UserCreate } from "./page/manage/user/users";
import { AuthPage } from "./page/auth/auth-page";
import { DashboardPage } from "./page/dashboard/dashboard-page";
import { MapPage } from "./page/map/map-page";
import { myDarkTheme, myLightTheme } from "./util/theme-creator";
import {
  BoardNotificationList,
  BoardNotificationEdit,
  BoardNotificationCreate,
} from "./page/notification/board-notification";
import {
  BusRouteEdit,
  BusRouteCreate,
} from "./page/manage/bus-route/bus-routes";
import {
  BusStopList,
  BusStopEdit,
  BusStopCreate,
} from "./page/manage/bus-stop/bus-stop";
import {
  TripRecordList,
  TripRecordEdit,
  TripRecordCreate,
} from "./page/manage/trip-record/trip-records";

export const App = () => {
  return (
    <Admin
      loginPage={AuthPage}
      dashboard={DashboardPage}
      layout={MyLayout}
      authProvider={MyAuthProvider}
      dataProvider={MyDataProvider}
      i18nProvider={i18nProvider}
      darkTheme={myDarkTheme}
      lightTheme={myLightTheme}
    >
      <Resource
        name="map"
        options={{ label: "resources.map.name" }}
        icon={DirectionsIcon}
        list={MapPage}
      />
      <Resource
        name="bus"
        options={{ label: "resources.bus.name" }}
        recordRepresentation={(record) => `${record.plate_no}`}
        list={BusList}
        edit={BusEdit}
        create={BusCreate}
        icon={DirectionsBusIcon}
      />
      <Resource
        name="busStop"
        options={{ label: "resources.busStop.name" }}
        list={BusStopList}
        edit={BusStopEdit}
        create={BusStopCreate}
        recordRepresentation={(record) => `${record.name}`}
        icon={FmdGoodIcon}
      />
      <Resource
        name="busRoute"
        options={{ label: "resources.busRoute.name" }}
        list={BusRouteMapPage}
        edit={BusRouteEdit}
        create={BusRouteCreate}
        recordRepresentation={(record) => `${record.name}`}
        icon={AddRoadIcon}
      />
      <Resource
        name="routeStop"
        options={{ label: "resources.routeStop.name" }}
        create={RouteStopCreate}
      />
      <Resource
        name="polyline"
        options={{ label: "resources.polyline.name" }}
        create={CreatePolylinePage}
      />
      <CustomRoutes>
        <Route path="/routeStop/edit" element={<RouteStopEdit />} />
        <Route path="/polyline/edit" element={<EditPolylinePage />} />
      </CustomRoutes>
      <Resource
        name="tripRecord"
        options={{ label: "resources.tripRecord.name" }}
        list={TripRecordList}
        edit={TripRecordEdit}
        create={TripRecordCreate}
        icon={HistoryIcon}
      />
      <Resource
        name="boardNotification"
        options={{ label: "resources.boardNotification.name" }}
        list={BoardNotificationList}
        edit={BoardNotificationEdit}
        create={BoardNotificationCreate}
        icon={DeveloperBoardIcon}
      />
      <Resource
        name="users"
        options={{ label: "resources.users.name" }}
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        recordRepresentation={(record) => `${record.fullname}`}
        icon={PersonIcon}
      />
      <Resource
        name="routeTrip"
        options={{ label: "resources.routeTrip.name" }}
        list={RouteTripList}
      />

      {/* Data Resource */}
      <Resource
        name="roles"
        options={{ label: "resources.roles.name" }}
        recordRepresentation={(record) => `${record.name}`}
      />
      <Resource
        name="students"
        options={{ label: "resources.students.name" }}
        recordRepresentation={(record) => `${record.matric_no}`}
      />
      <Resource
        name="carStatus"
        options={{ label: "resources.carStatus.name" }}
        recordRepresentation={(record) => `${record.name}`}
      />
      <Resource
        name="ptj"
        options={{ label: "PTJ" }}
        recordRepresentation={(record) => `${record.code}`}
      />
      <Resource
        name="carType"
        options={{ label: "resources.carType.name" }}
        recordRepresentation={(record) => `${record.name}`}
      />
      <Resource
        name="gpsData"
        options={{ label: "resources.gpsData.name" }}
        recordRepresentation={(record) => `${record.name}`}
      />
    </Admin>
  );
};
