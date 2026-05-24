# Trabalho - Desenvolvimento em JavaScript

## Reconstrucao do Sistema Central

**Empresa:** Anhanguera Solutions  
**Tema:** Reconstrucao dos modulos internos usando JavaScript  
**Nivel:** 3o semestre de ADS

## Objetivo

Este projeto simula a recuperacao dos sistemas internos da Anhanguera Solutions depois de um ataque cibernetico.

O sistema foi dividido em etapas:

1. Cadastro inicial de agentes;
2. Controle de seguranca com validacao de usuario e senha;
3. Banco de dados temporario em memoria;
4. Comunicacao interna por mensagens;
5. Central de inteligencia com filtros, estatisticas e JSON;
6. Interface dinamica com HTML, CSS e JavaScript;
7. Conexao externa usando API publica;
8. API REST para gerenciamento de agentes;
9. Integracao final entre Front-End e Back-End.

## Estrutura

```text
aula15-javascript-trabalho/
|-- frontend/
|   |-- index.html
|   |-- style.css
|   |-- app.js
|
|-- api/
|   |-- server.js
|
|-- evidencias/
|   |-- exemplos-de-teste.txt
|
|-- README.md
```

## Como executar

### 1. Rodar a API

No terminal, entre na pasta `api` e execute:

```bash
node server.js
```

A API vai iniciar em:

```text
http://localhost:3000
```

### 2. Abrir o Front-End

Abra o arquivo:

```text
frontend/index.html
```

O sistema permite cadastrar, listar, atualizar e remover agentes usando a API.

## Usuarios de teste

```text
Usuario: operador
Senha: 123
Nivel: basico
```

```text
Usuario: lider
Senha: 456
Nivel: operacional
```

```text
Usuario: admin
Senha: 789
Nivel: master
```

## Endpoints da API

| Metodo | Rota | Funcao |
|---|---|---|
| GET | /agentes | Lista agentes |
| GET | /agentes/:id | Busca um agente |
| POST | /agentes | Cadastra agente |
| PUT | /agentes/:id | Atualiza agente |
| DELETE | /agentes/:id | Remove agente |
| GET | /externa | Consome dados externos de exemplo |

## Conclusao

O projeto reconstruiu os principais modulos do sistema central da Anhanguera Solutions usando JavaScript. Foram usados conceitos de objetos, arrays, funcoes, validacao, DOM, JSON, fetch e API REST.
