API de Criação de Conta e Conta Bancária
Esta API permite criar contas de perfil de usuário e contam, simulando operações de uma conta bancárias, juntamente com operações de depósito e saque. Ela foi desenvolvida usando Node.js e implementa as seguintes tecnologias: Jest.js, RabbitMQ e Knex.js. Além disso, segue padrões comuns, como DDD (Domain-Driven Design).

Feito com intuito de treinar conceitos e padrões como por exemplo: DDD, TDD, Clean Architecture e Ports and Adapters, Event Driven Architecture.

Pré-requisitos
Certifique-se de ter as seguintes dependências instaladas em seu sistema antes de executar a API:

Node.js (versão 18.16.0 ou superior)
YARN (gerenciador de pacotes do Node.js)
RabbitMQ (broker de mensagens)
Banco de dados (PostgreSQL) e as credenciais de acesso

**Instalação**

1 - Clone este repositório para sua máquina local:

git clone https://github.com/LeandroSantosP/Account

2 - Acesse o diretório do projeto:

cd Account

Instale as dependências do projeto usando o YARN:

yarn

3 - Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis de ambiente:

CURRENT_DB = 'development'

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=

DB_HOST_TEST=
DB_PORT_TEST=
DB_NAME_TEST=
DB_USER_TEST=
DB_PASS_TEST=

4 - Execute as migrações do banco de dados para criar as tabelas necessárias:

yarn knex migrate:latest

5 - Inicie a aplicação:

yarn start

A API agora está em execução e pode ser acessada em http://localhost:3000.

Tenha certeza que o banco de dados estava de pe, juntamente com o rabbitMq.

**Testes**
Este projeto utiliza o Jest.js como framework de teste. Para executar os testes, execute o seguinte comando:

**Tenha certeza que o banco de dados de test esteve funcionando!**
yarn test

**Endpoints**

A seguir estão os endpoints fornecidos por esta API:

1 - URL: localhost:3000/profile-account

Método: POST

Corpo da requisição EXEMPLO:

{
"name": "Leandro",
"email":"Leandro@gmail.com",
"password": "senha123",
"address":{
"street":"Rua 1",
"city":"Sao paulo",
"number": 100
}
}

2 - URL: localhost:3000/account

Método: POST

Corpo da requisição EXEMPLO:

{
"client_id":"ab2e3490-3937-448b-b332-3db338ecb17d",
"owner_name": "Maria",
"email": "Maria@gmail.com"
}

3 - URL: localhost:3000/account/ab2e3490-3937-448b-b332-3db338ecb17d

Método: GET

4 - URL: localhost:3000/deposit

Método: POST

Corpo da requisição EXEMPLO:

{
"account_code": "202300000001",
"amount": 2000,
"deposit_date": "2022-06-20",
"currency": "BRL"
}

5 - URL: localhost:3000/withdraw

Método: POST

Corpo da requisição EXEMPLO:

{
"account_code": "202300000001",
"amount": 1000,
"withdraw_date": "2023-07-20"
}

6 - URL: localhost:3000/transfer

Método: POST

Corpo da requisição EXEMPLO:
{
"from": "202300000002",
"to": "202300000001",
"amount": 1000,
"transfer_date": "2023-07-20"
}
