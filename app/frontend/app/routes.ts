import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("mainPage", "routes/MainPageContainer.tsx"),
  route("app", "routes/app.tsx"),
  route("login", "routes/login.tsx"),
  route("new-session", "routes/NewSessionContainer.tsx"),
  route("past-sessions", "routes/PastSessionsContainer.tsx"),
  route("mainPage/new-session/current-session", "routes/CurrentSessionContainer.tsx"),
  route("user-profile", "routes/UserProfileContainer.tsx")
] satisfies RouteConfig;
