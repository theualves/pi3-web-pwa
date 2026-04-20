export interface Estudante {
  id: string;
  nome: string;
  cpf: string;
  periodo: string;
  horasRegistradas: number;
  status: "Ativo" | "Pendente" | "Reprovado";
}

export async function buscarEstudantes(): Promise<Estudante[]> {
  return [
    {
      id: "1",
      nome: "Ana Beatriz Sousa",
      cpf: "123.456.789-00",
      periodo: "2024.1",
      horasRegistradas: 120,
      status: "Ativo",
    },
    {
      id: "2",
      nome: "Carlos Eduardo Lima",
      cpf: "987.654.321-11",
      periodo: "2023.2",
      horasRegistradas: 45,
      status: "Pendente",
    },
  ];
}