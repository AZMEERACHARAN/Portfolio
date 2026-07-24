const STORAGE_KEY = 'projectsData';

export const getProjectsData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing projects data', e);
      return null;
    }
  }
  return null;
};

export const saveProjectsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving projects data', e);
    return false;
  }
};
