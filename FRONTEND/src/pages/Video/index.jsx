import { useSelector } from "react-redux";
// import { testUser } from "~/api/userApi";
import Paper from "~/components/Paper";

function Video() {
  const account = useSelector((state) => state.other.app?.logo);
  const page = useSelector((state) => state.other.authPage?.page);

  // // const dispatch = useDispatch();

  // // const axiosJWTa = axiosJWT(dispatch, account);

  // const test = testUser(account?.accessToken);

  console.log(account);
  console.log(import.meta.env.VITE_FURI_API_BASE_URL + "/api/app/logo-furi.png");
  return (
    <>
      <Paper></Paper>
    </>
  );
}

export default Video;
