import PlannerPage from '@/pages/plannerPage';

export default function PlannerRoute({
  wardrobe,
  weeklyPlan,
  setWeeklyPlan,
  navigateTo,
  isGuest,
}) {
  return (
    <PlannerPage
      wardrobe={wardrobe}
      weeklyPlan={weeklyPlan}
      setWeeklyPlan={setWeeklyPlan}
      navigateTo={navigateTo}
      isGuest={isGuest}
    />
  );
}
