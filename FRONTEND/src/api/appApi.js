const appApi = (image) => {
  let result = "";

  switch (image) {
    case "logo":
      result = import.meta.env.VITE_FURI_API_BASE_URL + "/public/app/logo.png";
      break;
    case "nameApp":
      result = "Furi";
      break;

    default:
      break;
  }

  return result;
};

export default appApi;
