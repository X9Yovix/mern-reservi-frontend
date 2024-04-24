import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ConfigProvider, theme } from "antd"
import Header from "./Components/Layout/Header"
import Signup from "./Components/User/Signup/Signup"
import Signin from "./Components/User/Signin/Signin"
import PrivateComponent from "./Components/Utils/PrivateComponent"
import Home from "./Components/User/Home/Home"
import ResetPassword from "./Components/User/ResetPassword/ResetPassword"
import ResetPasswordVerify from "./Components/User/ResetPasswordVerify/ResetPasswordVerify"
import AdminAccessComponent from "./Components/Utils/AdminAccessComponent"
import AddMeetingRoom from "./Components/Dashboard/MeetingRooms/AddMeetingRoom/AddMeetingRoom"
import ListMeetingRooms from "./Components/Dashboard/MeetingRooms/ListMeetingRooms/ListMeetingRooms"
import Dashboard from "./Components/Dashboard/Dashboard"
import Materials from "./Components/Dashboard/Materials/Materials"
import Categories from "./Components/Dashboard/Categories/Categories"
import RoomDetails from "./Components/User/RoomDetails/RoomDetails"
import PendingReservations from "./Components/Dashboard/Reservations/PendingReservations/PendingReservations"
import Reservations from "./Components/User/Reservations/Reservations"
import HomeDashboard from "./Components/Dashboard/Home/Home"
import NotFound from "./Components/Shared/NotFound/NotFound"
import UpdateMeetingRoom from "./Components/Dashboard/MeetingRooms/UpdateMeetingRoom/UpdateMeetingRoom"
import Archive from "./Components/Dashboard/Archive/Archive"
import HomePage from "./Components/Shared/Home/Home"
import "./App.css"

function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme") || "light")

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark"
    localStorage.setItem("theme", newTheme)
    setThemeMode(newTheme)
  }

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: themeMode === "dark" ? darkAlgorithm : defaultAlgorithm,
          token: {
            fontSize: 16
          }
        }}
      >
        <BrowserRouter>
          <Header theme={themeMode} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/*" element={<NotFound />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordVerify />} />

            <Route element={<PrivateComponent />}>
              <Route path="/rooms" element={<Home />} />
              <Route path="/rooms/details/:id" element={<RoomDetails />} />
              <Route path="/reservations" element={<Reservations />} />
            </Route>

            <Route path="/dashboard" element={<AdminAccessComponent />}>
              <Route path="" element={<Navigate to="/dashboard/home" />} />
              <Route path="home" element={<Dashboard cmp={<HomeDashboard />} />} />
              <Route path="materials" element={<Dashboard cmp={<Materials />} />} />
              <Route path="categories" element={<Dashboard cmp={<Categories />} />} />
              <Route path="meeting-rooms/add" element={<Dashboard cmp={<AddMeetingRoom />} />} />
              <Route path="meeting-rooms/list" element={<Dashboard cmp={<ListMeetingRooms />} />} />
              <Route path="meeting-rooms/update/:id" element={<Dashboard cmp={<UpdateMeetingRoom />} />} />
              <Route path="reservations" element={<Dashboard cmp={<PendingReservations />} />} />
              <Route path="archive" element={<Dashboard cmp={<Archive />} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </div>
  )
}

export default App
