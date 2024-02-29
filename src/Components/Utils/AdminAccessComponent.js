import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const AdminAccessComponent = () => {
  const token = localStorage.getItem("token")

  if (token) {
    const decodedToken = jwtDecode(token)
    if (decodedToken && decodedToken.role === "admin") {
      return <Outlet />
    }
  }
  return <Navigate to="home" />
}

export default AdminAccessComponent
