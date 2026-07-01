import AnalyticsPage from '@/pages/analyticsPage';

export default function AnalyticsRoute({ wardrobe, savedOutfits, isGuest }) {
  return (
    <AnalyticsPage
      wardrobe={wardrobe}
      savedOutfits={savedOutfits}
      isGuest={isGuest}
    />
  );
}
