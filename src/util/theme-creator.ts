import { alpha, createTheme, Theme, PaletteOptions } from "@mui/material";

const componentsOverrides = (theme: Theme) => {
  const shadows = [
    alpha(theme.palette.primary.main, 0.2),
    alpha(theme.palette.primary.main, 0.1),
    alpha(theme.palette.primary.main, 0.05),
  ];
  return {
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined" as const,
      },
      styleOverrides: {
        sizeSmall: {
          padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "outlined" as const,
        margin: "dense" as const,
        size: "small" as const,
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: `${shadows[0]} -2px 2px, ${shadows[1]} -4px 4px,${shadows[2]} -6px 6px`,
        },
        root: {
          backgroundClip: "padding-box",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.5),
          "&.MuiTableCell-sizeSmall": {
            padding: theme.spacing(1),
          },
          "&.MuiTableCell-paddingNone": {
            padding: 0,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { border: 0 },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined" as const,
        margin: "dense" as const,
        size: "small" as const,
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    RaFilterForm: {
      styleOverrides: {
        root: {
          [theme.breakpoints.up("sm")]: {
            minHeight: theme.spacing(6),
          },
        },
      },
    },
    RaLayout: {
      styleOverrides: {
        root: {
          "& .RaLayout-appFrame": { marginTop: theme.spacing(5) },
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderLeft: `3px solid ${theme.palette.primary.contrastText}`,
          "&:hover": {
            borderRadius: "0px 100px 100px 0px",
          },
          "&.RaMenuItemLink-active": {
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            borderRadius: "0px 100px 100px 0px",
            backgroundImage: `linear-gradient(98deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark} 94%)`,
            boxShadow: theme.shadows[1],
            color: theme.palette.primary.contrastText,

            "& .MuiSvgIcon-root": {
              fill: theme.palette.primary.contrastText,
            },
          },
        },
      },
    },
  };
};

const alertColor = {
  error: { main: "#DB488B" },
  warning: { main: "#F2E963" },
  info: { main: "#3ED0EB" },
  success: { main: "#0FBF9F" },
};

const darkPalette: PaletteOptions = {
  primary: { main: "#66aaff", dark: "#0066cc" },
  secondary: { main: "#ffa64d" },
  background: { default: "#121212", paper: "#1e1e1e" },
  ...alertColor,
  mode: "dark" as "dark",
};

const lightPalette: PaletteOptions = {
  primary: { main: "#0066cc", light: "#66aaff" },
  secondary: { main: "#ff7e29" },
  background: { default: "#f0f4f8", paper: "#ffffff" },
  ...alertColor,
  mode: "light" as "light",
};

const createHouseTheme = (palette: PaletteOptions) => {
  const themeOptions = {
    palette,
    shape: { borderRadius: 20 },
    sidebar: { width: 250 },
    spacing: 9,
    typography: { fontFamily: ["quicksand", "latin"].join(",") },
  };
  const theme = createTheme(themeOptions);
  theme.components = componentsOverrides(theme);
  return theme;
};

export const myLightTheme = createHouseTheme(lightPalette);
export const myDarkTheme = createHouseTheme(darkPalette);
