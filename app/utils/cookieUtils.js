export function isThirdPartyCookieSupported() {
  try {
    document.cookie = "test=1; SameSite=None; Secure";
    const supported = document.cookie.includes("test=1");
    document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    return supported;
  } catch (e) {
    return false;
  }
}