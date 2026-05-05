# 📊 Sistema de Gerenciamento de Atividades Acadêmicas (PWA)

Este projeto é uma aplicação web desenvolvida como um **Progressive Web App (PWA)** utilizando **Next.js com App Router**.

O sistema tem como objetivo gerenciar atividades acadêmicas, permitindo a visualização de dados, organização de informações e geração de relatórios através de uma interface moderna e responsiva.

---

## 🚀 Funcionalidades

* 📈 Dashboard com visualização de dados
* 👨‍🎓 Gerenciamento de alunos
* 📝 Controle de atividades acadêmicas
* 📊 Relatórios integrados com backend
* 🔐 Separação de rotas públicas e privadas (login/painel)
* 📱 Interface responsiva
* ⚡ Instalação como aplicativo (PWA)

---

## 🛠️ Tecnologias Utilizadas

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS *(utilizado na estilização)*
* ShadCN UI *(biblioteca de componentes)*
* PWA (Progressive Web App)

---

## 📁 Estrutura do Projeto

```bash
api3-web-pwa/
│
├── app/                          # Rotas e páginas (App Router)
│   ├── layout.tsx                # Layout global (HTML base)
│   │
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   └── login/
│   │       └── page.tsx          # /login
│   │
│   ├── (painel)/                 # Grupo de rotas do sistema (privadas)
│   │   ├── layout.tsx            # Layout compartilhado (Header + Sidebar)
│   │   │
│   │   ├── aluno/
│   │   │   └── page.tsx          # /aluno
│   │   │
│   │   └── coordenador/
│   │       └── page.tsx          # /coordenador
│
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes do ShadCN
│   ├── Header.tsx                # Cabeçalho global
│   ├── KpiCard.tsx               # Card de indicadores (KPIs)
│   └── ...
│
├── services/                     # Comunicação com backend (API)
│   ├── relatorioService.ts       # Requisições de relatórios
│   ├── atividadeService.ts       # Requisições de atividades
│   └── ...
│
├── public/                       # Arquivos estáticos
│   └── logo.svg
│
├── lib/ ou utils/                # Funções auxiliares
│   └── utils.ts
```

---

## 🧠 Arquitetura do Projeto

O projeto utiliza o conceito de **Route Groups do Next.js**, onde:

* `(auth)` → rotas públicas (ex: login)
* `(painel)` → rotas internas do sistema
* O layout dentro de `(painel)` permite reaproveitar elementos como:

  * Header
  * Sidebar

👉 Isso melhora organização e reutilização de código.

---

## 🔌 Integração com Backend

A pasta `services/` funciona como uma camada de abstração para comunicação com a API.

Exemplo:

* `relatorioService.ts` → busca dados de relatórios
* `atividadeService.ts` → operações com atividades

👉 Esses arquivos fazem requisições HTTP para o backend (API REST).

---

## ▶️ Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

---

### 2. Acessar a pasta

```bash
cd api3-web-pwa
```

---

### 3. Instalar dependências

```bash
npm install
```

---

### 4. Rodar o projeto

```bash
npm run dev
```

---

### 5. Acessar no navegador

```
http://localhost:3000
```

---

## 📱 Sobre o PWA

A aplicação pode ser instalada como um app no dispositivo.

Benefícios:

* Acesso direto pela tela inicial
* Melhor experiência mobile
* Possível suporte offline (dependendo da configuração)

---

## ⚠️ Observações

* Este projeto é o **frontend**, depende de um backend para funcionar completamente
* As rotas e dados são carregados via API
* Certifique-se de configurar corretamente as URLs nos `services`

---

## 👩‍💻 Autoria

Projeto desenvolvido para fins acadêmicos.

---

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
