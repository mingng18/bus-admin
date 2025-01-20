import { forwardRef } from "react";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import {
  GridRenderEditCellParams,
  GridEditInputCell,
  GridColDef,
} from "@mui/x-data-grid";
import { styled } from "@mui/system";

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

// Custom NumberEditInputCell with error tooltip handling
function NumberEditInputCell(props: GridRenderEditCellParams) {
  const { error, row, ...otherProps } = props;

  if (row.sequence === 1) {
    // disable the input field
    otherProps.disabled = true;
  }

  return (
    <StyledTooltip open={!!error} title={error || ""}>
      <div>
        {/* Ensure that GridEditInputCell correctly receives forwarded props */}
        <GridEditInputCell {...otherProps} type="number" />
      </div>
    </StyledTooltip>
  );
}

// Cell rendering function for number inputs
const renderNumberEditCell: GridColDef["renderCell"] = (params) => {
  return <NumberEditInputCell {...params} />;
};

export default renderNumberEditCell;
