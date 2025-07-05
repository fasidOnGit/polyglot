import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/auth"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { LoginPage } from "./pages/login"
import { SignupPage } from "./pages/signup"
import { TranslatePage } from "./pages/translate"
import { ChatPage } from "./pages/chat"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "./components/layout/RootLayout"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <RootLayout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected routes */}
              <Route
                path="/translate"
                element={
                  <ProtectedRoute>
                    <TranslatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to translate */}
              <Route path="/" element={<Navigate to="/translate" replace />} />
            </Routes>
          </RootLayout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
