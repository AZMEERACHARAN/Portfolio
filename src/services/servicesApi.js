const STORAGE_KEY = 'servicesData';

export const getServicesData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveServicesData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
