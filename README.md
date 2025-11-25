# Cantina Digital

Aplicação full-stack para gerenciamento de pedidos de uma cantina, dividida em **frontend (React + Vite)** e **backend (Node.js + Express + Prisma + MySQL)**.

Este guia explica como qualquer pessoa pode baixar o projeto, configurar o ambiente e executar **backend** e **frontend** localmente.

---

## 1. Estrutura do projeto

- `frontend/` – aplicação React + TypeScript usando Vite
- `backend/` – API REST em Node.js (Express) com Prisma e MySQL

---

## 2. Pré-requisitos

Antes de começar, instale:

- **Node.js** `>= 18` (recomendado 18 ou 20 LTS)
- **npm** (vem junto com o Node.js) ou outro gerenciador (`pnpm`, `yarn`, etc.)
- **MySQL** `>= 8` ou compatível (ex.: MariaDB) rodando localmente ou em um servidor acessível

Também é recomendado ter:

- **Git** – para clonar o repositório

---

## 3. Clonar o repositório

```bash
# Clonar o projeto
git clone https://github.com/SrMarinho/cantina-digital.git

# Entrar na pasta do projeto
cd cantina-digital
```

> A partir daqui, todos os comandos assumem que você está dentro da pasta `cantina-digital`.

---

## 4. Backend (API)

### 4.1. Tecnologias usadas

- Node.js + Express
- Prisma ORM
- MySQL
- Autenticação com JWT
- Dotenv para variáveis de ambiente

### 4.2. Instalar dependências do backend

```bash
cd backend
npm install
```

### 4.3. Configurar o banco de dados MySQL

1. Garanta que o MySQL está rodando.
2. Crie um banco de dados para o projeto, por exemplo `cantina_digital`.

Exemplo de criação de banco (ajuste usuário/senha conforme o seu ambiente):

```sql
CREATE DATABASE cantina_digital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4.4. Configurar variáveis de ambiente do backend

Na pasta `backend/`, crie um arquivo `.env` com o seguinte conteúdo (ajuste os valores conforme seu ambiente):

```env
# URL de conexão com o banco MySQL
DATABASE_URL="mysql://usuario:senha@localhost:3306/cantina_digital"

# Segredo usado para assinar os tokens JWT
JWT_SECRET="uma-frase-secreta-bem-grande-e-dificil-de-adivinhar"

# Porta em que a API irá rodar
PORT=3000
```

Campos importantes:

- `DATABASE_URL` – string de conexão do Prisma; troque `usuario`, `senha` e `cantina_digital` de acordo com o que você criou no MySQL.
- `JWT_SECRET` – defina um segredo forte; qualquer string longa funciona em ambiente local.
- `PORT` – porta HTTP da API (por padrão o código usa `3000`).

### 4.5. Criar/migrar o schema do banco com Prisma

Ainda dentro da pasta `backend/`, rode:

```bash
# Criar as tabelas no banco de desenvolvimento
npx prisma migrate deploy
```

Caso queira apenas empurrar o schema atual para o banco sem criar migrations (apenas para ambiente de desenvolvimento), você pode usar:

```bash
npx prisma db push
```

> **Importante:** o schema está definido em `backend/prisma/schema.prisma` e utiliza o datasource `DATABASE_URL` e provider `mysql`.

### 4.6. Popular o banco com dados de exemplo (seed)

O projeto já inclui um script de seed em `backend/prisma/seed.ts`.

Depois de configurar o `.env` e aplicar o schema (migrate ou db push), execute:

```bash
npx prisma db seed
```

Isso irá:

- Limpar dados existentes das tabelas relacionadas (Users, Products, Orders, OrderItems)
- Criar usuários, produtos e pedidos de exemplo

Para fazer login na aplicação, use as seguintes credenciais:

Email: usuario1@email.com

Senha: 123456

O seed cria vários usuários

### 4.7. Rodar o servidor backend em modo desenvolvimento

Ainda na pasta `backend/`:

```bash
npm run dev
```

Se tudo estiver correto, você deverá ver algo como:

```text
Server listening on port 3000
```

A API ficará disponível (por padrão) em:

- `http://localhost:3000`

> Deixe o backend rodando enquanto você executa o frontend.

---

## 5. Frontend (React + Vite)

### 5.1. Tecnologias usadas

- React + TypeScript
- Vite
- Tailwind CSS
- Axios

### 5.2. Instalar dependências do frontend

Em outro terminal, a partir da raiz do projeto (`cantina-digital`):

```bash
cd frontend
npm install
```

### 5.3. Configurar variáveis de ambiente do frontend

O frontend utiliza uma variável de ambiente para saber a URL base da API (`VITE_API_BASE_URL`) dentro de `src/services/apiClient.ts`.

Na pasta `frontend/`, crie um arquivo `.env` com o conteúdo:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

Ajuste a URL caso você tenha alterado a porta ou o host do backend.

### 5.4. Rodar o frontend em modo desenvolvimento

Ainda na pasta `frontend/`:

```bash
npm run dev
```

O Vite vai exibir no terminal a URL de acesso, normalmente algo como:

- `http://localhost:5173`

Abra essa URL no navegador. Se o backend estiver rodando corretamente e a variável `API_BASE_URL` apontar para a API, a aplicação conseguirá consumir os dados.

---

## 5.5. Deploy do Frontend

O frontend está disponível em produção através do seguinte link:

🔗 **Aplicação Online:** https://cantina-digital-frontend.vercel.app/

> **Nota:** A aplicação online está conectada ao backend na Vercel.

---

## 6. Scripts úteis

### Backend (`backend/package.json`)

- `npm run dev` – inicia o servidor Express com `nodemon` em modo desenvolvimento.
- `npm run build` – compila o TypeScript.
- `npm run format` – formata arquivos TypeScript na pasta `src` com Prettier.

Comandos Prisma mais comuns:

```bash
# Aplicar migrations em desenvolvimento
npx prisma migrate deploy

# Atualizar o banco a partir do schema sem criar migrations (dev)
npx prisma db push

# Rodar o seed de dados
npx prisma db seed
```

### Frontend (`frontend/package.json`)

- `npm run dev` – inicia o servidor de desenvolvimento do Vite.
- `npm run build` – build de produção da aplicação React.
- `npm run lint` – roda o ESLint.
- `npm run preview` – serve localmente o build de produção para teste.

---

## 7. Fluxo rápido (resumo)

1. **Clonar o repositório** e entrar na pasta `cantina-digital`.
2. **Backend**:
   - `cd backend`
   - Criar `.env` com `DATABASE_URL`, `JWT_SECRET` e `PORT`.
   - `npm install`
   - `npx prisma migrate deploy`
   - `npx prisma db seed`
   - `npm run dev`
3. **Frontend** (em outro terminal):
   - `cd frontend`
   - Criar `.env` com `VITE_API_BASE_URL` apontando para `http://localhost:3000`.
   - `npm install`
   - `npm run dev`
4. Acessar `http://localhost:5173` no navegador.

Com esses passos, qualquer pessoa com Node.js e MySQL instalados deve conseguir rodar o projeto completo (backend + frontend) localmente.
