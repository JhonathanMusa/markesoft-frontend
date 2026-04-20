import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './modules/auth/LoginPage'
import ProductList from './modules/products/ProductList'
import UserList from './modules/users/UserList'
import ProviderList from './modules/providers/ProviderList'
import SaleList from './modules/sales/SaleList'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Navigate to="/products" replace />} />
                      <Route path="/products" element={
                        <ProtectedRoute module="products"><ProductList /></ProtectedRoute>
                      } />
                      <Route path="/users" element={
                        <ProtectedRoute module="users"><UserList /></ProtectedRoute>
                      } />
                      <Route path="/providers" element={
                        <ProtectedRoute module="providers"><ProviderList /></ProtectedRoute>
                      } />
                      <Route path="/sales" element={
                        <ProtectedRoute module="sales"><SaleList /></ProtectedRoute>
                      } />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
