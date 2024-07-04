// Layout
import ContainerLayout from "~/components/Layout/ContainerLayout";
import SidebarLeftLayout from "~/components/Layout/SidebarLeftLayout";
import NoLayout from "~/components/Layout/NoLayout";

// Pages
import Home from "~/pages/Home";
import Video from "~/pages/Video";
import Everyone from "~/pages/Everyone";
import Message from "~/pages/Message";
import Notification from "~/pages/Notification";

import Profile from "~/pages/Profile";
import Post from "~/pages/Post";

import Auth from "~/pages/Auth";

// public routes
const loginRoutes = [
  { path: "/", component: Home },

  { path: "/video", component: Video },

  { path: "/message/:conversationId", component: Message },
  { path: "/message", component: Message },

  { path: "/notification", component: Notification },

  { path: "/everyone/:tabName", component: Everyone },
  { path: "/everyone", component: Everyone },

  { path: "/profile/:accountId", component: Profile },
  { path: "/post/:postId", component: Post },
];

// private routes
const noLoginRoutes = [{ path: "/auth", component: Auth, layout: NoLayout }];

export { loginRoutes, noLoginRoutes };
