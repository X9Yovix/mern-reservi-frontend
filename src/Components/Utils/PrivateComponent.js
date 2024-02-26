import { Navigate, Outlet } from "react-router-dom"

const PrivateComponent = () => {
  const isAuthenticated = localStorage.getItem("token")
  return isAuthenticated ? <Outlet /> : <Navigate to="home" />
}

export default PrivateComponent
