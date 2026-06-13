import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'


const Login = () => <div className="p-8 text-2xl font-bold text-primary">Login Page</div>
const Register = () => <div className="p-8 text-2xl font-bold">Register Page</div>
const Dashboard = () => <div className="p-8 text-2xl font-bold">Dashboard</div>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
