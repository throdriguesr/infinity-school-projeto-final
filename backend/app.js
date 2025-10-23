// Importar o Express
const express = require('express');

// Criar a aplicação
const app = express();
const port = 3000; // A porta que o servidor vai usar

// Configuração importante: Permite que o servidor entenda JSON (dados enviados)
app.use(express.json());

// Configuração importante: Permite que o frontend acesse o backend (CORS)
// Para um projeto simples, podemos liberar todas as origens, mas em um real, restringiria.

// Exemplo de Banco de Dados Simples (em memória)
let recursosInventario = [
    { id: 1, nome: "Câmera de Vigilância 4K", localizacao: "Entrada Principal", status: "Ativo" },
    { id: 2, nome: "Batmóvel", localizacao: "Subsolo B2", status: "Manutenção" },
    { id: 3, nome: "Colete Balístico Tipo A", localizacao: "Arsenal Pessoal", status: "Ativo" }
];

// ROTAS DO SISTEMA DE GERENCIAMENTO DE SEGURANÇA (Autenticação básica)

// Rota de Login (Simples - só verifica se o usuário e senha existem)
app.post('/api/login', (req, res) => {
    // Pega o que o frontend enviou
    const { usuario, senha } = req.body; 

    // Simulação de verificação de usuário
    if (usuario === 'admin' && senha === 'senha123') {
        // Se estiver certo, envia um token simples e o tipo de usuário
        res.status(200).json({ 
            mensagem: 'Login bem-sucedido!',
            token: 'TOKEN_ADMIN_12345',
            tipoUsuario: 'administrador'
        });
    } else {
        // Se estiver errado
        res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }
});


// ROTAS DE GESTÃO DE RECURSOS (Inventário)

// Rota 1: LISTAR todos os recursos
app.get('/api/recursos', (req, res) => {
    // Retorna a lista de recursos que temos no nosso "banco de dados"
    res.status(200).json(recursosInventario);
});

// Rota 2: ADICIONAR um novo recurso
app.post('/api/recursos', (req, res) => {
    // Pega o novo recurso do frontend
    const novoRecurso = req.body;
    // Cria um ID simples para ele
    novoRecurso.id = recursosInventario.length + 1; 

    // Adiciona à lista
    recursosInventario.push(novoRecurso);

    // Retorna o recurso criado
    res.status(201).json(novoRecurso);
});

// Rota 3: REMOVER um recurso
// é usado :id para dizer ao Express que esperamos um ID na URL (ex: /api/recursos/2)
app.delete('/api/recursos/:id', (req, res) => {
    // O req.params.id vem como string, precisamos converter para número
    const idParaRemover = parseInt(req.params.id); 

    // Encontra o índice (posição) do recurso na nossa lista (array)
    const indice = recursosInventario.findIndex(recurso => recurso.id === idParaRemover);

    // Se o recurso for encontrado (indice for maior ou igual a 0)
    if (indice !== -1) {
        // Remove 1 item a partir daquela posição
        recursosInventario.splice(indice, 1);
        // Resposta de sucesso sem conteúdo
        res.status(204).send(); 
        console.log(`Recurso com ID ${idParaRemover} removido.`);
    } else {
        // Resposta de erro se o recurso não for encontrado
        res.status(404).json({ mensagem: 'Recurso não encontrado.' });
    }
});

// INICIAR O SERVIDOR

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Backend iniciado. Agora, abra o arquivo frontend/index.html no seu navegador.');
});