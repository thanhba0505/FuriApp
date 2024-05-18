// Layout
import ContainerLayout from "~/components/Layout/ContainerLayout";
import SidebarLeftLayout from "~/components/Layout/SidebarLeftLayout";
import NoLayout from "~/components/Layout/NoLayout";

// Pages
import Home from "~/pages/Home";
import Video from "~/pages/Video";
import Group from "~/pages/Group";
import Store from "~/pages/Store";

import Friends from "~/pages/Friends";
import Profile from "~/pages/Profile";

import Auth from "~/pages/Auth";

// public routes
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/video", component: Video },
  { path: "/group", component: Group },
  { path: "/store", component: Store },
  { path: "/friends", component: Friends, layout: SidebarLeftLayout },
  { path: "/profile", component: Profile, layout: ContainerLayout },
  { path: "/auth", component: Auth, layout: NoLayout },
];

// private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
