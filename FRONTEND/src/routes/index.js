// Layout
import ContainerLayout from "~/components/Layout/ContainerLayout";
import SidebarLeftLayout from "~/components/Layout/SidebarLeftLayout";
import NoLayout from "~/components/Layout/NoLayout";

// Pages
import Home from "~/pages/Home";
import Video from "~/pages/Video";
import Everyone from "~/pages/Everyone";
import Message from "~/pages/Message";

import Friends from "~/pages/Friends";
import Profile from "~/pages/Profile";

import Auth from "~/pages/Auth";

// public routes
const loginRoutes = [
  { path: "/", component: Home },
  { path: "/video", component: Video },
  { path: "/everyone", component: Everyone },
  { path: "/message", component: Message },
  { path: "/friends", component: Friends, layout: SidebarLeftLayout },
  { path: "/profile", component: Profile, layout: ContainerLayout },
];

// private routes
const noLoginRoutes = [{ path: "/auth", component: Auth, layout: NoLayout }];

export { loginRoutes, noLoginRoutes };
