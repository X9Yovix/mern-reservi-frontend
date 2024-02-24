import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./Components/Layout/Header"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
