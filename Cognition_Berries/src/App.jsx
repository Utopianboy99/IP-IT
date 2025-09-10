import { BrowserRouter, Route, Router, Routes, Navigate } from "react-router-dom"
import SignUp from './pages/AuthPages/SignUp'
import Login from './pages/AuthPages/Login'
import HomePage from './pages/HomePage/HomePage'
import NotFound from './pages/NotFound/NotFound'
import UserDashboard from "./pages/Dashboard/User Dashboard/UserDashboard"
import LandingPage from "./pages/LandingPage/LandingPage"
import AboutUs from "./pages/AboutUs/AboutUs"
import Courses from "./pages/Courses/Courses"
import ComminityForum from "./pages/ComminityForum/ComminityForum"
import CartPage from "./pages/Cart/CartPage"
import ExtraMaterial from "./pages/ExtraMaterial/ExtraMaterial"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"
import { CartProvider } from "./Context/CartContext"
import OrdersSummary from "./pages/Orders-summary/Orders-summary"
import LiveSession from "./pages/LiveSession/LiveSession"
import SettingsPage from "./pages/SettingsPage/Settings"


const ProtectedRoutr = ({ children }) => {
  const auth = localStorage.getItem('auth')
  return auth ? children : <Navigate to='/login' />;
}


function App() {

  return (
    <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<AboutUs />} />
        <Route
          path="/home"
          element={
            <ProtectedRoutr>
              <HomePage />
            </ProtectedRoutr>
          }
        />
        <Route path='/courses' element={
          <ProtectedRoutr>
            <Courses />
          </ProtectedRoutr>
        } />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoutr>
              <UserDashboard />
            </ProtectedRoutr>
          }
        />
        <Route
          path='/CommunityForum'
          element={
            <ProtectedRoutr>
              <ComminityForum />
            </ProtectedRoutr>
          }
        />
        <Route path="/extra-material"
          element={
            <ProtectedRoutr>
              <ExtraMaterial />
            </ProtectedRoutr>
          } />
        <Route path="/cart"
          element={
            <ProtectedRoutr>
              <CartPage />
            </ProtectedRoutr>
          } />
        <Route path="/checkout"
          element={
            <ProtectedRoutr>
              <CheckoutPage />
            </ProtectedRoutr>
          } />
          <Route 
          path='order-success'
          element={
          <ProtectedRoutr>
            <OrdersSummary/>
          </ProtectedRoutr>
          }
          />
          <Route
          path='liveSession'
          element={
            <ProtectedRoutr>
              <LiveSession/>
            </ProtectedRoutr>
          } />
          <Route
          path='settings'
          element={
            <ProtectedRoutr>
              <SettingsPage />
            </ProtectedRoutr>
          }
          />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  )
}

export default App
