import HomePage from '@/pages/homePage';

export default function HomeRoute({
  wardrobe,
  savedOutfits,
  weeklyPlan,
  navigateTo,
  isGuest,
  onSelectRecommendedOutfit,
  onSelectWeatherStyle,
}) {
  return (
    <HomePage
      wardrobe={wardrobe}
      savedOutfits={savedOutfits}
      weeklyPlan={weeklyPlan}
      navigateTo={navigateTo}
      isGuest={isGuest}
      onSelectRecommendedOutfit={onSelectRecommendedOutfit}
      onSelectWeatherStyle={onSelectWeatherStyle}
    />
  );
}
