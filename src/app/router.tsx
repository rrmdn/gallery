import { Outlet, createBrowserRouter, useLocation } from "react-router-dom";
import PhotosHomePage from "./photos/home.page";
import PhotoDetailPage from "./photos/detail.page";
import { useEffect, useMemo } from "react";

const RememberMaxScroll = () => {
  const location = useLocation();
  const scrollHeightByPath = useMemo(() => {
    return new Map<string, number>();
  }, []);
  useEffect(
    function restoreScroll() {
      const scrollHeight = scrollHeightByPath.get(location.pathname);
      if (scrollHeight) {
        setTimeout(() => {
          window.scrollTo(0, scrollHeight);
        }, 0);
      }
    },
    [location.pathname, scrollHeightByPath]
  );

  useEffect(
    function listenScroll() {
      function handleScroll() {
        scrollHeightByPath.set(location.pathname, window.scrollY);
      }
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    },
    [location.pathname, scrollHeightByPath]
  );

  return null;
};

const App = () => {
  return (
    <>
      <Outlet />
      <RememberMaxScroll />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <PhotosHomePage />,
      },
      {
        path: "/photos/:id",
        element: <PhotoDetailPage />,
      },
    ],
  },
]);

export default router;
