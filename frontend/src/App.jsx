import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <nav>site</nav>
      <Outlet />
    </>
  );
}

export default App;
