# WAYNE ENTERPRISES - Sistema de Gerenciamento de Segurança

Este projeto é um sistema web básico para gerenciamento de segurança e recursos, desenvolvido para simular um ambiente de trabalho da **Wayne Enterprises**. O foco está no controle de acesso e na exibição de um painel de gerenciamento com diferentes níveis de permissão.

---

## 🌟 Visão Geral

O sistema simula um ambiente de gerenciamento de recursos com foco em três níveis de acesso distintos, cada um com diferentes permissões para manipulação de dados:

1.  **Administrador (Total)**
2.  **Gerente (Intermediário)**
3.  **Funcionário (Restrito/Visualização)**

## 💻 Tecnologias Utilizadas

O projeto é uma aplicação Single Page Application (SPA) desenvolvida com as seguintes tecnologias e bibliotecas front-end:

* **HTML5** (`index.html`): Estrutura semântica e esqueleto do sistema.
* **CSS3** (`style.css`): Estilização, design responsivo e tema visual.
* **JavaScript (Puro)** (`script.js`): Lógica de programação para controle de acesso, manipulação de DOM e gerenciamento de dados.
* **Chart.js**: Biblioteca utilizada para gerar o gráfico de visualização de recursos no Painel de Controle.

## 🔑 Funcionalidades de Controle de Acesso

O sistema gerencia a autenticação e autorização por meio de formulários interativos.

| Funcionalidade | Descrição |
| :--- | :--- |
| **Login e Logout** | Permite a autenticação de usuários cadastrados e o encerramento seguro da sessão, retornando ao painel de controle de acesso. |
| **Cadastro de Usuário** | Permite registrar novos usuários definindo **Nome de Usuário**, **E-mail**, **Senha**, **Confirmação de Senha** e **Tipo de Usuário** (`administrador`, `gerente`, `funcionario`). |
| **Recuperação de Senha** | Simulação do processo de recuperação, solicitando o e-mail do usuário. |
| **Níveis de Acesso** | As permissões são definidas com base no campo `tipo` do usuário (`administrador`, `gerente`, `funcionario`) e controlam as ações liberadas no gerenciamento de recursos. |
| **Persistência de Dados** | Os dados de usuários e recursos são armazenados e carregados utilizando o **`localStorage`** do navegador. |

## 📊 Funcionalidades de Gerenciamento de Recursos

O painel de gerenciamento (acessível após o login) permite a manipulação de recursos com base no nível de permissão.

| Ação | Administrador | Gerente | Funcionário |
| :--- | :--- | :--- | :--- |
| **Adicionar Recurso** | ✅ Sim | ✅ Sim | ❌ Não |
| **Editar Recurso** | ✅ Sim | ✅ Sim | ❌ Não |
| **Remover Recurso (Individual)** | ✅ Sim | ❌ Não | ❌ Não |
| **Remover Todos os Recursos** | ✅ Sim | ❌ Não | ❌ Não |
| **Visualizar Lista de Recursos** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Filtrar Recursos** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Visualizar Gráfico**| ✅ Sim | ✅ Sim | ✅ Sim |

## 🚀 Como Executar o Projeto

1.  **Download:** Baixe ou clone os arquivos do projeto (`index.html`, `style.css`, `script.js`).
2.  **Estrutura:** Mantenha os três arquivos (e as imagens utilizadas, `logo-gold.png` e `Wayne-E-thumb.png`) na mesma pasta.
3.  **Execução:** Abra o arquivo **`index.html`** em qualquer navegador web moderno (Google Chrome é o recomendado).
4.  **Primeiro Uso:** Utilize o botão **"Novo Usuário"** na tela de **Controle de Acesso** para criar sua primeira conta e iniciar o sistema.