export const fetchCountryCodes = async () => {
  const result = await fetch("https://flagcdn.com/en/codes.json");
  return result;
};
