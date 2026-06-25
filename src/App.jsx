import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizzyLandingPage from './QuizzyLandingPage.jsx';
import SignInPage from './form/SignInPage.jsx';
import RegisterPage from './form/RegisterPage.jsx';
import DashboardPage from './DashBord/DashboardPage.jsx';
import CreateQuizPage from './DashBord/CreateQuizPage.jsx';
import EventsPage from './Event/EventsPage'; 
import ProtectedRoute from './quizzyBackend/ProtectedRoute';
import Students from './students/StudentsPage.jsx'; 


function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<QuizzyLandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes (Only accessible by authenticated Teachers) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute >
              <DashboardPage />
            </ProtectedRoute>
          } 
        /> 
        
        <Route 
          path="/events" 
          element={
            <ProtectedRoute >
              <EventsPage />
            </ProtectedRoute>
          } 
        /> 
        <Route 
          path="/Students" 
          element={
            <ProtectedRoute >
              <Students />
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
      </Routes>
    </Router>
  );
}

export default App;