import { BrowserRouter, Route, Router, Routes, Navigate } from "react-router-dom"
import SignUp from './pages/AuthPages/SignUp'
import Login from './pages/AuthPages/Login'
import HomePage from './pages/HomePage/HomePage'
import NotFound from './pages/NotFound/NotFound'
import UserDashboard from "./pages/Dashboard/User Dashboard/UserDashboard"
import LandingPage from "./pages/LandingPage/LandingPage"




const ProtectedRoutr = ({ children }) => {
  const auth = localStorage.getItem('auth')
  return auth ? children : <Navigate to='/login' />;
}


function App() {

  return (

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoutr>
                <HomePage />
              </ProtectedRoutr>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoutr>
                <UserDashboard />
              </ProtectedRoutr>
            }
          />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
