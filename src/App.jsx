import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizzyLandingPage from './QuizzyLandingPage.jsx';
import SignInPage from './form/SignInPage.jsx';
import RegisterPage from './form/RegisterPage.jsx';
import DashboardPage from './DashBord/DashboardPage.jsx';
import CreateQuizPage from './DashBord/CreateQuizPage.jsx';
import EventsPage from './Event/EventsPage.jsx';
import Students from './students/StudentsPage.jsx';
import Quizzes from './Quizzes/QuizzesPage.jsx';
import QuizDetailsPage from './Quizzes/details/QuizDetailsPage.jsx';
import QuizActivePage from './Quizzes/QuizActivePage.jsx';
import SettingsPage from './parrameter/SettingsPage.jsx';
import ProtectedRoute from './quizzyBackend/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<QuizzyLandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes (any logged-in user) --- */}
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <Quizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId"
          element={
            <ProtectedRoute>
              <QuizDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId/play"
          element={
            <ProtectedRoute>
              <QuizActivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* --- Teacher-Only Routes --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute >
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute >
              <Students />
            </ProtectedRoute>
          }
        />

        {/* --- Catch-all: redirect to home --- */}
        <Route path="*" element={<QuizzyLandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;