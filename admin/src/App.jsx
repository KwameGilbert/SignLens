import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import Lessons from './pages/lessons/Lessons'
import Quizzes from './pages/quizzes/Quizzes'
import Badges from './pages/badges/Badges'
import TranslationLogs from './pages/translations/TranslationLogs'
import ActivityLogs from './pages/logs/ActivityLogs'
import Settings from './pages/settings/Settings'
import { PageLayout } from './components/layout/PageLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<PageLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/translations" element={<TranslationLogs />} />
          <Route path="/logs" element={<ActivityLogs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
