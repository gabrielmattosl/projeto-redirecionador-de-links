# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (FSD)

## 1. Visão Geral

O sistema é o **Redirecionador de Links**. Seu objetivo principal é fornecer uma plataforma web privativa e de alta performance para criar, gerenciar e redirecionar URLs encurtadas, contabilizando acessos totais em tempo real e gerando relatórios de desempenho exportáveis em formato CSV diretamente para armazenamento em nuvem (Cloudflare R2).

O sistema opera com dois papéis de usuário:
1. **Administrador (Único):** O criador, desenvolvedor e único operador da aplicação em contexto local privativo.
2. **Visitante:** Qualquer usuário ou navegador que acesse um link encurtado compartilhado através da rota dinâmica de redirecionamento.

O funcionamento central engloba: encurtar URLs originais utilizando apelidos manuais exclusivos, auto-correção de esquema para `https://`, listagem com rolagem infinita ordenada estritamente por antiguidade (`created_at` ASC), cópia rápida para a área de transferência com feedback flutuante (*toast*), exclusão definitiva (hard delete) precedida de confirmação em modal, redirecionamento dinâmico SPA de baixa latência com contagem atômica de acessos no backend via API nativa do navegador (`window.location.href`), e geração automatizada de relatórios CSV completos em memória enviados à CDN Cloudflare R2 com identificador de arquivo aleatório e único.

## 2. Documentos do Projeto para Implementação

Os documentos mandatórios e suficientes para orientar a implementação do sistema pela IA codificadora são:

* `docs/FSD.md` (Este documento, que consolida todas as especificações funcionais, contratos de API e regras de arquitetura)
* `docs/DESIGN.md` (Tokens visuais, componentes e padrões de interface)

Este FSD é rigorosamente autossuficiente e consolida no próprio texto todas as decisões técnicas e funcionais necessárias para a implementação completa, sem exigir consultas a documentos externos ou conversas prévias.

## 3. Stack Definida

A stack de desenvolvimento homologada é composta pelas seguintes tecnologias e padrões:

* **Linguagem Principal:** TypeScript aplicado de forma estrita em 100% da base (`server` e `web`).
* **Backend (`server/`):**
  * Fastify (framework HTTP de alta performance);
  * Drizzle ORM (gerenciamento relacional do banco de dados);
  * Zod (validação estrita de schemas e ambiente);
  * `@fastify/cors` (segurança e controle de origens HTTP);
  * `@aws-sdk/client-s3` (comunicação com a API S3-compatível da Cloudflare R2);
  * Vitest (suíte de testes automatizados e integração sob TDD);
  * `@fastify/swagger` e `@fastify/swagger-ui` (documentação interativa nativa das rotas da API).
* **Frontend (`web/`):**
  * React (SPA sem frameworks de renderização no servidor/SSR);
  * Vite (ferramenta de build e servidor de desenvolvimento);
  * React Router DOM (roteamento SPA nas rotas `/`, `/:url-encurtada` e `*`);
  * TailwindCSS (estilização utilitária e consumo dos Design Tokens);
  * React Query / TanStack Query (gerenciamento de cache assíncrono e rolagem infinita via `useInfiniteQuery`);
  * React Hook Form (gerenciamento de formulários);
  * Zod e `@hookform/resolvers/zod` (validação e tipagem de formulários);
  * shadcn/ui (componentes de interface baseados em Radix UI);
  * `@phosphor-icons/react` (biblioteca obrigatória de ícones Phosphor Icons);
  * Vitest (testes de componentes e hooks).
* **Banco de Dados:** PostgreSQL (versão 15+).
* **Infraestrutura e DevOps:** Docker. O backend possuirá obrigatoriamente seu próprio `Dockerfile` para conteinerização da API; a orquestração do ambiente local ocorrerá via `docker-compose.yml` na raiz unindo PostgreSQL, API e Frontend.
* **Metodologias e Padrões de Engenharia:**
  * **DDD Simplificado:** Organização modular orientada a domínios/funcionalidades, encapsulando controllers, services, schemas Zod e rotas dentro de `server/src/app/links/`.
  * **TDD (Test-Driven Development):** Escrita e validação prévia de testes unitários e de integração com Vitest antes da implementação definitiva das regras de negócio.
  * **SDD (Schema-Driven Development):** Validação estrita e tipagem consistente de ponta a ponta com Zod, sincronizada aos schemas do Drizzle ORM.

## 4. Ambientes do Projeto

* **Desenvolvimento Local:** Totalmente containerizado via Docker e orquestrado por arquivo `docker-compose.yml` na raiz do repositório, integrando os serviços da API (Fastify), Frontend (Vite) e banco de dados relacional (PostgreSQL). O backend possui seu próprio `server/Dockerfile`.
* **Testes e Homologação:** A validação e a execução dos testes TDD com Vitest ocorrem localmente no ambiente de desenvolvimento antes de qualquer publicação ou merge.
* **Produção:** Estruturado para fins de demonstração acadêmica e portfólio utilizando camadas gratuitas (*free tier*), preservando a separação física entre a API backend e os ativos estáticos do frontend.

## 5. Arquitetura do Sistema e Estrutura de Diretórios

O repositório adota **divisão estrita e compulsória em duas subpastas na raiz**: `web` (Frontend cliente) e `server` (Backend, banco de dados e infraestrutura DevOps). É terminantemente proibido criar código de aplicação fora dessa árvore.

No backend, a arquitetura modular orientada a domínios (DDD Simplificado) concentra a lógica de negócio, rotas, schemas e controllers em módulos autocontidos (ex: `server/src/app/links/`), eliminando camadas globais genéricas e garantindo alto isolamento funcional.

A estrutura de diretórios do projeto deverá seguir rigorosamente o diagrama abaixo:

```text
[Diretório do Projeto - Repositório]
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts        # Módulo centralizado de validação do .env com Zod
│   │   ├── app/
│   │   │   └── links/        # Módulo DDD (controllers, schemas, services, rotas)
│   │   └── index.ts          # Ponto de entrada do servidor (Fastify)
│   ├── database/
│   │   ├── migrations/       # Migrations individuais e versionadas
│   │   └── connection.ts     # Configuração do PostgreSQL + Drizzle
│   ├── logs/                 # Arquivos físicos de log de contingência (erros.log)
│   ├── .env                  # Variáveis de ambiente locais (ignorado no git)
│   ├── .env.example          # Obrigatório: variáveis de ambiente de exemplo
│   ├── Dockerfile            # Obrigatório: gera a imagem de execução da API
│   ├── package.json          # Deve conter obrigatoriamente o script "db:migrate"
│   └── tsconfig.json
├── web/
│   ├── src/
│   │   ├── components/       # Componentes shadcn/ui e elementos visuais genéricos
│   │   ├── pages/            # Telas da aplicação via React Router DOM
│   │   └── hooks/            # Hooks customizados e integração React Query
│   ├── .env                  # Variáveis de ambiente locais (ignorado no git)
│   ├── .env.example          # Obrigatório: variáveis de ambiente de exemplo
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── docker-compose.yml        # Orquestração local do banco PostgreSQL e serviços
```

* Os diretórios internos do backend nunca devem ser expostos diretamente. As rotas HTTP são restritas e protegidas através da liberação de origens pelo `@fastify/cors`.
* Credenciais sensíveis (chaves S3/R2 e string de conexão do banco) devem residir unicamente em variáveis de ambiente (`.env`), validadas no boot pelo `server/src/config/env.ts` com encerramento forçado do processo (`process.exit(1)`) em caso de falha.

## 6. Escopo Funcional da Primeira Versão

As seguintes funcionalidades compõem o escopo aprovado da primeira versão (v1):

1. **Criação de link com apelido manual:** Converte uma URL original em uma URL curta utilizando um apelido obrigatório de 3 a 50 caracteres (letras, números e hífens).
2. **Validação de formatação e unicidade:** O frontend e o backend validam a formatação do apelido via Zod. Caso contenha caracteres inválidos ou o apelido já exista no banco, a submissão é bloqueada e um aviso de erro é exibido sob o input com a cor de perigo (`#B12C4D`).
3. **Auto-correção de protocolo:** Se o usuário submeter uma URL original sem o prefixo `http://` ou `https://`, o sistema insere silenciosamente `https://` antes de validar e persistir.
4. **Cópia rápida de link:** Botão dedicado em cada card da lista que concatena `VITE_FRONTEND_URL` com `short_url`, copia a string completa via Clipboard API nativa e dispara um aviso flutuante temporário (*toast*) com o texto "Copiado".
5. **Exclusão de link:** Remoção física e definitiva do registro no banco de dados (hard delete), obrigatoriamente precedida de uma janela modal de confirmação.
6. **Listagem com rolagem infinita:** Carregamento progressivo de links na página principal (`/`) através de paginação baseada em cursor (`created_at`). A lista é ordenada do mais antigo para o mais recente (`created_at` ASC), de modo que novos registros aparecem sempre no final da lista.
7. **Redirecionamento dinâmico SPA (`/:url-encurtada`):** Rota do React Router DOM que intercepta o parâmetro dinâmico da URL curta, exibe tela de carregamento com *spinner* global, faz requisição assíncrona ao backend para somar +1 clique e obter o destino original, redirecionando o visitante via `window.location.href`.
8. **Página de Erro 404 (Wildcard `*`):** Renderizada automaticamente quando o visitante acessa uma rota inexistente, um link curto não cadastrado ou um registro que foi previamente excluído.
9. **Exportação de relatório CSV para CDN:** Botão na interface que aciona o backend para compilar em memória 100% dos links da base (sem filtros), gerar um nome aleatório e único para o arquivo, enviar para a Cloudflare R2 via `@aws-sdk/client-s3` e exibir modal perguntando se o usuário deseja realizar o download imediato.
10. **Tratamento de Discrepância de Design:** A ação "Download QR" mencionada no `DESIGN.md` (linha 203) está **estritamente fora de escopo** da v1. As únicas ações presentes nos cards de links são Cópia e Exclusão.

## 7. Fora de Escopo

Os seguintes recursos **não fazem parte** da primeira versão do sistema e não devem ser implementados:

* **Busca e pesquisa textual de links:** Não haverá barra de pesquisa, campos de filtro textual ou busca dinâmica por apelido/URL.
* **Edição de links:** Não será permitido editar apelidos ou URLs de registros salvos. Para corrigir, o link deve ser excluído e recriado.
* **Histórico detalhado de cliques:** O sistema não registrará data/hora individual, endereço IP, tipo de dispositivo ou geolocalização dos cliques.
* **Exclusão automática de relatórios na nuvem:** Os arquivos CSV enviados à Cloudflare R2 não possuirão rotinas de expiração ou limpeza automática.
* **Telas de autenticação, login e recuperação de senha:** A aplicação operará em contexto local e privativo, dispensando formulários de login ou controle formal de sessão.
* **Gráficos analíticos e dashboards complexos:** A interface não fornecerá gráficos temporais, curvas de cliques ou painéis estatísticos.
* **Upload manual de arquivos pelo usuário:** Não haverá campos de envio de arquivos na interface; uploads para a CDN são feitos exclusivamente pelo backend de forma automatizada na exportação.
* **Soft Delete:** Não existirá exclusão lógica (campo `deleted_at`); registros excluídos são expurgados fisicamente do banco de dados.
* **Geração ou Download de QR Code:** O recurso de QR Code citado no `DESIGN.md` foi desconsiderado e está formalmente fora de escopo.

## 8. Perfis de Usuário e Permissões

O sistema opera com 2 perfis de usuário:

| Perfil | Descrição | Principais Ações | Permissões Básicas |
| :--- | :--- | :--- | :--- |
| **Administrador (Único)** | Criador, dono e único operador da aplicação em contexto local privativo. | Cadastrar links com apelidos personalizados, visualizar listagem infinita, copiar URLs curtas, excluir links definitivamente e exportar relatórios CSV para a CDN. | Acesso irrestrito a todas as operações na rota raiz `/` e aos endpoints administrativos da API. Não pode editar links criados nem realizar buscas textuais. |
| **Visitante** | Qualquer usuário ou navegador que acesse um link encurtado compartilhado. | Acessar links encurtados pela rota dinâmica. | Acesso restrito à rota SPA dinâmica `/:url-encurtada` para redirecionamento imediato e visualização da página 404 em caso de erro. |

### Matriz de Permissões e Restrições

| Funcionalidade / Operação | Administrador (Único) | Visitante |
| :--- | :---: | :---: |
| Acessar rota principal (`/`) e formulário de criação | **Permitido** | Bloqueado |
| Criar link encurtado (`POST /links`) | **Permitido** | Bloqueado |
| Listar links com rolagem infinita (`GET /links`) | **Permitido** | Bloqueado |
| Copiar link encurtado com feedback via Toast | **Permitido** | Bloqueado |
| Excluir link definitivamente (`DELETE /links/:short_url`) | **Permitido** | Bloqueado |
| Exportar relatório CSV para CDN (`POST /links/export`) | **Permitido** | Bloqueado |
| Acessar rota de redirecionamento (`/:url-encurtada`) | **Permitido** | **Permitido** |
| Incrementar contador e redirecionar (`PATCH /links/:short_url/increment`) | **Permitido** | **Permitido** |
| Visualizar tela de Erro 404 para links inválidos | **Permitido** | **Permitido** |
| Editar registros de links existentes | **Proibido** | **Proibido** |
| Realizar busca textual ou filtros de listagem | **Proibido** | **Proibido** |
| Realizar upload manual de arquivos na interface | **Proibido** | **Proibido** |

## 9. Recursos Estruturais do Sistema

* **Exportação para CDN (Cloudflare R2):** Geração do CSV em memória no backend Fastify e envio direto utilizando a biblioteca oficial `@aws-sdk/client-s3`.
* **Log de Contingência Físico:** Erros de infraestrutura, falhas de conexão com o banco e exceções do SDK S3 são registrados no arquivo físico `server/logs/erros.log`.
* **Configurações Globais com Zod:** Validação estrita das variáveis de ambiente no boot (`server/src/config/env.ts`), abortando a execução (`process.exit(1)`) caso falte qualquer chave obrigatória.
* **Auditoria Simples:** Armazenamento da data e hora de criação do registro (`created_at`) via relógio do banco de dados (`now()`).

## 10. Entidades do Sistema

O sistema possui uma entidade central de negócio:

### Entidade: `Link`
* **Finalidade:** Armazenar os parâmetros de roteamento de cada link encurtado e contabilizar o engajamento acumulado de cliques.
* **Atributos:**
  * `id` (UUID): Identificador primário único gerado aleatoriamente pelo banco de dados.
  * `original_url` (Text): URL de destino final para onde o visitante é redirecionado.
  * `short_url` (Varchar 50): Apelido encurtado único globalmente, formado por 3 a 50 caracteres alfanuméricos e hífens. Utilizado como chave de roteamento na API.
  * `clicks` (Integer): Quantidade total acumulada de redirecionamentos bem-sucedidos. Inicializado em 0.
  * `created_at` (Timestamp with time zone): Data e hora exata da criação do registro, utilizada na ordenação cronológica e relatórios.
* **Regras de Negócio:**
  * Apelido obrigatório, único globalmente e imutável.
  * URL original obrigatória e normalizada com protocolo `https://`.
  * Ausência de soft delete (exclusão física definitiva).
  * Sem suporte a edição.

## 11. Modelo de Dados Proposto e Migrations

A modelagem de dados no PostgreSQL gerenciada pelo Drizzle ORM é apresentada abaixo em sintaxe SQL explícita:

```sql
-- Tabela de controle de versionamento das migrations gerenciada pelo Drizzle Kit
CREATE TABLE IF NOT EXISTS "drizzle_migrations" (
  "id" SERIAL PRIMARY KEY,
  "hash" text NOT NULL,
  "created_at" bigint
);

-- Tabela principal de links encurtados
CREATE TABLE IF NOT EXISTS "links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "original_url" text NOT NULL,
  "short_url" varchar(50) NOT NULL UNIQUE,
  "clicks" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Índice de otimização de performance para ordenação cronológica e paginação por cursor
CREATE INDEX IF NOT EXISTS "links_created_at_idx" ON "links" ("created_at" ASC);
```

### Estratégia de Migrations Individuais
* O gerenciamento de schema ocorrerá exclusivamente através de **migrations individuais, incrementais e versionadas cronologicamente** armazenadas no diretório `server/database/migrations/`.
* É terminantemente proibido o uso de arquivos monolíticos de banco de dados.
* O arquivo `server/package.json` deve conter compulsoriamente o script `"db:migrate"`, que invoca o `drizzle-kit` para aplicar as migrations via CLI.

## 12. Módulos, Telas e Padrões Visuais

A interface do usuário é construída como uma SPA com **React Router DOM**, contendo exatamente as seguintes 3 rotas:

```text
/                  -> Página Principal (Formulário + Listagem Infinita)
/:url-encurtada    -> Interceptador de Redirecionamento Dinâmico
*                  -> Página de Erro 404 (Wildcard)
```

### Design Tokens e Padrões Visuais Homologados
Em estrita conformidade com o `DESIGN.md`:
* **Tipografia:** Família **Open Sans** em todas as escalas tipográficas.
  * Títulos: Open Sans Bold (24px line-height 32px / 18px line-height 24px);
  * Textos interativos e botões: Open Sans SemiBold 14px;
  * Textos secundários e erros: Open Sans Regular 12px;
  * Labels de inputs: Open Sans Regular 10px em caixa alta (Uppercase) com `letter-spacing: 0.05em`.
* **Paleta de Cores Homologada:**
  * `blue-base` (Primária): `#2C46B1` — Botões de ação primária, borda ativa de inputs e apelidos de links.
  * `blue-dark` (Hover Primário): `#2C4091` — Estado de hover dos botões primários.
  * `danger` (Perigo/Erro): `#B12C4D` — Mensagens de erro de validação, bordas com falha e ações destrutivas.
  * `white`: `#FFFFFF` — Fundo de cards, modais e texto sobre fundos primários.
  * `gray-100`: `#F9F9FB` — Fundo geral da aplicação.
  * `gray-200`: `#E4E6EC` — Linhas divisórias, bordas inativas e contornos estruturais de 1px.
  * `gray-300`: `#CDCFD5` — Placeholders de inputs e elementos desabilitados.
  * `gray-400`: `#74798B` — Textos secundários, URLs de destino e ícones em estado padrão.
  * `gray-600`: `#1F2025` — Textos principais, títulos e dados em alto contraste.
* **Biblioteca de Ícones Obrigatória:** **Phosphor Icons** (`@phosphor-icons/react`), utilizando ícones padronizados: `Copy`, `Trash`, `WarningCircle`, `ArrowSquareOut`, `DownloadSimple` e `SpinnerGap`.

---

### Detalhamento das Telas e Componentes

#### 1. Página Principal (`/`)
* **Formulário de Cadastro:**
  * Campo de URL Original: input de altura 40px com label superior "URL ORIGINAL" em 10px uppercase `#74798B`.
  * Campo de Apelido: input de altura 40px com label superior "APELIDO PERSONALIZADO" em 10px uppercase `#74798B`.
  * Botão de Salvar: botão primário (`#2C46B1`), texto branco, altura 40px, cantos arredondados de 4px (`rounded`).
  * Tratamento de Erro: borda do campo com erro muda para `#B12C4D`, exibindo texto explicativo em 12px e ícone Phosphor `WarningCircle` (12px) 4px abaixo do campo.
* **Cabeçalho da Listagem:**
  * Exibe o logotipo da aplicação (`logo.png`), o totalizador de links cadastrados e o botão secundário "Exportar CSV" (com ícone `DownloadSimple`).
* **Listagem com Rolagem Infinita:**
  * **Empty State:** Caso a base não possua registros, renderiza um componente centralizado com mensagem amigável convidando o usuário a cadastrar seu primeiro link.
  * **Composição do Card de Link:**
    * Fundo branco (`#FFFFFF`), borda de 1px em `#E4E6EC`, cantos arredondados de 8px (`rounded-md`), padding interno de 16px.
    * Lado esquerdo: apelido (`short_url`) em destaque com cor `#2C46B1` (SemiBold), acompanhado da URL original em `#74798B` (Regular 12px) com truncamento elíptico se extensa.
    * Lado direito: contador de cliques com tratamento condicional estrito de concordância ("0 acesso", "1 acesso", "2 acessos"), seguido obrigatoriamente nesta exata ordem visual da esquerda para a direita por:
      1. Botão de Cópia (Icon Button 32x32px com ícone Phosphor `Copy`);
      2. Botão de Exclusão (Icon Button 32x32px com ícone Phosphor `Trash`).
    * **Aviso Mandatório:** O botão "Download QR" do `DESIGN.md` foi descartado e não deve existir no card.
* **Requisitos Obrigatórios de UX:**
  * **Loadings e Spinners:** Indicador visual de carregamento durante a busca inicial de dados, na busca de novas páginas pela rolagem infinita e durante o processamento de ações assíncronas.
  * **Bloqueio de Elementos (`disabled`):** Inputs do formulário e botões de ação (salvar, exportar e excluir) tornam-se inativos (`disabled`) durante requisições assíncronas para prevenir cliques múltiplos ou repetitivos.
  * **Toast de Cópia:** Notificação flutuante temporária no canto da tela exibindo a mensagem "Copiado".
  * **Modal de Confirmação de Exclusão:** Modal com foco bloqueado, fundo escurecido (*backdrop*), solicitando confirmação explícita antes de acionar o endpoint de exclusão física.
  * **Modal de Download de Relatório CSV:** Modal exibida após o upload bem-sucedido na CDN, contendo botões para "Baixar Agora" (disparando o download via URL pública) ou "Fechar".

#### 2. Rota de Redirecionamento Dinâmico (`/:url-encurtada`)
* Rota lógica do React Router DOM que intercepta qualquer requisição com um segmento na URL.
* Renderiza uma tela intermediária com fundo `#F9F9FB` e indicador visual de carregamento centralizado (*spinner* global com ícone Phosphor `SpinnerGap` animado).
* Dispara requisição assíncrona ao backend (`PATCH /links/:short_url/increment`).
* Recebendo resposta 200 com a `original_url`, executa o redirecionamento imediato via `window.location.href`.
* Recebendo resposta 404 ou falha de conexão, transiciona a visualização para a Rota 404.

#### 3. Página de Erro 404 (Wildcard `*`)
* Renderizada quando o visitante tenta acessar rotas inválidas ou links encurtados inexistentes ou previamente excluídos.
* Exibe layout minimalista com código "404", mensagem amigável ("Link não encontrado ou expirado") e botão para retornar à raiz `/`.

## 13. Fluxos Funcionais Detalhados

### Fluxo 1: Criação de Novo Link
1. O Administrador acessa a página principal `/`.
2. Preenche os campos "URL Original" e "Apelido Personalizado".
3. Clica no botão primário "Salvar".
4. O frontend desabilita imediatamente os campos e o botão, exibindo um *spinner* de carregamento.
5. Se a URL original não possuir `http://` ou `https://`, o sistema anexa automaticamente o prefixo `https://`.
6. O frontend valida o schema Zod (formato do apelido de 3 a 50 caracteres alfanuméricos e hífens).
7. O frontend dispara `POST /links` com o payload `{ "original_url": "...", "short_url": "..." }`.
8. O backend revalida os dados com Zod e verifica a unicidade de `short_url`:
   * **Cenário de Sucesso (201):** O registro é persistido no PostgreSQL. O backend retorna o objeto criado. O frontend limpa os campos, reabilita o formulário, adiciona o novo registro no final da listagem e emite feedback visual de sucesso.
   * **Cenário de Erro de Validação (400):** O backend rejeita a requisição. O frontend reabilita os campos e exibe mensagem de erro sob o campo correspondente em `#B12C4D`.
   * **Cenário de Apelido Duplicado (409):** O backend detecta colisão no banco e responde status 409. O frontend reabilita os campos e exibe a mensagem "Este apelido já está em uso" sob o campo de apelido em `#B12C4D`.

### Fluxo 2: Exclusão de Link
1. O Administrador localiza o link na listagem da página principal.
2. Clica no ícone de lixeira (Phosphor `Trash`) no card do respectivo link.
3. Uma janela modal é aberta no centro da tela solicitando confirmação definitiva da remoção.
4. Ao clicar em "Confirmar Exclusão", o botão da modal exibe *spinner* e os botões da interface são desabilitados.
5. O frontend dispara `DELETE /links/:short_url` ao backend.
6. O backend localiza o registro pela `short_url`, executa o `DELETE` físico no PostgreSQL e responde com status 204 No Content.
7. O frontend fecha a modal, remove o item da interface via cache do React Query sem necessidade de recarregar a página e emite toast de confirmação.

### Fluxo 3: Redirecionamento Dinâmico de Visitante
1. O Visitante acessa no navegador uma URL encurtada (ex: `http://localhost:5173/meu-link`).
2. O React Router DOM intercepta a rota dinâmica `/:url-encurtada`.
3. A página renderiza um layout limpo com *spinner* visual de carregamento centralizado.
4. O frontend dispara `PATCH /links/:short_url/increment` para a API.
5. O backend executa consulta no PostgreSQL pela `short_url`:
   * **Se o link existir:** O backend soma atomicamente +1 na coluna `clicks` (`clicks = clicks + 1`), atualiza o banco e responde status 200 com o corpo `{ "original_url": "https://destino.com" }`.
   * **Se o link não existir:** O backend responde status 404 com `{ "error": "Link não encontrado." }`.
6. O frontend processa a resposta:
   * Em caso de 200: invoca imediatamente `window.location.href = data.original_url`.
   * Em caso de 404 ou erro: renderiza imediatamente o componente da Página 404 (Wildcard).

### Fluxo 4: Exportação e Download de Relatório CSV
1. O Administrador clica no botão "Exportar CSV" no cabeçalho da listagem.
2. O botão é desabilitado imediatamente e passa a exibir um *spinner* de processamento.
3. O frontend dispara uma requisição `POST /links/export` para o backend.
4. O backend busca 100% dos links da tabela `links` ordenados por `created_at ASC`.
5. O backend monta o buffer do arquivo CSV em memória, contendo o cabeçalho padronizado: `URL Original,URL Encurtada,Data de Criacao,Acessos Totais`.
6. O backend gera um nome aleatório e único para o arquivo utilizando UUID v4 (ex: `relatorio-links-f47ac10b-58cc-4372-a567-0e02b2c3d479.csv`).
7. O backend envia o buffer diretamente ao bucket Cloudflare R2 utilizando a biblioteca oficial `@aws-sdk/client-s3` (`PutObjectCommand`).
8. O backend obtém a URL pública combinando `CLOUDFLARE_PUBLIC_URL` e o nome do arquivo, respondendo com status 200: `{ "url": "https://pub.cdn.com/relatorio-links-uuid.csv", "filename": "relatorio-links-uuid.csv" }`.
9. O frontend reabilita o botão de exportação, oculta o *spinner* e abre a modal de confirmação de download perguntando se o usuário deseja baixar o relatório gerado.
10. **Ação do Usuário:**
    * Se clicar em "Baixar Agora", o frontend abre o link do arquivo ou aciona o download automático pelo navegador.
    * Se clicar em "Fechar", a modal é encerrada.
11. **Fluxo de Exceção (Falha na CDN ou Banco):**
    * Se o SDK S3 lançar erro de autenticação, conexão ou falha no bucket, o backend captura a exceção, grava o erro detalhado no arquivo de log físico de contingência `server/logs/erros.log` e responde com status 500: `{ "error": "Falha ao gerar e exportar relatório CSV." }`.
    * O frontend recebe o status 500, destrava o botão de exportação (`disabled = false`), remove o *spinner* e exibe um alerta visual ou toast de perigo (`#B12C4D`) informando que houve falha na geração do relatório.

### Fluxo 5: Cópia Rápida de Link
1. O Administrador localiza o link na listagem.
2. Clica no botão com ícone Phosphor `Copy` posicionado à direita do contador de cliques.
3. O frontend concatena a variável de ambiente `VITE_FRONTEND_URL` com a `short_url` (ex: `${VITE_FRONTEND_URL}/${link.short_url}`).
4. Invoca a Clipboard API nativa do navegador (`navigator.clipboard.writeText(...)`).
5. Dispara um aviso flutuante temporário (*toast*) na tela com o texto "Copiado".

## 14. Validações e Regras de Negócio

* **Formatação do Apelido (`short_url`):**
  * Campo obrigatório;
  * Comprimento: mínimo de 3 e máximo de 50 caracteres;
  * Caracteres permitidos: estritamente alfanuméricos e hífens, sem espaços, barras ou acentos;
  * Expressão regular oficial: `/^[a-zA-Z0-9-]+$/`;
  * Schema Zod de validação:
    ```typescript
    z.string()
      .min(3, "O apelido deve ter no mínimo 3 caracteres.")
      .max(50, "O apelido deve ter no máximo 50 caracteres.")
      .regex(/^[a-zA-Z0-9-]+$/, "O apelido deve conter apenas letras, números e hífens.");
    ```
  * Unicidade: constraint `UNIQUE` obrigatória na coluna `short_url` da tabela `links`.
* **Formatação da URL Original (`original_url`):**
  * Campo obrigatório;
  * Auto-correção: caso não contenha o esquema `http://` ou `https://`, o sistema anexa automaticamente `https://` antes de qualquer validação;
  * Schema Zod de validação:
    ```typescript
    z.string().url("Informe uma URL válida.");
    ```
* **Consistência Contratual de API (Regra Crítica):**
  * Os endpoints da API RESTful para **DELETAR** e para **INCREMENTAR** acessos utilizam compulsoriamente o mesmo identificador na URI da rota: a `short_url` (apelido do link).
  * Exemplo: `DELETE /links/:short_url` e `PATCH /links/:short_url/increment`.
* **Imutabilidade e Restrições:**
  * É permanentemente proibido alterar o apelido ou a URL de destino de links salvos.
  * É proibida a implementação de ferramentas de busca textual ou filtros por texto na listagem.
* **Ordenação Cronológica Estrita:**
  * A ordenação padrão na listagem é estritamente por data de criação (`created_at` ASC).
  * Novos registros são renderizados compulsoriamente no final da listagem.

## 15. Contrato Formal da API RESTful

A API é construída com Fastify, documentada com Swagger/OpenAPI e padronizada utilizando a convenção `snake_case` em todas as propriedades trafegadas nos payloads JSON de requisição e resposta.

### Estratégia Oficial de Paginação da Listagem
A listagem (`GET /links`) adota **exclusivamente a estratégia de Paginação Baseada em Cursor (Cursor-based)**, garantindo estabilidade e alta performance aliada ao índice `links_created_at_idx`:
* **Parâmetros da Query:**
  * `cursor` (string opcional): timestamp ISO 8601 da coluna `created_at` do último item recebido na página anterior. Se ausente, busca a partir do início.
  * `limit` (inteiro opcional, padrão fixo: 20): quantidade máxima de registros retornados por página.
* **Formato da Resposta:**
  * Retorna o array `links` e o campo `next_cursor` (string com o ISO timestamp do último item retornado, ou `null` caso não existam mais itens). O React Query consome diretamente esse valor em sua função `getNextPageParam`.

---

### Tabela Consolidada de Endpoints RESTful

| Método | Rota | Descrição | Parâmetros / Request Body | Status e Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/links` | Criação de um novo link encurtado | **Body (JSON):**<br>`{`<br>&nbsp;&nbsp;`"original_url": "https://exemplo.com",`<br>&nbsp;&nbsp;`"short_url": "meu-link"`<br>`}` | **201 Created:**<br>`{`<br>&nbsp;&nbsp;`"id": "uuid",`<br>&nbsp;&nbsp;`"original_url": "https://exemplo.com",`<br>&nbsp;&nbsp;`"short_url": "meu-link",`<br>&nbsp;&nbsp;`"clicks": 0,`<br>&nbsp;&nbsp;`"created_at": "2026-09-23T01:00:00.000Z"`<br>`}`<br>**400 Bad Request:** `{ "error": "Dados inválidos.", "details": [...] }`<br>**409 Conflict:** `{ "error": "Este apelido já está em uso." }` |
| `GET` | `/links` | Listagem infinita paginada por cursor | **Query Params:**<br>`cursor`: string (ISO date, opcional)<br>`limit`: integer (opcional, padrão 20) | **200 OK:**<br>`{`<br>&nbsp;&nbsp;`"links": [`<br>&nbsp;&nbsp;&nbsp;&nbsp;`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"id": "uuid",`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"original_url": "https://exemplo.com",`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"short_url": "meu-link",`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"clicks": 5,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"created_at": "2026-09-23T01:00:00.000Z"`<br>&nbsp;&nbsp;&nbsp;&nbsp;`}`<br>&nbsp;&nbsp;`],`<br>&nbsp;&nbsp;`"next_cursor": "2026-09-23T01:00:00.000Z" \| null`<br>`}` |
| `DELETE` | `/links/:short_url` | Exclusão definitiva (hard delete) do registro | **Route Param:**<br>`short_url`: string (apelido do link) | **204 No Content:** *(Sem corpo)*<br>**404 Not Found:** `{ "error": "Link não encontrado." }` |
| `PATCH` | `/links/:short_url/increment` | Incremento atômico de +1 clique e retorno do destino | **Route Param:**<br>`short_url`: string (apelido do link) | **200 OK:**<br>`{`<br>&nbsp;&nbsp;`"original_url": "https://exemplo.com"`<br>`}`<br>**404 Not Found:** `{ "error": "Link não encontrado." }` |
| `POST` | `/links/export` | Geração do CSV em memória e upload na Cloudflare R2 | **Body:** *(Vazio)* | **200 OK:**<br>`{`<br>&nbsp;&nbsp;`"url": "https://pub.cdn.com/relatorio-links-uuid.csv",`<br>&nbsp;&nbsp;`"filename": "relatorio-links-uuid.csv"`<br>`}`<br>**500 Internal Server Error:** `{ "error": "Falha ao gerar e exportar relatório CSV." }` |

## 16. Autenticação e Sessão

O sistema é concebido para operação local e privativa de usuário único (o próprio desenvolvedor), prescindindo de:
* Telas de cadastro de usuários ou fluxo de login;
* Tokens de autenticação JWT, cookies ou controle de sessões HTTP;
* Mecanismos de recuperação ou troca de senha.

## 17. Controle de Acesso e Segurança de Rede

* **CORS:** O servidor Fastify deve registrar obrigatoriamente o pacote `@fastify/cors` configurado para autorizar exclusivamente requisições provenientes da URL do frontend (`VITE_FRONTEND_URL`).
* **Proteção de Rotas:** Os endpoints administrativos (`POST /links`, `GET /links`, `DELETE /links/:short_url` e `POST /links/export`) são consumidos unicamente pelo frontend local na porta configurada. A rota `PATCH /links/:short_url/increment` é pública para permitir o roteamento do visitante.
* **Sanitização SDD:** Schemas de validação Zod bloqueiam qualquer tentativa de injeção de parâmetros maliciosos, strings mal formatadas ou caracteres corrompidos.

## 18. Auditoria e Histórico

A auditoria do sistema restringe-se estritamente à gravação do timestamp exato de criação do link (`created_at`) diretamente pelo relógio do PostgreSQL (`DEFAULT now()`). Não há tabelas de auditoria de alterações ou exclusões.

## 19. Soft Delete e Exclusões

Não será implementado mecanismo de exclusão lógica (soft delete).
* Toda exclusão solicitada via `DELETE /links/:short_url` expurga fisicamente a linha da tabela `links` do banco de dados PostgreSQL.
* Não existe coluna `deleted_at`.
* Qualquer acesso subsequente a um link que foi excluído resultará automaticamente no retorno de status HTTP 404 pelo backend e renderização da Página de Erro 404 no frontend.

## 20. Logs e Contingência

* **Logs de Erro da Aplicação:** O Fastify registrará em console (stdout) todas as transações e requisições HTTP da API.
* **Arquivo Físico de Contingência:** Exceções do banco de dados, falhas de conectividade de rede e erros de autenticação com a CDN Cloudflare R2 disparados pelo `@aws-sdk/client-s3` devem ser salvos compulsoriamente com append no arquivo físico `server/logs/erros.log`. Cada linha conterá: timestamp ISO, tipo de erro, mensagem e stack trace.
* **Logs de Segurança:** Monitoramento passivo no console observando padrões anômalos de retornos 404.

## 21. Configurações Globais e Variáveis de Ambiente

Não haverá interface de configurações no sistema. As configurações globais são definidas estritamente através de arquivos `.env` versionados como modelo:

### Arquivo `server/.env.example`
Deve conter obrigatoriamente e exatamente as seguintes variáveis:
```bash
PORT=
DATABASE_URL=
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

### Arquivo `web/.env.example`
Deve conter obrigatoriamente e exatamente as seguintes variáveis:
```bash
VITE_FRONTEND_URL=
VITE_BACKEND_URL=
```

### Validação Centralizada no Boot (`server/src/config/env.ts`)
O backend possui um módulo que utiliza o Zod para ler e validar todas as variáveis do `process.env`. Se qualquer variável obrigatória estiver vazia, ausente ou fora do padrão, a aplicação imprime o erro no console e interrompe imediatamente a inicialização do Node.js através de `process.exit(1)`.

## 22. Uploads, Anexos e Arquivos

* Não existe upload manual de arquivos por parte de usuários na interface.
* O único processo de upload é automatizado e executado exclusivamente pelo backend ao processar a exportação de relatórios CSV.
* **Nome Único e Aleatório Mandatório:** O backend deve gerar compulsoriamente um identificador UUID v4 aleatório para compor o nome do arquivo CSV antes de transferi-lo para a nuvem (ex: `relatorio-links-<uuid>.csv`), evitando colisões de nomes ou sobrescrita no bucket.
* O upload utiliza estritamente o cliente `S3Client` da biblioteca oficial `@aws-sdk/client-s3` apontando para o endpoint da Cloudflare R2 (`https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`).

## 23. Relatórios, Consultas e Exportações

* **Abrangência:** O relatório CSV conterá 100% dos registros cadastrados na tabela `links`, sem filtros, ordenados do mais antigo para o mais recente (`created_at` ASC).
* **Buffer em Memória:** A compilação do arquivo CSV é feita em memória pelo Fastify, dispensando o salvamento de arquivos temporários em disco.
* **Colunas Obrigatórias do CSV:**
  1. `URL Original`
  2. `URL Encurtada`
  3. `Data de Criacao`
  4. `Acessos Totais`
* **UX de Exportação:**
  * O botão "Exportar CSV" desativa-se imediatamente ao ser clicado e apresenta *spinner* visual de carregamento;
  * Concluído o upload com sucesso, a interface abre a modal com a opção de download imediato;
  * Se a operação falhar, o botão é reabilitado e um aviso visual de erro em `#B12C4D` é apresentado ao usuário.

## 24. APIs e Integrações Externas

A única integração externa do sistema é com o serviço de armazenamento em nuvem **Cloudflare R2**:
* Protocolo: API compatível com Amazon S3.
* Biblioteca Oficial: `@aws-sdk/client-s3` (instâncias de `S3Client` e `PutObjectCommand`).
* Configuração do Cliente:
  * `endpoint`: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
  * `credentials`: `{ accessKeyId: CLOUDFLARE_ACCESS_KEY_ID, secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY }`
  * `region`: `"auto"`
* Tratamento de Exceções: Erros de conexão ou credenciais inválidas gravam o log em `server/logs/erros.log` e retornam status HTTP 500 com mensagem padronizada.

## 25. Segurança Funcional

* **Isolamento de Origens:** Liberação restrita do tráfego do frontend através do `@fastify/cors`.
* **Sanitização de Entradas (Zod):** Todos os parâmetros de rota, query strings e bodies de requisição passam por validação Zod antes de atingir os controllers ou services.
* **Integridade das Variáveis de Ambiente:** O sistema impede inicializações com credenciais incompletas (`env.ts`).

## 26. Organização Sugerida da Implementação

A IA codificadora deve seguir a ordem de execução estruturada abaixo:

1. **Estrutura Base de Pastas:** Criar a divisão estrita de diretórios raiz entre `web` e `server`.
2. **Ambiente e Docker:** Criar os arquivos `.env.example` para `web` e `server` com as chaves exatas estipuladas. Configurar o `server/Dockerfile` e o `docker-compose.yml` na raiz unindo PostgreSQL, API e Frontend.
3. **Módulo de Ambiente:** Criar o validador `server/src/config/env.ts` tipado com Zod e encerramento em `process.exit(1)`.
4. **Configuração do Drizzle ORM e Migrations:** Configurar `server/database/connection.ts`, adicionar o script `"db:migrate"` no `server/package.json` e criar a migration inicial versionada em `server/database/migrations/` contendo a tabela `links` e o índice `links_created_at_idx`.
5. **Setup do Servidor Fastify:** Inicializar o Fastify em `server/src/index.ts`, registrando `@fastify/cors`, `@fastify/swagger` e o diretório de logs `server/logs/`.
6. **Módulo Links (TDD e DDD):**
   * Escrever testes automatizados com Vitest para validação de apelidos, inserção de `https://` e contagem de cliques;
   * Implementar `server/src/app/links/links.schemas.ts` com schemas Zod;
   * Implementar `server/src/app/links/links.service.ts` e `links.controller.ts`;
   * Implementar as rotas da API no padrão consistente (`POST /links`, `GET /links` com cursor, `DELETE /links/:short_url` e `PATCH /links/:short_url/increment`).
7. **Serviço de Exportação CSV e R2:** Implementar o endpoint `POST /links/export`, gerador de buffer CSV com nome aleatório UUID e integração com `@aws-sdk/client-s3`.
8. **Setup do Frontend Cliente:** Inicializar o projeto Vite com React e TypeScript em `web/`, configurando TailwindCSS com os Design Tokens homologados e instalando `@phosphor-icons/react` e shadcn/ui.
9. **Roteamento SPA:** Configurar o React Router DOM com as rotas `/`, `/:url-encurtada` e `*`.
10. **Implementação da Tela Principal (`/`):**
    * Desenvolver formulário de cadastro com React Hook Form e Zod;
    * Implementar consumo da API paginada com React Query (`useInfiniteQuery`);
    * Construir os cards de links com visual exato (apelido em destaque, URL secundária, contador com concordância gramatical, e botões de Cópia e Exclusão nesta ordem);
    * Integrar Empty State, loaders visuais e bloqueio (`disabled`) em botões e inputs durante requisições.
11. **Modais e Feedback:** Desenvolver o Toast de cópia rápida, a modal de confirmação de exclusão definitiva e a modal de download de relatório CSV.
12. **Implementação da Rota Dinâmica (`/:url-encurtada`):** Implementar interceptador com *spinner* centralizado que invoca `PATCH /links/:short_url/increment` e redireciona via `window.location.href`, roteando para 404 em caso de erro.
13. **Implementação da Página 404:** Criar a tela de Wildcard para links não encontrados.
14. **Testes Finais de Ponta a Ponta:** Validar o fluxo completo em container Docker e conferir cobertura dos critérios de aceitação.

## 27. Critérios de Aceitação Técnica e Funcional

O sistema será considerado concluído e aceito se atender integralmente a cada um dos critérios abaixo:

* [ ] Repositório estruturado obrigatoriamente e exclusivamente nas subpastas raiz `web` e `server`.
* [ ] Arquivos `.env.example` criados com as chaves exatas estipuladas para `web` e `server`.
* [ ] Backend conteinerizado com `server/Dockerfile` e orquestrado via `docker-compose.yml` junto ao PostgreSQL e Frontend.
* [ ] Validação rigorosa de ambiente no arquivo `server/src/config/env.ts` com interrupção de boot (`process.exit(1)`) caso falte qualquer chave obrigatória.
* [ ] Script `"db:migrate"` presente no `server/package.json` aplicando migrations versionadas individuais em `server/database/migrations/`.
* [ ] Banco de dados com tabela `links` e índice `links_created_at_idx` em `created_at ASC`.
* [ ] Cadastro de link com apelido manual (3 a 50 caracteres alfanuméricos e hífens), com auto-correção silenciosa para `https://` e bloqueio de inputs/botões durante o salvamento.
* [ ] Exibição de mensagem de erro visual sob o campo com a cor `#B12C4D` e ícone `WarningCircle` em caso de dados inválidos ou colisão de apelido.
* [ ] Listagem infinita consumindo a API via paginação baseada em cursor (`created_at`), ordenada estritamente do mais antigo para o mais recente (`created_at` ASC).
* [ ] Novos registros inseridos aparecem compulsoriamente no final da listagem.
* [ ] Exibição obrigatória de Empty State amigável quando não houver links cadastrados.
* [ ] Bloqueio de botões e campos (`disabled`) e exibição de *spinners* visuais durante qualquer requisição assíncrona.
* [ ] Card de link contendo apelido em destaque (`#2C46B1`), URL de destino em `#74798B`, contador com concordância gramatical ("0 acesso", "1 acesso", "2 acessos"), seguido dos botões de Copiar e Excluir nesta ordem visual exata.
* [ ] O botão "Download QR" do `DESIGN.md` não foi implementado.
* [ ] Ícones fornecidos estritamente pela biblioteca `@phosphor-icons/react`.
* [ ] Cópia rápida concatenando `VITE_FRONTEND_URL` + `/` + `short_url`, copiando via Clipboard API nativa e exibindo toast flutuante "Copiado".
* [ ] Confirmação de exclusão em janela modal e execução de hard delete físico no banco de dados.
* [ ] Consistência estrita de API: rotas de deleção e incremento utilizam compulsoriamente a `:short_url` na URI (`DELETE /links/:short_url` e `PATCH /links/:short_url/increment`).
* [ ] Redirecionamento dinâmico SPA (`/:url-encurtada`) com +1 clique atômico via API e redirecionamento via `window.location.href`.
* [ ] Página de Erro 404 (Wildcard `*`) para links inexistentes, excluídos ou rotas inválidas.
* [ ] Exportação de relatório CSV com 100% dos links gerado em memória, salvo com nome aleatório UUID na Cloudflare R2 via `@aws-sdk/client-s3`.
* [ ] Modal de download imediato do relatório CSV após upload bem-sucedido e tratamento de erro registrando em `server/logs/erros.log` em caso de falha.
* [ ] Servidor backend protegido com `@fastify/cors` e validações de dados padronizadas com Zod em `snake_case`.
* [ ] Ausência total de ferramentas de busca textual e bloqueio permanente de qualquer edição de links salvos.

## 28. Pontos Pendentes e Decisões Futuras

Não foram identificadas pendências bloqueantes ou não bloqueantes para o início do desenvolvimento. Todas as regras, fluxos, modelos de dados, componentes e contratos da API encontram-se formalizados e prontos para codificação.

## 29. Conclusão

O presente Documento de Especificação Funcional (FSD) encontra-se 100% completo, saneado, autossuficiente e habilitado para orientar uma IA codificadora na construção rigorosa do sistema.

Para a execução da codificação, a IA codificadora deverá utilizar exclusivamente os arquivos:
* `docs/FSD.md` (Especificação funcional, arquitetura e contratos REST);
* `docs/DESIGN.md` (Design tokens, estilos visuais e componentes).