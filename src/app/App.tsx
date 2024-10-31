import { Outlet } from "react-router-dom";
import { RememberMaxScroll } from "./RememberMaxScroll";

export const App = () => {
  return (
    <>
      <Outlet />
      <RememberMaxScroll />
    </>
  );
};
