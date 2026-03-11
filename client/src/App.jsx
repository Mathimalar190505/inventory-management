import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./utilis/Root";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utilis/ProtectedRoutes";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Users from "./components/Users";
import Products from "./components/Products";
import CustomerProducts from "./components/CustomerProducts.jsx";
import Orders from "./components/Orders.jsx";
import Profile from "./components/Profile.jsx";
import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/unauthorized"
          element={<p className="font-bold text-3xl mt-20 ml-20">Unauthorized</p>}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoutes requireRole={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<h1 className="text-3xl font-bold">Admin Summary</h1>} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="supplier" element={<Suppliers />} />
          <Route path="orders" element={<h1 className="text-3xl font-bold">Orders</h1>} />
          <Route path="users" element={<Users />} />
        </Route>

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoutes requireRole={["customer"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<CustomerProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
        </Route>

        <Route path="/admin/dashboard/logout" element={<Logout />} />
        <Route path="/customer/dashboard/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;