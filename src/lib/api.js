export const api = async (url, options = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(
    `https://api-horas-complementares.onrender.com${url}`,
    {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    },
  );

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  }

  return response;
};
