import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

function TextInput({
  label,
  placeholder,
  type = "text",
  variant = "outlined",
  textError,
  value,
  onChange,
  placement = "top-end",
  onKeyPress,
}) {
  return (
    <>
      <TextField
        onKeyDown={onKeyPress}
        fullWidth
        error={textError ? true : false}
        label={label}
        variant={variant}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {textError && (
                <Tooltip
                  TransitionComponent={Zoom}
                  title={textError}
                  arrow
                  placement={placement}
                >
                  <IconButton color="error">
                    <WarningAmberRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}

export default TextInput;
