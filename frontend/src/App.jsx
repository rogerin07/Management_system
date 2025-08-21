import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./utils/Root";
import Login from "./pages/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Users from "./components/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes requireRole={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<h1>Summary of dashboard</h1>} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<h1>Products</h1>} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route
          path="/employee/dashboard"
          element={<h1>employee dashboard</h1>}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/unauthorized"
          element={
            <p className="font-bold text-3xl mt-20 ml-20">Unauthorized </p>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
