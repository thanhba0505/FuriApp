// Layout
import ContainerLayout from "~/components/Layout/ContainerLayout";
import SidebarLeftLayout from "~/components/Layout/SidebarLeftLayout";
import NoLayout from "~/components/Layout/NoLayout";

// Pages
import Home from "~/pages/Home";
import Video from "~/pages/Video";
import Everyone from "~/pages/Everyone";
import Message from "~/pages/Message";

import Profile from "~/pages/Profile";

import Auth from "~/pages/Auth";

// public routes
const loginRoutes = [
  { path: "/", component: Home },

  { path: "/video", component: Video },

  { path: "/message/:conversationId", component: Message },
  { path: "/message", component: Message },

  { path: "/everyone/:tabId", component: Everyone },
  { path: "/everyone", component: Everyone },

  { path: "/profile/:accountId", component: Profile },
];

// private routes
const noLoginRoutes = [{ path: "/auth", component: Auth, layout: NoLayout }];

export { loginRoutes, noLoginRoutes };
