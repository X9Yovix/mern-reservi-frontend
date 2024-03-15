import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./Components/Layout/Header"
import Signup from "./Components/User/Signup/Signup"
import Signin from "./Components/User/Signin/Signin"
import PrivateComponent from "./Components/Utils/PrivateComponent"
import Home from "./Components/Shared/Home"
import ResetPassword from "./Components/User/ResetPassword/ResetPassword"
import ResetPasswordVerify from "./Components/User/ResetPasswordVerify/ResetPasswordVerify"
import AdminAccessComponent from "./Components/Utils/AdminAccessComponent"
import MeetingRooms from "./Components/Dashboard/MeetingRooms/MeetingRooms"
import Dashboard from "./Components/Dashboard/Dashboard"
import Reservations from "./Components/Dashboard/Reservations/Reservations"
import Materials from "./Components/Dashboard/Materials/Materials"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/*" element={<Home />} />

          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordVerify />} />

          <Route element={<PrivateComponent />}>
            <Route path="/clients" element={<h1>clients</h1>} />
          </Route>
          <Route path="/dashboard" element={<AdminAccessComponent />}>
            <Route path="materials" element={<Dashboard cmp={<Materials />} />} />
            <Route path="meeting-rooms" element={<Dashboard cmp={<MeetingRooms />} />} />
            <Route path="reservations" element={<Dashboard cmp={<Reservations />} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
