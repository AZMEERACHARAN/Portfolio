const STORAGE_KEY = 'experienceData';

export const getExperienceData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing experience data', e);
      return null;
    }
  }
  return null;
};

export const saveExperienceData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving experience data', e);
    return false;
  }
};
