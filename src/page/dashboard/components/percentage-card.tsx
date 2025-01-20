import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export default function PercentageCard({
  title,
  percentage,
}: {
  title: string;
  percentage: number;
}) {
  return (
    <Grid item>
      <Stack
        width="100%"
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        bgcolor="background.paper"
        borderRadius={2}
        border={1}
        borderColor="divider"
        p={2}
        overflow="hidden"
      >
        <DirectionsBusIcon />
        <Stack>
          <Typography variant="overline" color="initial">
            {title}
          </Typography>
          <Typography variant="h6" color="initial" align="right">
            {percentage}%
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  );
}
