# Documentação do Projeto: Cantina Digital Escolar

## 📋 Visão Geral

O **Cantina Digital Escolar** é uma aplicação web full-stack que permite a estudantes e funcionários realizarem pedidos em uma cantina escolar de forma digital. O sistema inclui autenticação segura com JWT, gerenciamento de cardápio, realização de pedidos e consulta de histórico.

---

## 🎯 Objetivo

Criar uma aplicação web onde usuários (estudantes, funcionários) podem:

- Cadastrar-se e fazer login
- Visualizar o cardápio da cantina
- Fazer pedidos
- Consultar seu histórico de pedidos

---

## 🏗️ Arquitetura

### Backend (API RESTful)

- **Tecnologias sugeridas:** Node.js/Express, Python/Django ou Laravel PHP
- **Banco de dados:** PostgreSQL, MySQL, MongoDB ou SQLite
- **Autenticação:** JWT (JSON Web Token)

### Frontend

- **Tecnologias sugeridas:** React, Vue ou Angular
- **Gerenciamento de estado:** Local para carrinho e autenticação

---

## 🔐 Sistema de Autenticação

### Rotas de Autenticação

#### `POST /auth/register`

Registra um novo usuário no sistema.

**Body:**

```json
{
  "nome": "string",
  "email": "string",
  "senha": "string",
  "matricula": "string (opcional)"
}
```

**Resposta:**

```json
{
  "message": "Usuário registrado com sucesso",
  "userId": "string"
}
```

#### `POST /auth/login`

Autentica um usuário e retorna um token JWT.

**Body:**

```json
{
  "email": "string",
  "senha": "string"
}
```

**Resposta:**

```json
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "nome": "string",
    "email": "string"
  }
}
```

### Middleware de Autenticação

- Valida o token JWT no header `Authorization: Bearer <token>`
- Retorna erro 401 se token inválido ou ausente
- Extrai o ID do usuário do token para uso nas rotas protegidas

---

## 📊 Estrutura do Banco de Dados

### Tabela `Users`

| Campo        | Tipo               | Descrição                  |
|--------------|--------------------|--------------------------|
| id           | UUID/Primary Key   | Identificador único      |
| nome         | string             | Nome completo            |
| email        | string             | E-mail único            |
| senha_hash   | string             | Senha com hash bcrypt    |
| matricula    | string             | ID estudantil (opcional) |
| created_at   | datetime           | Data de criação         |

### Tabela `Products`

| Campo       | Tipo               | Descrição                      |
|-------------|--------------------|---------------------------------|
| id          | UUID/Primary Key   | Identificador único            |
| nome        | string             | Nome do produto                 |
| descricao   | string             | Descrição do produto           |
| preco       | decimal            | Preço unitário                  |
| imagem      | string             | URL da imagem (opcional)        |
| disponivel  | boolean            | Status de disponibilidade       |

### Tabela `Orders`

| Campo        | Tipo               | Descrição                    |
|--------------|--------------------|------------------------------|
| id           | UUID/Primary Key   | Identificador único        |
| user_id      | Foreign Key        | Referência ao usuário      |
| data_pedido  | datetime           | Data do pedido               |
| total        | decimal            | Valor total do pedido        |
| status       | string             | Status do pedido             |

### Tabela `OrderItems`

| Campo           | Tipo               | Descrição                        |
|-----------------|--------------------|---------------------------------|
| id              | UUID/Primary Key   | Identificador único            |
| order_id        | Foreign Key        | Referência ao pedido           |
| product_id      | Foreign Key        | Referência ao produto          |
| quantidade      | integer            | Quantidade do item              |
| preco_unitario  | decimal            | Preço no momento do pedido     |

---
## 🍽️ Rotas do Cardápio/Produtos

### `GET /products`

Lista todos os produtos disponíveis.

**Resposta:**

```json
{
  "products": [
    {
      "id": "string",
      "nome": "string",
      "descricao": "string",
      "preco": "number",
      "imagem": "string"
    }
  ]
}
```

### `GET /products/:id`

Retorna os detalhes de um produto específico.

**Resposta:**

```json
{
  "id": "string",
  "nome": "string",
  "descricao": "string",
  "preco": "number",
  "imagem": "string"
}
```

---
## 📦 Rotas de Pedidos

### `POST /orders`

Cria um novo pedido.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "itens": [
    {
      "productId": "string",
      "quantity": "number"
    }
  ]
}
```

**Resposta:**

```json
{
  "message": "Pedido criado com sucesso",
  "orderId": "string",
  "total": "number"
}
```

### `GET /orders`

Lista os pedidos do usuário autenticado.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Resposta:**

```json
{
  "pedidos": [
    {
      "id": "string",
      "data_pedido": "datetime",
      "total": "number",
      "status": "string",
      "itens": [
        {
          "nome": "string",
          "quantidade": "number",
          "preco_unitario": "number"
        }
      ]
    }
  ]
}
```

### `GET /orders/:id`

Busca um pedido específico (apenas se pertencer ao usuário).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Resposta:**

```json
{
  "id": "string",
  "data_pedido": "datetime",
  "total": "number",
  "status": "string",
  "itens": [
    {
      "nome": "string",
      "quantidade": "number",
      "preco_unitario": "number"
    }
  ]
}
```

---
## 🖥️ Frontend

### Rotas da Aplicação

| Rota           | Descrição                | Protegida |
|----------------|----------------------------|----------|
| `/login`       | Página de login           | Não       |
| `/register`    | Página de registro        | Não       |
| `/menu`        | Cardápio de produtos      | Sim      |
| `/meus-pedidos`| Histórico de pedidos      | Sim      |
| `/carrinho`    | Carrinho de compras        | Sim      |

### Gerenciamento de Autenticação

- Token JWT armazenado em `localStorage` ou `sessionStorage`
- Header `Authorization: Bearer <token>` incluído em requisições protegidas
- Redirecionamento automático para `/login` se não autenticado
- Botão de logout que limpa o token e redireciona

### Funcionalidades Principais

#### Cardápio

- Exibição de produtos em cards com nome, preço e imagem
- Interface responsiva e atrativa

#### Carrinho de Compras

- Adição/remoção de itens
- Cálculo automático do total
- Estado gerenciado localmente no frontend

#### Finalização de Pedido

- Envio da requisição `POST /orders` com token
- Confirmação visual do pedido realizado

#### Histórico de Pedidos

- Listagem cronológica de pedidos anteriores
- Detalhes completos de cada pedido (itens, valores, status)

---

## 🔒 Considerações de Segurança

- Senhas armazenadas com hash bcrypt + salt
- Validação de propriedade de pedidos (usuário só acessa seus próprios pedidos)
- ID do usuário extraído do JWT, nunca enviado pelo frontend
- Validação de tokens JWT em todas as rotas protegidas

---

## 📝 Critérios de Avaliação

### Funcionalidade

- Login e registro funcionais
- Realização de pedidos funcionando
- Histórico de pedidos acessível

### Segurança

- Senhas hasheadas adequadamente
- Filtragem de pedidos por usuário
- Isolamento de dados entre usuários

### Boas Práticas

#### Backend

- API bem estruturada e organizada
- ID do usuário obtido do token JWT
- Tratamento adequado de erros

#### Frontend

- Aplicação reativa e responsiva
- Gerenciamento adequado de estado
- Interface de usuário intuitiva

#### Código Limpo

- Código legível e bem documentado
- Seguimento de convenções da linguagem/framework
- Estrutura de projeto organizada

---

## 🚀 Recursos Bônus

### Painel Administrativo

- Tipo de usuário `admin` no JWT
- Rotas administrativas:
  - `POST /products` - Adicionar produtos
  - `GET /orders/all` - Visualizar todos os pedidos
- Gerenciamento de usuários

### Status de Pedido

- Campo `status` nos pedidos com valores:
  - "Pendente"
  - "Em Preparo"
  - "Pronto para Retirada"
- Atualização em tempo real do status

### Sistema de Saldo

- Campo `saldo` na tabela Users
- Débito automático ao realizar pedidos
- Recarga de saldo

### Validação de Dados

- Validação de e-mail
- Verificação de força de senha
- Validação de existência de productID
- Sanitização de entradas

