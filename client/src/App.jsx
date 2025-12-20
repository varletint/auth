import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Profile from "./Pages/Profile";
import Edit from "./Pages/Edit";
import EditProfile from "./Pages/EditProfile";
import ProductPage from "./Pages/ProductPage";
import UserPage from "./Pages/UserPage";
import ForgotPassword from "./Pages/ForgotPassword";
import AddProduct from "./Pages/AddProduct";
import ProtectedRoute from "./Components/ProtectedRoute";
import SellerProtectedRoute from "./Components/SellerProtectedRoute";
import BizProtectedRoute from "./Components/BizProtectedRoute";
import File from "./Pages/File";

// New Pages
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import Dashboard from "./Pages/Dashboard";
import Search from "./Pages/Search";
import Categories from "./Pages/Categories";
import Wishlist from "./Pages/Wishlist";
import Settings from "./Pages/Settings";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import NotFound from "./Pages/NotFound";
import MyProducts from "./Pages/MyProducts";
import EditProduct from "./Pages/EditProduct";
import MyOrders from "./Pages/MyOrders";
import SalesHistory from "./Pages/SalesHistory";
import PurchaseHistory from "./Pages/PurchaseHistory";
import BecomeSeller from "./Pages/BecomeSeller";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import ScrollToUp from "./Components/ScrollToUp";
import BizDashboard from "./Pages/BizDashboard";

// Business Management Pages
import Inventory from "./Pages/Inventory";
import ItemPage from "./Pages/ItemPage";
import Sales from "./Pages/Sales";
import BizSalesHistory from "./Pages/BizSalesHistory";
import Expenses from "./Pages/Expenses";
import Customers from "./Pages/Customers";
import StaffManagement from "./Pages/StaffManagement";
import StaffLogin from "./Pages/StaffLogin";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToUp />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/file' element={<File />} />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/edit-profile'
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          {/* SEO-friendly product route: /:seller/:slug */}
          <Route path='/:seller/:slug' element={<ProductPage />} />
          {/* ID-based product route (fallback) */}
          <Route path='/product/:id' element={<ProductPage />} />
          <Route path='/seller/:id' element={<UserPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/add-product'
            element={
              <SellerProtectedRoute>
                <AddProduct />
              </SellerProtectedRoute>
            }
          />

          <Route path='/cart' element={<Cart />} />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path='/search' element={<Search />} />
          <Route path='/categories' element={<Categories />} />
          <Route
            path='/wishlist'
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route
            path='/my-products'
            element={
              <SellerProtectedRoute>
                <MyProducts />
              </SellerProtectedRoute>
            }
          />
          <Route
            path='/edit-product/:id'
            element={
              <SellerProtectedRoute>
                <EditProduct />
              </SellerProtectedRoute>
            }
          />
          <Route
            path='/my-orders'
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/sales-history'
            element={
              <ProtectedRoute>
                <SalesHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path='/purchase-history'
            element={
              <ProtectedRoute>
                <PurchaseHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path='/become-seller'
            element={
              <ProtectedRoute>
                <BecomeSeller />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Business Management Routes */}
          <Route
            path='/biz-dashboard'
            element={
              <BizProtectedRoute>
                <BizDashboard />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/inventory'
            element={
              <BizProtectedRoute>
                <Inventory />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/inventory/:id'
            element={
              <BizProtectedRoute>
                <ItemPage />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/sales'
            element={
              <BizProtectedRoute>
                <Sales />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/biz/sales-history'
            element={
              <BizProtectedRoute>
                <BizSalesHistory />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/expenses'
            element={
              <BizProtectedRoute>
                <Expenses />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/customers'
            element={
              <BizProtectedRoute>
                <Customers />
              </BizProtectedRoute>
            }
          />
          <Route
            path='/staff-management'
            element={
              <BizProtectedRoute>
                <StaffManagement />
              </BizProtectedRoute>
            }
          />
          <Route path='/staff-login' element={<StaffLogin />} />

          {/* 404 Fallback */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
