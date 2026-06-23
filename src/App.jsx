import React, { useState } from 'react';
import QuizzyLandingPage from './QuizzyLandingPage.jsx';
import SignInPage from './form/SignInPage.jsx';
import RegisterPage from './form/RegisterPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'signin' | 'register'

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'signin') {
    return <SignInPage navigateTo={navigateTo} />;
  }
  if (currentPage === 'register') {
    return <RegisterPage navigateTo={navigateTo} />;
  }

  return <QuizzyLandingPage navigateTo={navigateTo} />;
}

export default App;