import FmdGoodIcon from "@mui/icons-material/FmdGood";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// Convert Material UI icon to an HTML string to use in Leaflet
const createMarkerIcon = (color: string) => {
  return function createIcon(name: string) {
    const iconHtml = renderToStaticMarkup(
      <div style={{ display: "flex", alignItems: "center" }}>
        <FmdGoodIcon style={{ color, fontSize: 40 }} />
        <p style={{ marginLeft: "8px", color: "#000000", fontWeight: 700 }}>
          {name}
        </p>
      </div>
    );

    return new L.DivIcon({
      html: iconHtml,
      iconSize: new L.Point(0, 0),
      iconAnchor: [16, 34],
    });
  };
};

export default createMarkerIcon;
