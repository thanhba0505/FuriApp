const checkCookieExists = (cookieName) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(cookieName + "="));
  return cookieValue !== undefined;
};

export default checkCookieExists;
