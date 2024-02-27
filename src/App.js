import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./Components/Layout/Header"
import Signup from "./Components/User/Signup/Signup"
import Signin from "./Components/User/Signin/Signin"
import Dashboard from "./Components/Dashboard/Dashboard"
import PrivateComponent from "./Components/Utils/PrivateComponent"
import Home from "./Components/Shared/Home"
import ResetPassword from "./Components/User/ResetPassword/ResetPassword"
import ResetPasswordVerify from "./Components/User/ResetPasswordVerify/ResetPasswordVerify"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordVerify />} />
          <Route element={<PrivateComponent />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
