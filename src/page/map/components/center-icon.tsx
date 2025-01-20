import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";

export default function CenterIcon({ map }: { map: any }) {
  return (
    <Box
      position="absolute"
      p={0.5}
      bottom={64}
      left={8}
      zIndex={1000}
      borderRadius={16}
      sx={{
        backgroundColor: "background.default",
      }}
    >
      <IconButton
        aria-label="center"
        onClick={() => map.current.setView([3.125553, 101.655042], 16)}
      >
        <MyLocationIcon />
      </IconButton>
    </Box>
  );
}
