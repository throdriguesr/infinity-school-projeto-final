# 🦇 Sistema de Gerenciamento de Segurança e Recursos das Indústrias Wayne

## Projeto Final - Desenvolvimento Web Full Stack

Este projeto é uma aplicação web full stack desenvolvida como projeto final de curso. Seu objetivo é otimizar os processos internos e melhorar a segurança das instalações da renomada **Indústrias Wayne** em Gotham City, conforme a proposta do projeto.

A plataforma integra gerenciamento de acesso, controle de inventário de segurança e um painel de visualização centralizado.

---

## Requisitos e Funcionalidades Implementadas

O sistema atende aos seguintes módulos e requisitos funcionais:

### 1. Sistema de Gerenciamento de Segurança (Acesso e Autenticação)
* **Controle de Acesso:** Implementado através de uma tela de login que valida usuários autorizados.
* **Autenticação Simples:** Fluxo de login que verifica credenciais e simula a diferenciação de tipo de usuário (`administrador`).

### 2. Gestão de Recursos (Inventário)
* **Interface de Gerenciamento:** Interface no Dashboard para visualização e manipulação do inventário.
* **Controle de Inventário (CRUD - Criação e Leitura):** Funcionalidade para **Listar** recursos existentes e **Adicionar** novos itens ao inventário de segurança.
* **Administração:** Permissão para administradores adicionar novos recursos.

### 3. Dashboard de Visualização
* **Painel de Controle:** Painel acessível após o login, centralizando as informações.
* **Exibição de Dados:** Apresentação da lista de recursos do inventário, simulando a visualização de dados relevantes de segurança.

---

## Tecnologias Utilizadas (Stack)

Esta solução é um protótipo funcional, demonstrando a integração entre Frontend e Backend:

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Backend (Servidor)** | **Node.js** | Ambiente de execução leve e eficiente. |
| **Framework Web** | **Express.js** | Framework minimalista para criação de rotas de API RESTful. |
| **Frontend (Interface)** | **HTML5, CSS3 (Vanilla)** | Estrutura e estilo da interface. |
| **Interatividade** | **JavaScript (Vanilla)** | Lógica de interação e comunicação assíncrona (`Fetch API`) com o backend. |
| **Banco de Dados (Protótipo)** | **Estrutura de Dados em Memória** | Simulação do armazenamento dos dados de inventário para o protótipo. |
| **Gerenciamento de Pacotes** | **npm** | Utilizado para instalar e gerenciar as dependências do servidor. |

---

## Como Executar o Projeto

Siga os passos abaixo para subir a aplicação na sua máquina local.

### 1. Pré-requisitos
* **Node.js e npm:** Certifique-se de ter o Node.js e o Gerenciador de Pacotes `npm` instalados.

### 2. Configuração e Inicialização do Backend

1.  Acesse a pasta do backend no terminal:
    ```bash
    cd projeto-wayne/backend
    ```
2.  Instale as dependências (somente o Express):
    ```bash
    npm install
    ```
3.  Inicie o servidor Node.js (mantenha este terminal aberto):
    ```bash
    node app.js
    ```
    *O servidor deve iniciar e estar ouvindo na porta `http://localhost:3000`.*

### 3. Acesso ao Frontend

1.  Navegue até a pasta do frontend:
    ```bash
    cd ../frontend
    ```
2.  Simplesmente **abra o arquivo `index.html`** em seu navegador web (Chrome, Firefox, etc.).

> **⚠️ Atenção:** O frontend depende do backend estar rodando na porta 3000 para buscar os dados de inventário e realizar o login.

### 4. Credenciais de Teste

Utilize as seguintes credenciais para realizar o login e acessar o Dashboard:

| Tipo de Usuário | Usuário | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `senha123` |