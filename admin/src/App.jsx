import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import UserDetail from './pages/users/UserDetail'
import Lessons from './pages/lessons/Lessons'
import LessonDetail from './pages/lessons/LessonDetail'
import Categories from './pages/categories/Categories'
import CategoryDetail from './pages/categories/CategoryDetail'
import Quizzes from './pages/quizzes/Quizzes'
import QuizDetail from './pages/quizzes/QuizDetail'
import Badges from './pages/badges/Badges'
import TranslationLogs from './pages/translations/TranslationLogs'
import ActivityLogs from './pages/logs/ActivityLogs'
import Settings from './pages/settings/Settings'
import Notifications from './pages/notifications/Notifications'
import Profile from './pages/profile/Profile'
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
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryDetail />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/translations" element={<TranslationLogs />} />
          <Route path="/logs" element={<ActivityLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
