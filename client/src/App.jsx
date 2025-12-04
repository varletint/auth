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

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
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
          <Route path='/product/:id' element={<ProductPage />} />
          <Route path='/seller/:id' element={<UserPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/add-product'
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* New Routes oks */}
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
              <ProtectedRoute>
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path='/edit-product/:id'
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path='*' element={<NotFound />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
