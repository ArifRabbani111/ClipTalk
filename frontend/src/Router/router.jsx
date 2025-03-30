import { createBrowserRouter } from "react-router-dom";
import Home from "../home/Home";
import App from "../App";
import Login from "../login";
import SignUp from "../Signup";
import MovieList from "../home/MovieList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/movielist",
        element: <MovieList />,
      },
    ],
  },
]);

export default router;
