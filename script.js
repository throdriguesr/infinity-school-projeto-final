let usuarios = [];
let recursos = [];
let usuarioLogado = null;
let graficoAtual = null;

const carregarUsuarios = () => {
    const usuariosSalvos = localStorage.getItem('usuarios');
    if (usuariosSalvos) {
        usuarios = JSON.parse(usuariosSalvos);
    }
};

const carregarRecursos = () => {
    const recursosSalvos = localStorage.getItem('recursos');
    if (recursosSalvos) {
        recursos = JSON.parse(recursosSalvos);
    }
};

const cadastrarUsuario = (usuario, senha, confirmacaoSenha, tipo, email, codigoAdmin) => {
    if (!usuario || !senha || !confirmacaoSenha || !tipo || !email) {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido!");
        return;
    }

    if (senha !== confirmacaoSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const usuarioExistente = usuarios.find(u => u.nome === usuario);
    const emailExistente = usuarios.find(u => u.email === email);
    
    if (usuarioExistente) {
        alert("Já existe um usuário cadastrado com este nome!");
        return;
    }

    if (emailExistente) {
        alert("Já existe um usuário cadastrado com este email!");
        return;
    }

    if ((tipo === "administrador" || tipo === "gerente" || tipo === "funcionario") && !codigoAdmin) {
        alert("O campo 'Código do Usuário' deve ser preenchido.");
        return;
    }

    usuarios.push({ nome: usuario, senha, tipo, email, codigoAdmin });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert("Cadastro realizado com sucesso!");

    document.querySelector("#novoUsuario").value = '';
    document.querySelector("#emailUsuario").value = '';
    document.querySelector("#novaSenha").value = '';
    document.querySelector("#confirmacaoSenha").value = '';
    document.querySelector("#tipoUsuario").value = '';
    document.querySelector("#codigoAdmin").value = '';

    document.querySelector("#cadastro").style.display = "none";
    document.querySelector("#controleAcesso").style.display = "block";
    document.querySelector("#usuario").value = '';
    document.querySelector("#senha").value = '';
};

document.querySelector("#cancelarCadastro").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja cancelar? Todos os dados serão perdidos.")) {
        document.querySelector("#novoUsuario").value = '';
        document.querySelector("#emailUsuario").value = '';
        document.querySelector("#novaSenha").value = '';
        document.querySelector("#confirmacaoSenha").value = '';
        document.querySelector("#codigoAdmin").value = '';
        document.querySelector("#tipoUsuario").value = '';

        document.querySelector("#controleAcesso").style.display = "block";
        document.querySelector("#cadastro").style.display = "none";
        document.querySelector("#usuario").value = '';
        document.querySelector("#senha").value = '';
    } else {
        document.querySelector("#cadastro").style.display = "block";
    }
});

const esqueciSenhaButton = document.querySelector('#esqueciSenhaButton');

esqueciSenhaButton.addEventListener('click', () => {
    let emailDigitado;
    do {
        emailDigitado = prompt('Digite seu e-mail cadastrado:');
        if (emailDigitado === null) {
            return;
        }
        if (emailDigitado.trim() === '') {
            alert('O e-mail não pode ser vazio. Tente novamente.');
        }
    } while (emailDigitado === null || emailDigitado.trim() === '' || !tratarRecuperacaoSenha(emailDigitado));
});

const tratarRecuperacaoSenha = (email) => {
    const usuarioEncontrado = usuarios.find(usuario => usuario.email === email);
    
    if (usuarioEncontrado) {
        alert(`Instruções para recuperação de senha foram enviadas para o e-mail: ${usuarioEncontrado.email}`);
        return true; 
    } else {
        alert('E-mail não encontrado. Por favor, verifique e tente novamente.');
        return false; 
    }
};

const adicionarRecurso = () => {
    const nome = document.querySelector("#nomeRecurso").value;
    const categoria = document.querySelector("#categoriaRecurso").value;
    const quantidade = document.querySelector("#quantidadeRecurso").value;
    const descricao = document.querySelector("#descricaoRecurso").value;
    const prioridade = document.querySelector("#prioridadeRecurso").value;

    const capitalizar = (str) => {
        if (str.toLowerCase() === "dispositivos de segurança") {
            return "Dispositivos de Segurança";
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    if (!nome || !categoria || !quantidade || !descricao || !prioridade) {
        alert("Por favor, preencha todos os campos do Gerenciamento de Recursos.");
        return;
    }

    const recursoExistente = recursos.find(recurso => recurso.nome.toLowerCase() === capitalizar(nome).toLowerCase());
    if (recursoExistente) {
        alert(`O recurso "${capitalizar(nome)}" já está cadastrado.`);
        limparCampos();
        return; 
    }

    const novoRecurso = {
        nome: capitalizar(nome),
        categoria: capitalizar(categoria),
        quantidade: parseInt(quantidade),
        descricao: capitalizar(descricao),
        prioridade: capitalizar(prioridade)
    };

    recursos.unshift(novoRecurso);
    localStorage.setItem('recursos', JSON.stringify(recursos));
    atualizarListaRecursos();
    document.querySelector("#listaRecursosCard").style.display = "block";
    alert("Recurso adicionado com sucesso!");
    limparCampos();
    atualizarGrafico(novoRecurso.nome, novoRecurso.quantidade);
};

const limparCampos = () => {
    document.querySelector("#nomeRecurso").value = '';
    document.querySelector("#categoriaRecurso").value = '';
    document.querySelector("#quantidadeRecurso").value = '';
    document.querySelector("#descricaoRecurso").value = '';
    document.querySelector("#prioridadeRecurso").value = '';
};

const capitalizar = texto => texto.charAt(0).toUpperCase() + texto.slice(1);

const verificarIndiceValido = (indice, limite) => {
    const numero = parseInt(indice);
    return !isNaN(numero) && numero > 0 && numero <= limite;
};

const editarRecurso = (nome, usuario) => {
    document.querySelector("#nomeRecurso").value = "";
    document.querySelector("#categoriaRecurso").value = "";
    document.querySelector("#quantidadeRecurso").value = "";
    document.querySelector("#descricaoRecurso").value = "";
    document.querySelector("#prioridadeRecurso").value = "";

    if (usuario.tipo !== "administrador" && usuario.tipo !== "gerente") {
        alert("Apenas Administradores e Gerentes podem editar recursos.");
        return;
    }

    const recurso = recursos.find(r => r.nome.toLowerCase() === nome.toLowerCase());
    if (recurso) {
        const campos = [
            "Nome",
            "Categoria",
            "Quantidade",
            "Descrição",
            "Prioridade",
            "Todos"
        ];

        let alterado = false;

        while (true) {
            const campoEscolhidoPrompt = campos.map((campo, index) => `${index + 1}: Editar ${campo}`).join("\n");
            const campoEscolhido = prompt(`Escolha qual campo deseja editar:\n${campoEscolhidoPrompt}`);

            if (campoEscolhido === null) {
                if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                    alert("Edição cancelada. Nenhuma alteração foi feita.");
                    return;
                } else {
                    continue;
                }
            }

            if (campoEscolhido.trim() === "") {
                alert("Opção inválida. Por favor escolha um número de 1 a 6.");
                continue;
            }

            const categorias = ["Equipamentos", "Veículos", "Dispositivos de Segurança", "Outros"];
            const prioridades = ["Alta", "Média", "Baixa"];

            switch (campoEscolhido) {
                case "1": 
                    let novoNome;
                    while (true) {
                        novoNome = prompt(`Digite o novo nome do recurso (não pode estar em branco):`);
                        if (novoNome === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (novoNome.trim() === "") {
                            alert("Por favor, altere o nome do recurso.");
                        } else if (recursos.some(r => r.nome.toLowerCase() === capitalizar(novoNome).toLowerCase())) {
                            alert("Já existe um recurso cadastrado com este nome. A edição não pode ser realizada.");
                        } else {
                            recurso.nome = capitalizar(novoNome);
                            alterado = true;
                            break; 
                        }
                    }
                    break;

                case "2": 
                    const categoriaPrompt = categorias.map((cat, index) => `${index + 1}: ${cat}`).join("\n");
                    let categoriaEscolhida;
                    while (true) {
                        categoriaEscolhida = prompt(`Escolha a nova categoria do recurso:\n${categoriaPrompt}`);
                        if (categoriaEscolhida === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (!verificarIndiceValido(categoriaEscolhida, categorias.length)) {
                            alert("Categoria inválida. Tente novamente.");
                        } else {
                            recurso.categoria = categorias[parseInt(categoriaEscolhida) - 1];
                            alterado = true;
                            break; 
                        }
                    }
                    break;

                case "3": 
                    let novaQuantidade;
                    while (true) {
                        novaQuantidade = prompt(`Digite a nova quantidade do recurso (número positivo):`);
                        if (novaQuantidade === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (novaQuantidade.trim() === "") {
                            alert("Por favor, digite um número positivo para a quantidade.");
                        } else {
                            const quantidadeConvertida = parseInt(novaQuantidade);
                            if (!isNaN(quantidadeConvertida) && quantidadeConvertida > 0) {
                                recurso.quantidade = quantidadeConvertida;
                                alterado = true;
                                break; 
                            } else {
                                alert("A quantidade deve ser um número positivo. Tente novamente.");
                            }
                        }
                    }
                    break;

                case "4": 
                    let novaDescricao;
                    while (true) {
                        novaDescricao = prompt(`Digite a nova descrição do recurso (não pode estar em branco):`);
                        if (novaDescricao === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (novaDescricao.trim() === "") {
                            alert("Por favor, altere a descrição do recurso.");
                        } else if (recursos.some(r => r.descricao.toLowerCase() === capitalizar(novaDescricao).toLowerCase())) {
                            alert("Já existe um recurso cadastrado com esta descrição. A edição não pode ser realizada.");
                        } else {
                            recurso.descricao = capitalizar(novaDescricao);
                            alterado = true;
                            break; 
                        }
                    }
                    break;

                case "5": 
                    let prioridadeEscolhida;
                    const prioridadePrompt = prioridades.map((pri, index) => `${index + 1}: ${pri}`).join("\n");
                    while (true) {
                        prioridadeEscolhida = prompt(`Escolha a nova prioridade do recurso:\n${prioridadePrompt}`);
                        if (prioridadeEscolhida === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (!verificarIndiceValido(prioridadeEscolhida, prioridades.length)) {
                            alert("Prioridade inválida. Tente novamente.");
                        } else {
                            recurso.prioridade = prioridades[parseInt(prioridadeEscolhida) - 1];
                            alterado = true;
                            break; 
                        }
                    }
                    break;

                case "6": 
                    let novoNomeTodos;
                    while (true) {
                        novoNomeTodos = prompt(`Digite o novo nome do recurso (não pode estar em branco):`);
                        if (novoNomeTodos === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (novoNomeTodos.trim() === "") {
                            alert("Por favor, altere o nome do recurso.");
                        } else if (recursos.some(r => r.nome.toLowerCase() === capitalizar(novoNomeTodos).toLowerCase())) {
                            alert("Já existe um recurso cadastrado com este nome. A edição não pode ser realizada.");
                        } else {
                            recurso.nome = capitalizar(novoNomeTodos);
                            alterado = true;
                            break; 
                        }
                    }

                    const categoriaPromptTodos = categorias.map((cat, index) => `${index + 1}: ${cat}`).join("\n");
                    let categoriaEscolhidaTodos;
                    while (true) {
                        categoriaEscolhidaTodos = prompt(`Escolha a nova categoria do recurso:\n${categoriaPromptTodos}`);
                        if (categoriaEscolhidaTodos === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (!verificarIndiceValido(categoriaEscolhidaTodos, categorias.length)) {
                            alert("Categoria inválida. Tente novamente.");
                        } else {
                            recurso.categoria = categorias[parseInt(categoriaEscolhidaTodos) - 1];
                            alterado = true;
                            break; 
                        }
                    }

                    let novaQuantidadeTodos;
                    while (true) {
                        novaQuantidadeTodos = prompt(`Digite a nova quantidade do recurso (número positivo):`);
                        if (novaQuantidadeTodos === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (novaQuantidadeTodos.trim() === "") {
                            alert("Por favor, digite um número positivo para a quantidade.");
                        } else {
                            const quantidadeConvertidaTodos = parseInt(novaQuantidadeTodos);
                            if (!isNaN(quantidadeConvertidaTodos) && quantidadeConvertidaTodos > 0) {
                                recurso.quantidade = quantidadeConvertidaTodos;
                                alterado = true;
                                break; 
                            } else {
                                alert("A quantidade deve ser um número positivo. Tente novamente.");
                            }
                        }
                    }

                    let novaDescricaoTodos;
                    while (true) {
                        novaDescricaoTodos = prompt(`Digite a nova descrição do recurso (não pode estar em branco):`);
                        if (novaDescricaoTodos === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (novaDescricaoTodos.trim() === "") {
                            alert("Por favor, altere a descrição do recurso.");
                        } else if (recursos.some(r => r.descricao.toLowerCase() === capitalizar(novaDescricaoTodos).toLowerCase())) {
                            alert("Já existe um recurso cadastrado com esta descrição. A edição não pode ser realizada.");
                        } else {
                            recurso.descricao = capitalizar(novaDescricaoTodos);
                            alterado = true;
                            break; 
                        }
                    }

                    let prioridadeEscolhidaTodos;
                    const prioridadePromptTodos = prioridades.map((pri, index) => `${index + 1}: ${pri}`).join("\n");
                    while (true) {
                        prioridadeEscolhidaTodos = prompt(`Escolha a nova prioridade do recurso:\n${prioridadePromptTodos}`);
                        if (prioridadeEscolhidaTodos === null) {
                            if (confirm("Você tem certeza que deseja cancelar a edição?")) {
                                alert("Edição cancelada. Nenhuma alteração foi feita.");
                                return;
                            } else {
                                continue;
                            }
                        }
                        if (!verificarIndiceValido(prioridadeEscolhidaTodos, prioridades.length)) {
                            alert("Prioridade inválida. Tente novamente.");
                        } else {
                            recurso.prioridade = prioridades[parseInt(prioridadeEscolhidaTodos) - 1];
                            alterado = true;
                            break; 
                        }
                    }
                    break;

                default:
                    alert("Opção inválida. Por favor escolha um número de 1 a 6.");
                    continue;
            }

            if (alterado) {
                localStorage.setItem('recursos', JSON.stringify(recursos));
                atualizarListaRecursos();
                atualizarGrafico();
                alert("Recurso editado com sucesso.");
                break;
            } else {
                alert("Nenhum campo foi alterado. Voltando ao menu de edição.");
            }
        }
    } else {
        alert("Recurso não encontrado.");
    }
};

const removerRecurso = (nome, usuario) => {
    document.querySelector("#nomeRecurso").value = "";
    document.querySelector("#categoriaRecurso").value = "";
    document.querySelector("#quantidadeRecurso").value = "";
    document.querySelector("#descricaoRecurso").value = "";
    document.querySelector("#prioridadeRecurso").value = "";

    if (usuario.tipo !== "administrador") {
        alert("Apenas Administradores podem remover recursos.");
        return;
    }

    if (confirm(`Tem certeza que deseja remover o recurso "${nome}"?`)) {
        recursos = recursos.filter(recurso => recurso.nome !== nome);
        localStorage.setItem('recursos', JSON.stringify(recursos));
        atualizarListaRecursos();
        atualizarGrafico();
    }
};

const acionarEditarRecurso = (nome, usuario) => {
    if (usuario.tipo !== "administrador" || usuario.tipo !== 'gerente') {
        alert("Apenas Administradores e Gerentes podem editar recursos.");
        return;
    }
    editarRecurso(nome, usuario);
};

const acionarRemoverRecurso = (nome, usuario) => {
    if (usuario.tipo !== "administrador") {
        alert("Apenas Administradores podem remover recursos.");
        return;
    }
    removerRecurso(nome, usuario);
};

const fazerLogin = () => {
    const usuario = document.querySelector("#usuario").value;
    const senha = document.querySelector("#senha").value;

    if (!usuario || !senha) {
        alert("Por favor, preencha ambos os campos de usuário e senha.");
        return;
    }

    const usuarioAutenticado = usuarios.find(u => u.nome === usuario && u.senha === senha);
    if (usuarioAutenticado) {
        usuarioLogado = usuarioAutenticado;

        const nomeFormatado = usuarioLogado.nome.charAt(0).toUpperCase() + usuarioLogado.nome.slice(1).toLowerCase();
        
        const tipoFormatado = usuarioLogado.tipo === "funcionario" 
            ? "Funcionário" 
            : usuarioLogado.tipo.charAt(0).toUpperCase() + usuarioLogado.tipo.slice(1).toLowerCase();
        
        document.querySelector("#boasVindas").innerHTML = `
            Bem-vindo, <span id="usuarioNome" class="usuario-nome">${nomeFormatado}</span> !
            <p>Você está logado como: <span id="nivelCredencial" class="nivel-credencial ${usuarioLogado.tipo}">${tipoFormatado}</span> ..</p>
        `;

        exibirPainel(usuarioAutenticado.tipo);
        document.querySelector("#boasVindas").style.display = "block";
        document.querySelector("#userIdentification").style.display = "block";
        document.querySelector("#listaRecursosCard").style.display = "block";
    } else {
        alert("Usuário ou senha incorretos.");
    }
};

const exibirPainel = (tipo) => {
    document.querySelector("#controleAcesso").style.display = "none";
    document.querySelector("#gerenciamentoRecursos").style.display = "none";
    document.querySelector("#painelControle").style.display = "none";

    if (tipo === "administrador" || tipo === "gerente" || tipo === "funcionario") {
        alert(`Você tem Acesso: ${tipo === "administrador" ? 'Total ao Sistema' : (tipo === "gerente" ? 'Intermediário ao Sistema' : 'Restrito ao Sistma')}.`);

        document.querySelector("#painelControle").style.display = "block";
        document.querySelector("#gerenciamentoRecursos").style.display = "block";
    }

    atualizarListaRecursos();
    atualizarGrafico();
};

const fazerLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
        usuarioLogado = null;
        document.querySelector("#usuario").value = ''; 
        document.querySelector("#senha").value = ''; 
        document.querySelector("#controleAcesso").style.display = "block";
        document.querySelector("#userIdentification").style.display = "none";
        document.querySelector("#gerenciamentoRecursos").style.display = "none";
        document.querySelector("#painelControle").style.display = "none";
        document.querySelector("#cadastro").style.display = "none";
        document.querySelector("#listaRecursosCard").style.display ="none";
    }
};

const filtrarRecursos = () => {
    document.querySelector("#nomeRecurso").value = "";
    document.querySelector("#categoriaRecurso").value = "";
    document.querySelector("#quantidadeRecurso").value = "";
    document.querySelector("#descricaoRecurso").value = "";
    document.querySelector("#prioridadeRecurso").value = "";

    let opcao = prompt(
        "Escolha o critério de filtragem:\n" +
        "1. Nome\n" +
        "2. Categoria\n" +
        "3. Quantidade\n" +
        "4. Descrição\n" +
        "5. Prioridade\n" +
        "6. Mostrar todos os recursos\n" +
        "Digite o número correspondente ao critério desejado:"
    );

    if (opcao === null) {
        alert("Filtragem cancelada.");
        return;
    }

    if (!/^[1-6]$/.test(opcao)) {
        alert("Entrada inválida! Por favor, insira um número de 1 a 6.");
        return filtrarRecursos(); 
    }

    let recursosFiltrados = recursos;

    switch (opcao) {
        case "1":
            let filtragemNome;
            do {
                filtragemNome = prompt("Digite o nome exato do recurso para filtrar:");
                if (filtragemNome === null) {
                    alert("Filtragem cancelada.");
                    return;
                }
                filtragemNome = filtragemNome.trim().toLowerCase();

                if (filtragemNome === "") {
                    alert("Nome não pode estar vazio. Por favor, insira um nome válido.");
                }
            } while (filtragemNome === "");
            recursosFiltrados = recursosFiltrados.filter(recurso =>
                recurso.nome.toLowerCase() === filtragemNome
            );
            break;

        case "2":
            let categoriaEscolha;
            do {
                categoriaEscolha = prompt(
                    "Escolha a categoria do recurso:\n" +
                    "1. Equipamentos\n" +
                    "2. Veículos\n" +
                    "3. Dispositivos de Segurança\n" +
                    "4. Outros\n"
                );
                if (categoriaEscolha === null) {
                    alert("Filtragem cancelada.");
                    return;
                }
                if (!["1", "2", "3", "4"].includes(categoriaEscolha)) {
                    alert("Categoria inválida! Por favor, escolha uma categoria válida.");
                }
            } while (!["1", "2", "3", "4"].includes(categoriaEscolha));

            let filtragemCategoria;
            switch (categoriaEscolha) {
                case "1":
                    filtragemCategoria = "Equipamentos";
                    break;
                case "2":
                    filtragemCategoria = "Veículos";
                    break;
                case "3":
                    filtragemCategoria = "Dispositivos de Segurança";
                    break;
                case "4":
                    filtragemCategoria = "Outros";
                    break;
            }

            recursosFiltrados = recursosFiltrados.filter(recurso =>
                recurso.categoria === filtragemCategoria
            );
            break;

        case "3":
            let filtragemQuantidade;
            do {
                filtragemQuantidade = prompt("Digite a quantidade do recurso para filtrar (apenas números):");
                if (filtragemQuantidade === null) {
                    alert("Filtragem cancelada.");
                    return;
                }
                if (isNaN(filtragemQuantidade) || filtragemQuantidade === "") {
                    alert("Quantidade inválida! Por favor, insira um número válido.");
                }
            } while (isNaN(filtragemQuantidade) || filtragemQuantidade === "");
            filtragemQuantidade = parseInt(filtragemQuantidade, 10);
            recursosFiltrados = recursosFiltrados.filter(recurso =>
                recurso.quantidade === filtragemQuantidade
            );
            break;

        case "4":
            let filtragemDescricao;
            do {
                filtragemDescricao = prompt("Digite a descrição exata do recurso para filtrar:");
                if (filtragemDescricao === null) {
                    alert("Filtragem cancelada.");
                    return;
                }
                filtragemDescricao = filtragemDescricao.trim().toLowerCase();

                if (filtragemDescricao === "") {
                    alert("Descrição não pode estar vazia. Por favor, insira uma descrição válida.");
                }
            } while (filtragemDescricao === "");
            recursosFiltrados = recursosFiltrados.filter(recurso =>
                recurso.descricao.toLowerCase() === filtragemDescricao
            );
            break;

        case "5":
            let prioridadeEscolha;
            do {
                prioridadeEscolha = prompt(
                    "Escolha a prioridade do recurso:\n" +
                    "1. Alta\n" +
                    "2. Média\n" +
                    "3. Baixa\n"
                );
                if (prioridadeEscolha === null) {
                    alert("Filtragem cancelada.");
                    return;
                }
                if (!["1", "2", "3"].includes(prioridadeEscolha)) {
                    alert("Prioridade inválida! Por favor, escolha uma prioridade válida.");
                }
            } while (!["1", "2", "3"].includes(prioridadeEscolha));

            let filtragemPrioridade;
            switch (prioridadeEscolha) {
                case "1":
                    filtragemPrioridade = "Alta";
                    break;
                case "2":
                    filtragemPrioridade = "Média";
                    break;
                case "3":
                    filtragemPrioridade = "Baixa";
                    break;
            }

            recursosFiltrados = recursosFiltrados.filter(recurso =>
                recurso.prioridade === filtragemPrioridade
            );
            break;

        case "6":            
            recursosFiltrados = recursos;
            break;

        default:
            alert("Opção inválida.");
            return;
    }

    if (recursosFiltrados.length === 0) {
        alert("Nenhum recurso encontrado com o critério de filtragem adotado.");
        return filtrarRecursos(); 
    } else {
        alert(`Filtragem concluída com sucesso! ${recursosFiltrados.length} recursos encontrados.`);
        atualizarListaRecursos(recursosFiltrados); 
    }
};

const atualizarListaRecursos = (lista = recursos) => {
    const listaRecursos = document.querySelector("#listaRecursos");
    listaRecursos.innerHTML = '';

    lista.forEach(recurso => {
        const item = document.createElement("li");
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';

        const detalhesRecurso = document.createElement("div");
        detalhesRecurso.innerHTML = `
            <strong>Nome:</strong> ${recurso.nome}<br>
            <strong>Categoria:</strong> ${recurso.categoria}<br>
            <strong>Quantidade:</strong> ${recurso.quantidade}<br>
            <strong>Descrição:</strong> ${recurso.descricao}<br>
            <strong>Prioridade:</strong> ${recurso.prioridade}
        `;
        
        item.appendChild(detalhesRecurso);
        
        const botoesContainer = document.createElement("div");
        botoesContainer.style.display = 'flex';
        botoesContainer.style.gap = '10px';

        const editarBtn = document.createElement("button");
        editarBtn.className = "edit-button";
        editarBtn.textContent = "Editar";
        editarBtn.onclick = () => {
            if (usuarioLogado && usuarioLogado.tipo === "administrador" || usuarioLogado.tipo === 'gerente') {
                editarRecurso(recurso.nome, usuarioLogado);
            } else {
                alert("Apenas Administradores e Gerentes podem editar recursos.");
            }
        };

        const removerBtn = document.createElement("button");
        removerBtn.className = "remove-button"; 
        removerBtn.textContent = "Remover";
        removerBtn.onclick = () => {
            if (usuarioLogado && usuarioLogado.tipo === "administrador") {
                removerRecurso(recurso.nome, usuarioLogado);
            } else {
                alert("Apenas Administradores podem remover recursos.");
            }
        };

        botoesContainer.appendChild(editarBtn);
        botoesContainer.appendChild(removerBtn);
        item.appendChild(botoesContainer);
        listaRecursos.appendChild(item);
    });
}; 

const atualizarGrafico = () => {
    const graficoContainer = document.querySelector("#graficoContainer"); 
    graficoContainer.innerHTML = ""; 

    const canvas = document.createElement("canvas");
    canvas.id = 'graficoRecursos';
    graficoContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const labels = recursos.map(recurso => recurso.nome);
    const data = recursos.map(recurso => recurso.quantidade);

    if (graficoAtual) {
        graficoAtual.destroy();
    }

    graficoAtual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade de Recursos',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeOutBounce'
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

document.querySelector("#filtrarRecursos").addEventListener("click", filtrarRecursos);

document.querySelector("#tipoUsuario").addEventListener("change", (e) => {
    const tipoSelecionado = e.target.value;
    const codigoAdminContainer = document.querySelector("#codigoAdminContainer");
    codigoAdminContainer.style.display = ["administrador", "gerente", "funcionario"].includes(tipoSelecionado) ? "block" : "none";
});

document.querySelector("#adicionarRecurso").addEventListener("click", () => {
    const usuarioTipo = usuarioLogado?.tipo;
    if (usuarioTipo === 'administrador' || usuarioTipo === 'gerente') {
        adicionarRecurso();
    } else {
        alert("Apenas Administradores e Gerentes podem adicionar recursos.");
    }
});

document.querySelector("#logoutButton").addEventListener("click", fazerLogout);

document.querySelector("#voltarAoTopo").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener("scroll", () => {
    const button = document.querySelector("#voltarAoTopo");
    button.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
});

document.querySelector("#novoUsuarioButton").addEventListener("click", () => {
    document.querySelector("#controleAcesso").style.display = "none";
    document.querySelector("#cadastro").style.display = "block";
});

document.querySelector("#cadastrarUsuario").addEventListener("click", () => {
    const usuario = document.querySelector("#novoUsuario").value.trim();
    const email = document.querySelector("#emailUsuario").value.trim();
    const senha = document.querySelector("#novaSenha").value;
    const confirmacaoSenha = document.querySelector("#confirmacaoSenha").value;
    const codigoAdmin = document.querySelector("#codigoAdmin").value.trim();
    const tipoUsuario = document.querySelector("#tipoUsuario").value;

    let mensagensErro = [];

    if (!usuario) {
        mensagensErro.push("O campo 'Nome de Usuário' deve ser preenchido.");
    }
    if (!email) {
        mensagensErro.push("O campo 'Email' deve ser preenchido.");
    }
    if (!senha) {
        mensagensErro.push("O campo 'Senha' deve ser preenchido.");
    }
    if (!confirmacaoSenha) {
        mensagensErro.push("O campo 'Confirmação de Senha' deve ser preenchido.");
    }
    if (!codigoAdmin && (tipoUsuario === "administrador" || tipoUsuario === "gerente" || tipoUsuario === "funcionario")) {
        mensagensErro.push("O campo 'Código do Usuário' deve ser preenchido.");
    }

    if (mensagensErro.length > 0) {
        alert(mensagensErro.join("\n"));
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido!");
        return;
    }

    if (senha !== confirmacaoSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    cadastrarUsuario(usuario, senha, confirmacaoSenha, tipoUsuario, email, codigoAdmin);
});

document.querySelector("#formLogin").addEventListener("submit", function(event) {
    event.preventDefault();
    fazerLogin();
});

document.querySelector("#removerTodosRecursos").addEventListener("click", () => {
    if (!usuarioLogado || usuarioLogado.tipo !== "administrador") {
        alert("Apenas Administradores podem remover todos os recursos.");
        return;
    }

    if (recursos.length === 0) {
        alert("Não há recursos para remover.");
        return;
    }

    if (confirm("Tem certeza que deseja remover todos os recursos? Esta ação não poderá ser desfeita.")) {
        recursos = [];
        localStorage.setItem('recursos', JSON.stringify(recursos));
        atualizarListaRecursos();
        atualizarGrafico();
        alert("Todos os recursos foram removidos com sucesso!");
    }
});

const init = () => {
    carregarUsuarios();
    carregarRecursos();
    atualizarGrafico();

    if (recursos.length > 0) {
        document.querySelector("#listaRecursosCard").style.display ="none";
    }
};

init();
