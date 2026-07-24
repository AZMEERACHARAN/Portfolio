const STORAGE_KEY = 'testimonialsData';

export const getTestimonialsData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveTestimonialsData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
