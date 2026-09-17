# Nginx como Proxy Reverso com Node.js

Aplicação que simula um ambiente real de desenvolvimento, com o **Nginx** atuando como Proxy Reverso, recebendo requisições e encaminhando-as para uma aplicação **Node.js**, que persiste dados em um banco **MySQL**.

## Arquitetura

```
Usuário → Nginx (porta 8080) → Node.js (porta 3000) → MySQL (porta 3306)
```

- **Nginx**: recebe as requisições do usuário e faz proxy reverso para a aplicação Node.js.
- **Node.js**: a cada requisição na rota `/`, gera um nome aleatório (via `@faker-js/faker`), insere na tabela `people` do banco e retorna a lista completa de nomes já cadastrados.
- **MySQL**: armazena os registros. A tabela `people` é criada automaticamente na primeira inicialização do banco, via script SQL.

## Tecnologias

- Node.js (módulo `http` nativo)
- Nginx
- MySQL 5.7
- Docker & Docker Compose

## Estrutura do projeto

```
├── docker-compose.yml       # Orquestração dos containers
├── init/
│   └── init.sql             # Script de criação da tabela people (executado automaticamente pelo MySQL)
├── node/
│   ├── index.js             # Aplicação Node.js
│   ├── Dockerfile           # Imagem da aplicação
│   ├── package.json         # Dependências
│   └── package-lock.json
├── nginx/
│   ├── nginx.conf           # Configuração do Proxy Reverso
│   └── Dockerfile
└── README.md
```

## Como executar

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

```bash
docker compose up
```

Esse é o único comando necessário. Ele constrói as imagens, instala as dependências do Node.js, cria a tabela no banco e sobe os três serviços — nenhum passo manual adicional é preciso.

Após subir, acesse:

```
http://localhost:8080
```

Cada acesso (ou reload) insere um novo nome no banco e exibe a lista completa:

```html
<h1>Full Cycle Rocks!</h1>
- Wescley
- Luiz
- (outros nomes cadastrados...)
```

## Como funciona a inicialização automática

- **Dependências do Node.js**: instaladas durante o build da imagem (`RUN npm install` no Dockerfile), a partir do `package.json`. Um volume anônimo (`/usr/src/app/node_modules`) garante que essas dependências não sejam sobrescritas pelo bind mount da aplicação.
- **Tabela do banco**: o MySQL executa automaticamente qualquer script `.sql` presente em `/docker-entrypoint-initdb.d/` na primeira vez que o banco é inicializado. O arquivo `init/init.sql` é montado nesse caminho e cria a tabela `people`.

## Parando a aplicação

```bash
docker compose down
```

Para remover também os dados persistidos do banco:

```bash
docker compose down -v
```
