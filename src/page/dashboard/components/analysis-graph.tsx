import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { LineChart } from "@mui/x-charts/LineChart";

const busStops = [
  "UM Central",
  "Pusat Asasi",
  "KK12",
  "API",
  "KK10",
  "KK7",
  "Fakulti Sains",
];

const busOccupancy = [32, 42, 66, 36, 35, 33, 28];

export default function AnalysisGraph() {
  return (
    <Stack
      width="100%"
      spacing={1}
      justifyContent="space-between"
      bgcolor="background.paper"
      borderRadius={2}
      border={1}
      borderColor="divider"
      p={2}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          30 Day Bus Occupancy (March)
        </Typography>
        <Chip
          label="AB"
          variant={"filled"}
          sx={{
            backgroundColor: "#C33A58",
            color: "white",
          }}
        />
      </Stack>
      <LineChart
        xAxis={[{ data: busStops, scaleType: "point" }]}
        series={[{ data: busOccupancy, area: true }]}
        height={300}
        margin={{ top: 16, bottom: 20 }}
      />
    </Stack>
  );
}
