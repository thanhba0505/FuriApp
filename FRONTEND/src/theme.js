import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

// Create a theme instance.
const theme = extendTheme({
  furi: {
    header: {
      height: "80px",
    },
    global: {
      paddingX: "20px",
    },
  },
  colorSchemes: {
    light: {
      lableSelect: "#fff",
      palette: {
        custom: {
          background: "#ffffff",
          backgroundApp: "#ffffff",
          backgroundAppContent: "#eef0f599",
          backgroundMessage: "#eef0f5af",
        },
        primary: {
          main: blue["A700"],
        },
        background: {
          content: "#C5FFF8",
          paper: "#eef0f5",
          default: "#fff",
        },
      },
      shadows: {
        [1]: "0px 2px 1px -1px rgba(0,0,0,0.11),0px 0px 2px 0px rgba(0,0,0,0.14),0px 1px 0px 0px rgba(0,0,0,0.05)",
      },
    },
    dark: {
      lableSelect: "#1e1e1e",
      palette: {
        custom: {
          background: "#1e1e1e",
          backgroundApp: "#272727",
          backgroundAppContent: "#121212",
          backgroundMessage: "#121212af",
        },
      },
      shadows: {
        [1]: "0px 2px 1px -1px rgba(0,0,0,0.11),0px 0px 2px 0px rgba(0,0,0,0.14),0px 1px 0px 0px rgba(0,0,0,0.05)",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       ".MuiOutlinedInput-notchedOutline": {
    //         // color: theme.palette.primary.light,
    //       },
    //     }),
    //   },
    // },
  },
});

export default theme;
