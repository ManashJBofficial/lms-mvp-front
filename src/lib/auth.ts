export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRole = () => {
  const user = getUser();
  return user?.role === "ADMIN" ? 2 : 3;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return getUser() && getToken();
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
