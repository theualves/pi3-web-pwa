export const api = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 1. Pegamos os headers base
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`https://api-horas-complementares.onrender.com${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== "undefined" && !url.includes("/auth/login")) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  }

  return response;
};