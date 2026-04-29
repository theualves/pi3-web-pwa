export async function buscarDadosRelatorio() {
  return {
    totalCoordenadores: 52,
    novosUsuariosMes: 45,
    usuariosInativos: 12,


    graficoAtividades: [
      { nome: "Pesquisa", horas: 320 },
      { nome: "Extensão", horas: 450 },
      { nome: "Ensino", horas: 210 },
    ],
    
    graficoMeses: [
      { mes: "Jan", envios: 45 },
      { mes: "Fev", envios: 52 },
      { mes: "Mar", envios: 85 },
      { mes: "Abr", envios: 120 },
      { mes: "Mai", envios: 90 },
      { mes: "Jun", envios: 140 },
    ],
    
    graficoStatus: [
      { name: "Aprovados", value: 65, color: "#10b981" },
      { name: "Pendentes", value: 25, color: "#f59e0b" },
      { name: "Reprovados", value: 10, color: "#ef4444" },
    ]
  }
}