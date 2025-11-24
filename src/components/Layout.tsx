import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <Link to="/home">
          <button>Home</button>
        </Link>

        <Link to="/post">
          <button>Post</button>
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}