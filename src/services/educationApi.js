const STORAGE_KEY = 'educationData';

export const getEducationData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing education data', e);
      return null;
    }
  }
  return null;
};

export const saveEducationData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving education data', e);
    return false;
  }
};
