import HomeRoute from './HomeRoute';
import WardrobeRoute from './WardrobeRoute';
import StylingRoute from './StylingRoute';
import PlannerRoute from './PlannerRoute';
import AnalyticsRoute from './AnalyticsRoute';
import ProfileRoute from './ProfileRoute';

export default function AppRoutes({
  currentPage,
  wardrobe,
  selectedOutfit,
  setSelectedOutfit,
  activeFilter,
  setActiveFilter,
  savedOutfits,
  setSavedOutfits,
  weeklyPlan,
  setWeeklyPlan,
  navigateTo,
  isGuest,
  currentUser,
  onUpdateProfile,
  onLogout,
  onAddItem,
  onDeleteItem,
  onEditItem,
  onSelectRecommendedOutfit,
  selectedWeatherStyle,
  setSelectedWeatherStyle,
}) {
  const routes = {
    home: (
      <HomeRoute
        wardrobe={wardrobe}
        savedOutfits={savedOutfits}
        weeklyPlan={weeklyPlan}
        navigateTo={navigateTo}
        isGuest={isGuest}
        onSelectRecommendedOutfit={onSelectRecommendedOutfit}
        onSelectWeatherStyle={setSelectedWeatherStyle}
      />
    ),
    wardrobe: (
      <WardrobeRoute
        wardrobe={wardrobe}
        selectedOutfit={selectedOutfit}
        setSelectedOutfit={setSelectedOutfit}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onAddItem={onAddItem}
        onDeleteItem={onDeleteItem}
        onEditItem={onEditItem}
        isGuest={isGuest}
      />
    ),
    analytics: (
      <AnalyticsRoute wardrobe={wardrobe} savedOutfits={savedOutfits} isGuest={isGuest} />
    ),
    profile: (
      <ProfileRoute
        currentUser={currentUser}
        onUpdateProfile={onUpdateProfile}
        onLogout={onLogout}
        isGuest={isGuest}
        wardrobe={wardrobe}
        weeklyPlan={weeklyPlan}
      />
    ),
    styling: (
      <StylingRoute
        wardrobe={wardrobe}
        selectedOutfit={selectedOutfit}
        setSelectedOutfit={setSelectedOutfit}
        savedOutfits={savedOutfits}
        setSavedOutfits={setSavedOutfits}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        setWeeklyPlan={setWeeklyPlan}
        navigateTo={navigateTo}
        isGuest={isGuest}
        weatherFromHome={selectedWeatherStyle}
        clearWeatherFromHome={() => setSelectedWeatherStyle(null)}
      />
    ),
    planner: (
      <PlannerRoute
        wardrobe={wardrobe}
        weeklyPlan={weeklyPlan}
        setWeeklyPlan={setWeeklyPlan}
        navigateTo={navigateTo}
        isGuest={isGuest}
      />
    ),
  };

  return routes[currentPage] || routes.home;
}
