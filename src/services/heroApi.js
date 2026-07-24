const STORAGE_KEY = 'portfolio_hero_data';

export const getHeroData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse hero data from localStorage', e);
  }
  return null;
};

export const saveHeroData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('hero-data-updated'));
  } catch (e) {
    console.error('Failed to save hero data to localStorage', e);
  }
};
