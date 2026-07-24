const STORAGE_KEY = 'achievementsData';

export const getAchievementsData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveAchievementsData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
