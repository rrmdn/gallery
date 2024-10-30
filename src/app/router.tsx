import { createBrowserRouter } from "react-router-dom";
import PhotosHomePage from "./photos/home.page";
import PhotoDetailPage from "./photos/detail.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PhotosHomePage />,
  },
  {
    path: "/photos/:id",
    element: <PhotoDetailPage />,
  },
]);

export default router;
