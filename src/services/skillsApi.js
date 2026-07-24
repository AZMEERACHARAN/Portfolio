const STORAGE_KEY = 'skillsData';

export const getSkillsData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing skills data', e);
      return null;
    }
  }
  return null;
};

export const saveSkillsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving skills data', e);
    return false;
  }
};
