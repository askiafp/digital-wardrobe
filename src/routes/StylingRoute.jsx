import StylingPage from '@/pages/stylingPage';

export default function StylingRoute({
  wardrobe,
  selectedOutfit,
  setSelectedOutfit,
  savedOutfits,
  setSavedOutfits,
  activeFilter,
  setActiveFilter,
  setWeeklyPlan,
  navigateTo,
  isGuest,
  weatherFromHome,
  clearWeatherFromHome,
}) {
  return (
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
      isGuest={isGuest}
      weatherFromHome={weatherFromHome}
      clearWeatherFromHome={clearWeatherFromHome}
    />
  );
}
