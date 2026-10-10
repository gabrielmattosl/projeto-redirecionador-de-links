# Projeto Encurtador de Links

Uma aplicação completa (Full-stack) para criação, gestão e redirecionamento de links encurtados, desenvolvida como parte da avaliação da pós-graduação. O sistema conta com uma API robusta e uma interface web reativa, totalmente conteinerizada com Docker.

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** com **Fastify**
- **TypeScript**
- **Drizzle ORM**
- **PostgreSQL**
- **Zod** para validação de dados
- **Swagger (@fastify/swagger)** para documentação nativa
- Testes automatizados com **Vitest**

### Frontend (Web)
- **React** (via Vite)
- **TypeScript**
- **Tailwind CSS** para estilização
- **React Router DOM** para navegação SPA
- **React Query (TanStack Query)** para gerenciamento de estado assíncrono e cache
- **React Hook Form** + **Zod** para formulários

### DevOps & Infraestrutura
- **Docker** e **Docker Compose**
- Imagens otimizadas (Nginx Alpine para o Frontend e Node slim para a API)

---

## 🛠 Pré-requisitos

Para rodar o projeto localmente, você precisa ter instalado:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/en/) (opcional, apenas se quiser rodar os serviços fora dos containers ou rodar os testes)

---

## ⚙️ Como executar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/gabrielmattosl/projeto-redirecionador-de-links.git
cd projeto-redirecionador-de-links
```

### 2. Configurar as Variáveis de Ambiente
O projeto é dividido em `server` e `web`. Você precisa criar os arquivos `.env` baseados nos exemplos fornecidos.

No terminal, execute os comandos:
```bash
cp server/.env.example server/.env
cp web/.env.example web/.env
```
*(Nota: O arquivo `server/.env` possui variáveis relativas ao Cloudflare R2 para a funcionalidade de exportação de CSV. Preencha-as com suas credenciais para testar a exportação).*

### 3. Subir os Containers
Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:
```bash
docker-compose up -d --build
```

O Docker fará o processo de build do Frontend e Backend, além de provisionar o banco de dados PostgreSQL. As **migrations** do banco de dados são executadas automaticamente na inicialização da API.

### 4. Acessar a aplicação
- **Frontend (Interface Web):** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** `http://localhost:3333`
- **Documentação da API (Swagger):** [http://localhost:3333/docs](http://localhost:3333/docs)

---

## 🧪 Testes Automatizados

O projeto possui uma suíte completa de testes de unidade e integração, cobrindo rotas, validações de segurança e regras de negócio.

Para rodar os testes da API:
```bash
cd server
npm install
npm run test
```

Para rodar os testes do Frontend:
```bash
cd web
npm install
npm run test
```

---

## 🔒 Segurança Aplicada
- Validações rígidas no backend e frontend para impedir criação de URLs maliciosas (esquemas `javascript:` e `data:`).
- Banco de dados protegido contra Injeção de SQL (usando Drizzle ORM nativo).
- Bloqueio de CSV Injection e restrição de stack traces em produção.
- Execução do backend em Docker com usuário não-root (`node`).
- Configuração de cabeçalhos básicos de segurança no Nginx (`X-Content-Type-Options`, `X-Frame-Options`, etc).
