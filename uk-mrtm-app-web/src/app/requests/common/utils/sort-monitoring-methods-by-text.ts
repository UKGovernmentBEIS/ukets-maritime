export const sortMonitoringMethodsByText = (
  a: { key: string; value: { text: string; hint: string } },
  b: { key: string; value: { text: string; hint: string } },
) => {
  return a.value.text.localeCompare(b.value.text);
};
