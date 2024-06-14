import { MaterialDesignContent, SnackbarProvider } from "notistack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from '@mui/icons-material/Error';
import styled from "@emotion/styled";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(
  ({ theme }) => ({
    "&.notistack-MuiContent-success": {
      backgroundColor: theme.palette.primary.main,
    },
    "&.notistack-MuiContent-error": {
      backgroundColor: theme.palette.error.main,
    },
  })
);

const SnackbarProviderCustom = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={2000}
      variant={"success"}
      iconVariant={{
        success: <CheckCircleIcon sx={{ mr: 1 }} />,
        error: <ErrorIcon sx={{ mr: 1 }} />,
      }}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarProviderCustom;
