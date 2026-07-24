const STORAGE_KEY = 'aboutData';

export const getAboutData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing about data', e);
      return null;
    }
  }
  return null;
};

export const saveAboutData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving about data', e);
    return false;
  }
};
