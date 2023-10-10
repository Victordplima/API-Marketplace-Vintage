# API de Produtos

Uma API simples para gerenciar uma lista de produtos.

## Endpoints

### 1. Listar Todos os Produtos

Retorna uma lista com todos os produtos disponíveis.

- **URL** : `/produtos`
- **Método** : `GET`
- **Parâmetros** : Nenhum
- **Resposta Sucesso** : Código `200 OK` e uma lista de produtos no corpo da resposta.
- **Resposta Erro** : Código `404 Not Found` se não houver produtos.

### 2. Obter um Produto por ID

Retorna um produto específico com base no ID fornecido.

- **URL** : `/produtos/:id`
- **Método** : `GET`
- **Parâmetros** : `id` (número inteiro) - ID do produto.
- **Resposta Sucesso** : Código `200 OK` e os detalhes do produto no corpo da resposta.
- **Resposta Erro** : Código `404 Not Found` se o produto não for encontrado.

### 3. Adicionar um Novo Produto

Adiciona um novo produto à lista de produtos.

- **URL** : `/produtos`
- **Método** : `POST`
- **Parâmetros do Corpo** : Informações do novo produto em formato JSON.
- **Resposta Sucesso** : Código `201 Created` e os detalhes do produto adicionado no corpo da resposta.
- **Resposta Erro** : Código `400 Bad Request` se a requisição estiver mal formatada.

### 4. Atualizar um Produto por ID

Atualiza as informações de um produto existente com base no ID fornecido.

- **URL** : `/produtos/:id`
- **Método** : `PUT`
- **Parâmetros** : `id` (número inteiro) - ID do produto a ser atualizado.
- **Parâmetros do Corpo** : Novas informações do produto em formato JSON.
- **Resposta Sucesso** : Código `200 OK` e os detalhes do produto atualizado no corpo da resposta.
- **Resposta Erro** : Código `404 Not Found` se o produto não for encontrado.

### 5. Deletar um Produto por ID

Deleta um produto específico com base no ID fornecido.

- **URL** : `/produtos/:id`
- **Método** : `DELETE`
- **Parâmetros** : `id` (número inteiro) - ID do produto a ser deletado.
- **Resposta Sucesso** : Código `200 OK` e os detalhes do produto deletado no corpo da resposta.
- **Resposta Erro** : Código `404 Not Found` se o produto não for encontrado.

## Configuração

- Clone o repositório.
- Instale as dependências usando `npm install`.
- Inicie o servidor usando `npm start`.
