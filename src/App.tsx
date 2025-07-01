import React, { useState } from 'react';
import Web3HeroSection from './components/Web3HeroSection';
import BalanceChecker from './components/BalanceChecker';

type Page = 'home' | 'balance-checker';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateToBalanceChecker = () => {
    setCurrentPage('balance-checker');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && (
        <Web3HeroSection onNavigateToChecker={navigateToBalanceChecker} />
      )}
      {currentPage === 'balance-checker' && (
        <BalanceChecker onBack={navigateToHome} />
      )}
    </div>
  );
}

export default App;