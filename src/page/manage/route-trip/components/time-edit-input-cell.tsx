import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef } from "react";
import { GridRenderEditCellParams, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Styled Tooltip with proper ref forwarding
const StyledTooltip = styled(
  forwardRef(function CustomTooltip(props: TooltipProps, ref) {
    return (
      <Tooltip {...props} ref={ref} classes={{ popper: props.className }} />
    );
  })
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

// Custom TimeEditInputCell with error tooltip handling
// function TimeEditInputCell(props: GridRenderEditCellParams) {
//   const { error, ...otherProps } = props;
//   return (
//     <StyledTooltip open={!!error} title={error || ""}>
//       <div>
//         {/* Ensure that GridEditInputCell correctly receives forwarded props */}
//         <GridEditInputCell {...otherProps} />
//       </div>
//     </StyledTooltip>
//   );
// }

function TimeEditInputCell(props: GridRenderEditCellParams) {
  const { error, value, api, field, id } = props;

  const handleTimeChange = (newValue: Dayjs | null) => {
    const formattedValue = newValue?.format("HH:mm:ss") || null;
    api.setEditCellValue({ id, field, value: formattedValue });
  };

  const dateValue: Dayjs | null | undefined = value
    ? dayjs(value, "HH:mm:ss")
    : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledTooltip open={!!error} title={error || ""}>
        <div>
          <TimePicker
            value={dateValue}
            format="HH:mm:ss"
            onChange={handleTimeChange}
          />
        </div>
      </StyledTooltip>
    </LocalizationProvider>
  );
}

// Cell rendering function for time inputs
const renderTimeEditCell: GridColDef["renderCell"] = (params) => {
  return <TimeEditInputCell {...params} />;
};

export default renderTimeEditCell;
