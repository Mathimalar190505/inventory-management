import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./utilis/Root";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utilis/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>

        {/* Root redirect controller */}
        <Route path="/" element={<Root />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/unauthorized"
          element={
            <p className="font-bold text-3xl mt-20 ml-20">
              Unauthorized
            </p>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoutes requireRole={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route
            index
            element={<h1 className="text-3xl font-bold">Admin Summary</h1>}
          />
          <Route
            path="categories"
            element={<h1 className="text-3xl font-bold">Admin Categories</h1>}/>
            <Route
            path="products"
            element={<h1 className="text-3xl font-bold">Admin Products</h1>}/>
            <Route
            path="supplier"
            element={<h1 className="text-3xl font-bold">supplier</h1>}/>
            <Route
            path="orders"
            element={<h1 className="text-3xl font-bold">orders</h1>}/>
            <Route
            path="users"
            element={<h1 className="text-3xl font-bold">Admin Users</h1>}/>
            
        </Route>

        {/* Customer Dashboard */}
        <Route
          path="/customer/dashboard"
          element={<h1>Customer dashboard</h1>}
        />

      </Routes>
    </Router>
  );
}

export default App;
