import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router'
import Root from './utilis/Root'
import Login from './pages/Login'
import ProtectedRoutes from './utilis/ProtectedRoutes'

 function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />}/>
        <Route path="/admin/dashboard" element={<ProtectedRoutes requireRole={["admin"]}><h1>admin dashboard</h1></ProtectedRoutes>}/>
        <Route path="/customer/dashboard" element={<h1>Customer dashboard</h1>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/unauthorized" element={<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized</p>}/>
      </Routes>
    </Router>
  );
}


export default App
