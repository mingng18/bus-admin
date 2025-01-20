import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { StepIconProps } from "@mui/material/StepIcon";
import { useMemo } from "react";

const useCustomStepStyles = (routeColor: string) => {
  const CustomConnector = useMemo(
    () =>
      styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.root}`]: {
          marginLeft: 4,
          height: 36,
        },
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
          // top: 10,
          // left: "calc(-50% + 16px)",
          // right: "calc(50% + 16px)",
          top: 12, // Adjust connector position
          left: "50%", // Start at the center of the previous step
          transform: "translateX(-50%)", // Adjust for centering
          width: "100%", // Ensure connector spans the space between steps
        },
        [`&.${stepConnectorClasses.vertical}`]: {
          [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.divider,
          },
        },
        [`&.${stepConnectorClasses.horizontal}`]: {
          position: "relative",
          minWidth: 24,

          [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.divider,
            position: "absolute",
            top: "50%",
            width: "100%",
          },
        },
        [`&.${stepConnectorClasses.active}`]: {
          [`& .${stepConnectorClasses.line}`]: {
            borderColor: `${routeColor}`,
          },
        },
        [`&.${stepConnectorClasses.completed}`]: {
          [`& .${stepConnectorClasses.line}`]: {
            borderColor: `${routeColor}`,
          },
        },
        [`& .${stepConnectorClasses.line}`]: {
          height: "2",

          // width: "calc(100% - 24px)", // Adjust based on icon size and padding
          borderRadius: 2,
          top: "50%",
          borderWidth: 4,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        },
      })),
    [routeColor]
  );

  const CustomStepIconRoot = useMemo(
    () =>
      styled("div")<{
        ownerState: { active?: boolean };
      }>(({ theme }) => ({
        display: "flex",
        alignItems: "flex-start",
        width: 12,
        height: 12,
        "& .CustomStepIcon-coloredCircle": {
          width: 12,
          height: 12,
          borderRadius: "50%",
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: `${routeColor}`,
        },
        "& .CustomStepIcon-defaultCircle": {
          width: 12,
          height: 12,
          borderRadius: "50%",
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: theme.palette.divider,
        },
      })),
    [routeColor]
  );

  const CustomStepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;

    return (
      <CustomStepIconRoot ownerState={{ active }} className={className}>
        {completed || active ? (
          <div className="CustomStepIcon-coloredCircle" />
        ) : (
          <div className="CustomStepIcon-defaultCircle" />
        )}
      </CustomStepIconRoot>
    );
  };

  return { CustomConnector, CustomStepIcon };
};

export default useCustomStepStyles;
