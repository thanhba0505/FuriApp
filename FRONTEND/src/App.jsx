import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { loginRoutes, noLoginRoutes } from "~/routes";
import DefaultLayout from "~/components/Layout/DefaultLayout";
import { useSelector } from "react-redux";

function App() {
  let account = useSelector((state) => state.auth.login?.currentAccount);
  
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
                    <Layout>
                      <Page />
                    </Layout>
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
}

export default App;
