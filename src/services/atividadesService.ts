export interface Atividade {
  id: string;
  estudante: string;
  categoria: string;
  cargaHoraria: number;
  periodo: string;
  status: "Aprovado" | "Pendente" | "Recusado";
}

export async function buscarAtividadesRecentes(): Promise<Atividade[]> {
  return [
    {
      id: "1",
      estudante: "Ana Beatriz Sousa",
      categoria: "Cursos de Extensão",
      cargaHoraria: 40,
      periodo: "2024.1",
      status: "Aprovado",
    },
    {
      id: "2",
      estudante: "Carlos Eduardo Lima",
      categoria: "Participação em Eventos",
      cargaHoraria: 15,
      periodo: "2024.1",
      status: "Pendente",
    },
    {
      id: "3",
      estudante: "Mariana Alves",
      categoria: "Iniciação Científica",
      cargaHoraria: 120,
      periodo: "2023.2",
      status: "Aprovado",
    },
  ];
}