// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import AdminPage from './Pages/AdminPage'

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<AdminPage />} />
    </Routes>
  )
}
