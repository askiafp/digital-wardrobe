import ProfilePage from '@/pages/profilePage';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProfileRoute({
  currentUser,
  onUpdateProfile,
  onLogout,
  isGuest,
  wardrobe,
  weeklyPlan,
}) {
  return (
    <ProfilePage
      currentUser={currentUser}
      setCurrentUser={onUpdateProfile}
      onLogout={onLogout}
      isGuest={isGuest}
      wardrobe={wardrobe}
      days={days}
      weeklyPlan={weeklyPlan}
    />
  );
}
