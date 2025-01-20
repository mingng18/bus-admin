// in src/MyLayout.js
import { Layout } from "react-admin";
import { MyMenu } from "./my-menu";

export const MyLayout = (props: any) => <Layout {...props} menu={MyMenu} />;
