const getUserKey = (email, type) => `closetry_${type}_${email}`;

export const loadUserData = (email) => {
  if (!email) return { wardrobe: null, outfits: [], weeklyPlan: {} };

  const rawWardrobe  = localStorage.getItem(getUserKey(email, 'wardrobe'));
  const rawOutfits   = localStorage.getItem(getUserKey(email, 'outfits'));
  const rawPlan      = localStorage.getItem(getUserKey(email, 'weeklyPlan'));

  return {
    wardrobe:    rawWardrobe  ? JSON.parse(rawWardrobe)  : null,  
    outfits:     rawOutfits   ? JSON.parse(rawOutfits)   : [],
    weeklyPlan:  rawPlan      ? JSON.parse(rawPlan)      : {},
  };
};

export const saveWardrobe = (email, wardrobe) => {
  if (!email) return;
  localStorage.setItem(getUserKey(email, 'wardrobe'), JSON.stringify(wardrobe));
};

export const saveOutfits = (email, outfits) => {
  if (!email) return;
  localStorage.setItem(getUserKey(email, 'outfits'), JSON.stringify(outfits));
};

export const saveWeeklyPlan = (email, plan) => {
  if (!email) return;
  localStorage.setItem(getUserKey(email, 'weeklyPlan'), JSON.stringify(plan));
};