const STORAGE_KEY = 'websiteSettings';

export const getSettingsData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveSettingsData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
