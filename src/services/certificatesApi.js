const STORAGE_KEY = 'certificatesData';

export const getCertificatesData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing certificates data', e);
      return null;
    }
  }
  return null;
};

export const saveCertificatesData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving certificates data', e);
    return false;
  }
};
