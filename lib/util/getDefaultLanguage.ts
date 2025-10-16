export function getDefaultCountry() {
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || "en-US";
    const country = lang.split("-")[1]?.toLowerCase();
    return country || "us";
  }
  return "us";
}
