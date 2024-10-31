import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        async lazy() {
          const HomePage = await import("./photos/home.page");
          return { Component: HomePage.default };
        },
      },
      {
        path: "/photos/:id",
        async lazy() {
          const DetailPage = await import("./photos/detail.page");
          return { Component: DetailPage.default };
        },
      },
    ],
  },
]);

export default router;
