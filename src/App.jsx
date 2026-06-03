import React, { useState } from 'react';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import WardrobePage from './pages/wardrobePage';
import StylingPage from './pages/stylingPage';
import PlannerPage from './pages/plannerPage';
import AnalyticsPage from './pages/analyticsPage';
import ProfilePage from './pages/profilePage';
import Header from './components/header';
import { colors, initialWardrobeData, analyticsData } from './constants';
import Footer from './pages/footer'; 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [wardrobe, setWardrobe] = useState(initialWardrobeData);
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  const [weeklyPlan, setWeeklyPlan] = useState({});

  React.useEffect(() => {
    localStorage.setItem('weeklyPlan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  const [activeFilter, setActiveFilter] = useState('All');

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={{ backgroundColor: colors.background }}
    >
      <Header 
        currentPage={currentPage}
        navigateTo={navigateTo}
        wardrobe={wardrobe}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <div className="pb-24 flex-grow">
        {currentPage === 'home' && (
          <HomePage 
            wardrobe={wardrobe}
            savedOutfits={savedOutfits}
            weeklyPlan={weeklyPlan}
            navigateTo={navigateTo}
          />
        )}
        
        {currentPage === 'wardrobe' && (
          <WardrobePage 
            wardrobe={wardrobe}
            selectedOutfit={selectedOutfit}
            setSelectedOutfit={setSelectedOutfit}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        )}
        
        {currentPage === 'analytics' && (
          <AnalyticsPage 
            wardrobe={wardrobe}
            savedOutfits={savedOutfits}
          />
        )}
        
        {currentPage === 'profile' && (
          <ProfilePage 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'styling' && (
          <StylingPage 
            wardrobe={wardrobe}
            selectedOutfit={selectedOutfit}
            setSelectedOutfit={setSelectedOutfit}
            savedOutfits={savedOutfits}
            setSavedOutfits={setSavedOutfits}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setWeeklyPlan={setWeeklyPlan}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === 'planner' && (
          <PlannerPage 
            wardrobe={wardrobe}
            weeklyPlan={weeklyPlan}
            setWeeklyPlan={setWeeklyPlan}
            navigateTo={navigateTo}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}