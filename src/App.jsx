import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizzyLandingPage from './QuizzyLandingPage.jsx';
import SignInPage from './form/SignInPage.jsx';
import RegisterPage from './form/RegisterPage.jsx';
import DashboardPage from './DashBord/DashboardPage.jsx';
import CreateQuizPage from './DashBord/CreateQuizPage.jsx';
import EventsPage from './Event/EventsPage'; 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizzyLandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> 
        <Route path="/events" element={<EventsPage />} /> 
        <Route path="/create-quiz" element={<CreateQuizPage />} />       


      </Routes>
    </Router>
  );
}

export default App;