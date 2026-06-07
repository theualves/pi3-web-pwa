export const api = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 1. Pegamos os headers base
  const headers = { ...options.headers };

  // 2. Adicionamos o Token de segurança
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 3. A checagem inteligente:
  // Se for um FormData (tem arquivo), removemos o Content-Type para o navegador fazer o trabalho dele.
  // Se não for (é o seu Login, por exemplo), nós forçamos o application/json.
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`https://api-horas-complementares.onrender.com${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  }

  return response;
};