// src/lib/api.js
export const api = async (url, options = {}) => {
  // Verifica se o código está rodando no navegador antes de acessar o localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  const response = await fetch(`https://api-horas-complementares.onrender.com${url}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  });

  // Só tenta redirecionar se estiver rodando no navegador e o status for 401
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado"); // Aproveite para limpar o objeto do usuário também
    window.location.href = "/login";
  }

  return response;
};
