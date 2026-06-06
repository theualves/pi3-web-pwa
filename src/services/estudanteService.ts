export interface Estudante {
  id: string;
  nome: string;
  cpf: string;
  periodo: string | number; // O backend devolve número, então ajustamos a tipagem
  horasRegistradas: number;
  status: "Ativo" | "Pendente" | "Reprovado" | string;
}

export async function buscarEstudantes(filtros?: { turmaId?: string }): Promise<Estudante[]> {
  try {
    // 1. Forçando o teste no servidor LOCAL
    let url = "http://localhost:3001/api/aluno-coordenador";

    console.log("👉 1. ID recebido:", filtros?.turmaId);

    // 2. Colocando a interrogação correta
    if (filtros?.turmaId) {
      url += `?turmaId=${filtros.turmaId}`;
    }

    console.log("👉 2. URL disparada:", url);

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Falha ao buscar os estudantes.");
    }

    const dadosDoBackend = await response.json();
    console.log("👉 3. Quantidade de alunos retornada:", dadosDoBackend.length);

    return dadosDoBackend.map((usuario: any) => ({
      id: usuario.id,
      nome: usuario.usuario?.nome || usuario.nome || "Sem Nome",
      cpf: usuario.cpf || "Sem CPF",
      periodo: usuario.periodo || "-",
      horasRegistradas: usuario.cargaExigida || 0,
      status: usuario.usuario?.status || "Ativo",
    }));

  } catch (error) {
    console.error("Erro no estudanteService:", error);
    return [];
  }
}