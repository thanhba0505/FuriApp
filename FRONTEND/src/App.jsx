import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { loginRoutes, noLoginRoutes } from "~/routes";
import DefaultLayout from "~/components/Layout/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef } from "react";
import { refreshAccount } from "./api/accountApi";
import { jwtDecode } from "jwt-decode";

const CheckAuth = ({ children }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const dispatch = useDispatch();
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    if (account) {
      const decodedToken = jwtDecode(account.accessToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decodedToken.exp - currentTime - 60;

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      if (timeUntilExpiry > 0) {
        timeoutIdRef.current = setTimeout(() => {
          refreshAccount(dispatch);
        }, timeUntilExpiry * 1000);
      }
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [account, dispatch, timeoutIdRef]);

  return <>{children}</>;
};

const App = () => {
  const account = useSelector((state) => state.auth.login?.currentAccount);

  return (
    <Router>
      <Routes>
        {account ? (
          <>
            {loginRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;

              if (route.layout) {
                Layout = route.layout;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <CheckAuth>
                      <Layout>
                        <Page />
                      </Layout>
                    </CheckAuth>
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {noLoginRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;

              if (route.layout) {
                Layout = route.layout;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

const AppMemo = React.memo(App);

export default AppMemo;
