import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import "./assets/styles/app.scss"
import Header from "./components/Header"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Toaster, toast } from "react-hot-toast"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context, server } from "./main"
import Loader from "./components/Loader"


function App() {
  const { setUser,isAuthenticated,setIsAuthenticated, loading, setLoading, refresh } = useContext(Context)

  useEffect(() => {
    if(isAuthenticated){
      setLoading(true)
    axios.get(`${server}/users/me`, {
      withCredentials: true,
    }).then(res => {
      setLoading(false)

      setIsAuthenticated(true)
      setUser(res.data.user)
    }).catch((error) => {
      setLoading(false)
      setIsAuthenticated(false)
      setUser({})
      // console.log(error.response.data.message)
      toast.error("error.response.data.message")
    })
    }
  }, [refresh])

  return (

    <Router>
      <Header />

      <Routes>
        <Route path="/" element={loading ? <Loader /> : <Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

      </Routes>
      <Toaster />
    </Router>
  )
}

export default App

