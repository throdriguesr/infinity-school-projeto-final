// 1. Variáveis importantes (selecionando os elementos HTML)
const loginForm = document.getElementById('login-form');
const dashboardSection = document.getElementById('dashboard-section');
const loginSection = document.getElementById('login-section');
const mensagemErro = document.getElementById('mensagem-erro');
const listaRecursos = document.getElementById('lista-recursos');
const adicionarRecursoForm = document.getElementById('adicionar-recurso-form');

// URL base do backend
const API_URL = 'http://localhost:3000/api'; 

// 2. FUNÇÃO DE LOGIN

// Adiciona uma função que é chamada quando o formulário de login é enviado
loginForm.addEventListener('submit', async (e) => {
    // Previne que a página recarregue ao enviar o formulário
    e.preventDefault(); 

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        // Faz uma requisição POST para a rota /api/login no backend
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Envia os dados de usuário e senha no corpo da requisição
            body: JSON.stringify({ usuario, senha })
        });

        // Se o status da resposta for 200 (OK)
        if (response.ok) {
            const data = await response.json();
            // Sucesso!
            console.log("Login bem-sucedido:", data);
            
            // Esconde a tela de login
            loginSection.style.display = 'none'; 
            // Mostra o dashboard
            dashboardSection.style.display = 'block'; 
            
            // Salva o token (simulação de autenticação) e carrega os recursos
            localStorage.setItem('userToken', data.token);
            carregarRecursos(); // Chama a função para buscar os dados do inventário

        } else {
            // Falha no login
            mensagemErro.style.display = 'block';
            console.error("Erro de login.");
        }
    } catch (error) {
        console.error("Erro ao comunicar com o servidor:", error);
        mensagemErro.textContent = 'Erro de conexão com o servidor.';
        mensagemErro.style.display = 'block';
    }
});


// 3. FUNÇÃO PARA CARREGAR RECURSOS (Inventário)

async function carregarRecursos() {
    try {
        // Faz uma requisição GET para a rota /api/recursos
        const response = await fetch(`${API_URL}/recursos`);
        
        if (response.ok) {
            const recursos = await response.json();
            
            // Limpa a lista atual no HTML
            listaRecursos.innerHTML = ''; 
            
            // Para cada item na lista, cria um elemento <li> e adiciona à página
            recursos.forEach(recurso => {
                const li = document.createElement('li');
                li.textContent = `${recurso.nome} - Local: ${recurso.localizacao} (${recurso.status})`;
                listaRecursos.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar recursos:", error);
    }
}


// 4. FUNÇÃO PARA ADICIONAR NOVO RECURSO

adicionarRecursoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('novo-nome').value;
    const localizacao = document.getElementById('novo-local').value;

    const novoRecurso = {
        nome: nome,
        localizacao: localizacao,
        status: 'Ativo' // Define um status padrão
    };

    try {
        // Faz uma requisição POST para a rota /api/recursos
        const response = await fetch(`${API_URL}/recursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Em um projeto real, enviaria o token de segurança aqui
                // 'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
            },
            body: JSON.stringify(novoRecurso)
        });

        if (response.ok) {
            alert('Recurso adicionado com sucesso!');
            adicionarRecursoForm.reset(); // Limpa o formulário
            carregarRecursos(); // Recarrega a lista para mostrar o novo item
        } else {
            alert('Erro ao adicionar recurso. Tente novamente.');
        }
    } catch (error) {
        console.error("Erro ao adicionar recurso:", error);
    }
});

// A função de login é a primeira a ser chamada, e o carregamento dos recursos é feito só *depois* do login.