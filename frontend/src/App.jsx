import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Adduser from './register'
import Home from './home'
import Login from './login'
import Profile from './profile'
import Admin from './admin'
import AddItems from './additem'
import Shop from './shop'

function App() {

  return (
    <>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Adduser/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home/:id' element={<Home/>}/>
      <Route path='/profile/:id' element={<Profile/>}/>
      <Route path='/admin/:id' element={<Admin/>}/>
      <Route path='/Additem' element={<AddItems/>}/>
      <Route path='/Shop' element={<Shop/>}/>
      


    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
