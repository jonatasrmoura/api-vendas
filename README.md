# Estrutura do Projeto

## Estrutura de pastas:

[*] config - configurações de bibliotecas externas, como por exemplo, autenticação, upload, email, etc.

[*] modules - abrangem as áreas de conhecimento da aplicação, diretamente relacionados com as regras de negócios da aplicação.
A princípio criaremos os seguintes módulos na aplicação: customers, products, orders e users.

[*] shared - módulos de uso geral compartilhando com mais de um módulo da aplicação, como por exemplo, o server.ts, o arquivo principal de rotas, conexão com banco de dados, seguindo esse principio.

[*] services - estarão dentro de cada módulo da aplicação e serão responsável por todas as regras que a aplicação precisa atender, como por exemplo:

- A senha deve ser armazenada com criptografia;
- Não pode haver mais de um produto com o mesmo nome;
- Não pode haver um mesmo email sendo usado por mais de um usuário;
- E muitas outras...

mkdir -p src/config
mkdir -p src/modules
mkdir -p src/shared/http
mv src/server.ts src/shared/http/server.ts

## Configurando o package.json
Dentro de "scripts" em "dev":
"dev": "ts-node-dev -r tsconfig-paths/register --inspect --transpile-only --ignore-watch node_modules src/shared/http/server.ts"

## Configurando as importações

Podemos usar um recurso que facilitará o processo de importação de arquivos em nosso projeto.
Iniciamos configurando o objryo paths do tsconfig.json, que permite criar uma base para cada path a ser buscado no projeto, funcionando de forma similar a um atalho:

"paths": {
  "@config/_": [
    "src/config/_"
  ],
  "@modules/_": [
    "src/modules/_"
  ],
  "@shared/_": [
    "src/shared/_"
  ]
},

Agora, para importar qualquer arquivo no projeto, inicie o caminho com um dos paths configurados, usando o CTRL+SPACE para usar o autocomplete.
