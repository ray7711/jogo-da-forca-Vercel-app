let jogarNovamente = true;
let tentativas = 6;
let ListaDinamica = [];
let palavraSecretaCategoria;
let palavraSecretaSorteada;
let palavras = [];
let jogoAutomatico = true
let palavrasPendentes = [];
let intervalPiscar;

carregaListaAutomatica();

criarPalavraSecreta();
function criarPalavraSecreta(){
    const indexPalavra = parseInt(Math.random() * palavras.length)
    
    
    palavraSecretaSorteada = palavras [indexPalavra].nome;
    palavraSecretaCategoria = palavras [indexPalavra].categoria;
    console.log(palavraSecretaSorteada)
    console.log(palavraSecretaCategoria)
}
montarPalavraNaTela();
function montarPalavraNaTela(){
    const categoria = document.getElementById("categoria");
    categoria.innerHTML = palavraSecretaCategoria;

    const palavraTela = document.getElementById("palavra-secreta");
    palavraTela.innerHTML = ""; // Limpa o conteúdo antigo

    // 🎯 REINICIALIZAÇÃO: Garantir que a ListaDinamica é redefinida para a nova palavra
    // Isso é crucial se você iniciar um novo jogo
    if (ListaDinamica.length !== palavraSecretaSorteada.length) {
        ListaDinamica = [];
    }

    for(let i = 0; i < palavraSecretaSorteada.length; i++){
        const caractere = palavraSecretaSorteada[i];
        
        let conteudoDaDiv;
        let classeDaDiv;

        // 1. Lógica de Inicialização (se a posição não foi preenchida ainda)
        if (ListaDinamica[i] === undefined) {
            
            if (caractere === ' ' || caractere === '-') {
                // Se for espaço ou hífen, revele imediatamente e use a classe especial
                ListaDinamica[i] = caractere;
                conteudoDaDiv = caractere === ' ' ? '&nbsp;' : caractere; // Usar &nbsp; para o espaço
                classeDaDiv = "caractere-especial";
                
            } else {
                // Se for letra, oculte-a
                ListaDinamica[i] = "&nbsp;";
                conteudoDaDiv = "&nbsp;";
                classeDaDiv = "letras";
            }
        } 
        // 2. Lógica de Exibição (se já existe conteúdo na ListaDinamica)
        else {
            // Usa o que já está na ListaDinamica (seja a letra revelada, &nbsp; ou o caractere especial)
            conteudoDaDiv = ListaDinamica[i];
            
            // Re-determina a classe com base no caractere original da palavra secreta
            if (caractere === ' ' || caractere === '-') {
                 classeDaDiv = "caractere-especial";
            } else {
                 classeDaDiv = "letras";
            }
        }
        
        // 3. Monta e insere o HTML na tela
        palavraTela.innerHTML += `<div class='${classeDaDiv}'>${conteudoDaDiv}</div>`;
    }

}

function verificaLetraEscolhida(Letra){
    document.getElementById("Tecla-" + Letra).disabled = true;
    if(tentativas > 0)
    {
        mudarStyleLetra("Tecla-" + Letra, false);
        comparalistas(Letra);
    }
    
}

function mudarStyleLetra(tecla, condicao){
    if(condicao == false)
    {
    document.getElementById(tecla).style.background = "#e70f0fff";
    document.getElementById(tecla).style.color = "#ffffff";
    }
    else{
    document.getElementById(tecla).style.background = "#379e18ff";
    document.getElementById(tecla).style.color = "#ffffff";
    }

   
}

function comparalistas(Letra){
    const pos = palavraSecretaSorteada.indexOf(Letra)
    if(pos < 0){
        tentativas--
        carregaImagemForca();
        if(tentativas == 0)
        {
            abreModal("OPS!", "Game Over ... A palavra secreta era <br>" + palavraSecretaSorteada);
            piscarBotaoJogarNovamente();
            desabilitaTeclado();
        }
    }
    else{
        mudarStyleLetra("Tecla-" + Letra, true);
        for(i = 0; i < palavraSecretaSorteada.length; i++ )
        {
            if(palavraSecretaSorteada[i] == Letra){
                ListaDinamica[i] = Letra;
            }
        }
    }

    let vitoria = true;
        for(i = 0; i < palavraSecretaSorteada.length; i++ ){
        if(palavraSecretaSorteada[i] != ListaDinamica[i])
            vitoria = false;
    }

    montarPalavraNaTela();

    if(vitoria == true)
{
        if(jogoAutomatico == true) {
            // MODO AUTOMÁTICO: Vitória imediata
            abreModal("Parabéns!", "Você venceu!!! Pegue seu bombom. <br>");
            tentativas = 0;
            piscarBotaoJogarNovamente();
            desabilitaTeclado();

        } else {
            // MODO MANUAL: Desafio de Múltiplas Palavras
            
            // 1. Remove a palavra atual da lista de pendentes
            palavrasPendentes.shift(); // Remove o primeiro item
            
            // 2. Verifica se há mais palavras
            if(palavrasPendentes.length > 0) {
                
                // 🟢 VITÓRIA PARCIAL: Mensagem agora inclui a palavra secreta 🟢
                abreModal(
                    "Parabéns!", 
                    `Palavra acertada! A palavra era: ${palavraSecretaSorteada}. Faltam ${palavrasPendentes.length} palavras no desafio.`
                );
                
                // Sorteia a próxima palavra imediatamente
                sortearNovaPalavra(); 
            } else {
                // VITÓRIA FINAL: Termina o desafio
                abreModal("Vitória Final!", "Você completou o desafio do modo manual! Todas as palavras foram acertadas.", true);
                tentativas = 0;
                // ... (piscarBotaoJogarNovamente e desabilitaTeclado)
            }
        }
    }
}

function piscarBotaoJogarNovamente(){
    // 1. Limpa qualquer piscar anterior que possa estar rodando
    if(intervalPiscar) {
        clearInterval(intervalPiscar);
    }
    
    // 2. Define o novo intervalo de piscar
    intervalPiscar = setInterval(() => {
        const botao = document.getElementById("btnReiniciar");
        // Lógica de toggle/alternar piscar
        if (botao.style.backgroundColor === 'rgb(76, 187, 23)') { // '4CBB17'
            botao.style.backgroundColor = '#EAD800';
            botao.style.scale = 1;
        } else {
            botao.style.backgroundColor = '#4CBB17';
            botao.style.scale = 1.3;
        }
    }, 500); // Pisca a cada 500ms
}

async function atraso(tempo){
    return new Promise(x => setTimeout(x, tempo));
}

function pararPiscar(){
    if (intervalPiscar) {
        clearInterval(intervalPiscar); // Para o loop
    }
    document.getElementById("btnReiniciar").style.backgroundColor = '';
    document.getElementById("btnReiniciar").style.scale = 1;
}


function carregaImagemForca(){
    switch(tentativas){
        case 5:
            document.getElementById("imagem").style.background = "url('./img/forca01.png')";
            break;
        case 4:
            document.getElementById("imagem").style.background = "url('./img/forca02.png')";
            break;
        case 3:
            document.getElementById("imagem").style.background = "url('./img/forca03.png')";
            break;
        case 2:
            document.getElementById("imagem").style.background = "url('./img/forca04.png')";
            break;
        case 1:
            document.getElementById("imagem").style.background = "url('./img/forca05.png')";
            break;
        case 0:
            document.getElementById("imagem").style.background = "url('./img/forca06.png')";
            break;
        default:
            document.getElementById("imagem").style.background = "url('./img/forca.png')";
            break;   
    }
}

function abreModal( titulo, mensagem){
    let modalTitulo = document.getElementById("exampleModalLabel");
        modalTitulo.innerText = titulo;

    let modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = mensagem;
    // Correto: Usar '#' para selecionar o ID e chamar a função .modal()
    $("#myModal").modal("show"); 
    // ou a forma anterior, mas corrigindo a sintaxe:
    /*
    $("#myModal").modal({
        show: true
    });
    */
}

let btnReiniciar = document.querySelector("#btnReiniciar")
btnReiniciar.addEventListener("click", function(){
    jogarNovamente = false;
    pararPiscar();
    location.reload();
});


function listaAutomatica(){ // ativa o modo manual
    if (jogoAutomatico == true) {
        document.getElementById("jogarAutomatico").innerHTML = "<i class='bxr  bx-play-circle'></i>"
        
        // 🎯 CORREÇÃO CRÍTICA: Esvazie a lista de palavras para começar o modo manual do zero
        palavras = []; 
        
        jogoAutomatico = false;
        
        document.getElementById("abreModalAddPalavra").style.display = "block";
        document.getElementById("status").innerHTML = "Modo Manual";
        
    }
    
    else if (jogoAutomatico == false){ // ativa o modo automático
        document.getElementById("jogarAutomatico").innerHTML = "<i class='bx bx-pause-circle'></i>"
        
        jogoAutomatico = true
        
        // 🎯 CORREÇÃO CRÍTICA: Recarregue as palavras automáticas ao voltar para este modo
        carregaListaAutomatica(); 
        criarPalavraSecreta();
        montarPalavraNaTela();
        
        document.getElementById("abreModalAddPalavra").style.display = "none";
        document.getElementById("status").innerHTML = "Modo Automático";
    }
}

const modal = document.getElementById("modal-alerta");
const btnAbremodal = document.getElementById("abreModalAddPalavra");
btnAbremodal.onclick = function(){
    modal.style.display = "block";
}

const btnFechaModal = document.getElementById("FechaModal");
btnFechaModal.onclick = function(){
    modal.style.display = "none";
    document.getElementById("addPalavra").value = "";
    document.getElementById("addCategoria").value = "";

    
}

window.onclick = function(){
    if(this.event.target == modal) {
        modal.style.display = "none";
        document.getElementById("addPalavra").value = "";
        document.getElementById("addCategoria").value = "";
    }


    
}
function carregaListaAutomatica(){
    palavras = [

    palavra001 = {
        nome: "PROCESSADOR",
        categoria: "HARDWARE"
    },
    palavra002= {
        nome: "PLACA-MAE",
        categoria: "HARDWARE"
    },
    palavra003 = {
        nome: "MEMORIA",
        categoria: "HARDWARE"
    },
    palavra004 = {
        nome: "GABINETE",
        categoria: "HARDWARE"
    },
    palavra005 = {
        nome: "PLACA DE VIDEO",
        categoria: "HARDWARE"
    },
    palavra006 = {
        nome: "COOLER",
        categoria: "HARDWARE"
    },
    palavra007 = {
        nome: "FONTE",
        categoria: "HARDWARE"
    },
    palavra008 = {
        nome: "DISCO RIGIDO",
        categoria: "HARDWARE"
    },
    palavra009 = {
        nome: "CHIPSET",
        categoria: "HARDWARE"
    },
    palavra010 = {
        nome: "GIGAHERTZ",
        categoria: "HARDWARE"
    },

    // --- CATEGORIA 2: PERIFÉRICOS (palavra011 a palavra020) ---
    palavra011 = {
        nome: "MONITOR",
        categoria: "PERIFÉRICOS"
    },
    palavra012 = {
        nome: "TECLADO",
        categoria: "PERIFÉRICOS"
    },
    palavra013 = {
        nome: "MOUSE",
        categoria: "PERIFÉRICOS"
    },
    palavra014 = {
        nome: "WEBCAM",
        categoria: "PERIFÉRICOS"
    },
    palavra015 = {
        nome: "IMPRESSORA",
        categoria: "PERIFÉRICOS"
    },
    palavra016 = {
        nome: "HEADSET",
        categoria: "PERIFÉRICOS"
    },
    palavra017 = {
        nome: "MICROFONE",
        categoria: "PERIFÉRICOS"
    },
    palavra018 = {
        nome: "PEN DRIVE",
        categoria: "PERIFÉRICOS"
    },
    palavra019 = {
        nome: "JOYSTICK",
        categoria: "PERIFÉRICOS"
    },
    palavra020 = {
        nome: "SCANNER",
        categoria: "PERIFÉRICOS"
    },

    // --- CATEGORIA 3: PROGRAMAÇÃO & WEB (palavra021 a palavra030) ---
    palavra021 = {
        nome: "ALGORITMO",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra022 = {
        nome: "VARIAVEL",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra023 = {
        nome: "FUNCAO",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra024 = {
        nome: "JAVASCRIPT",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra025 = {
        nome: "HTML",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra026 = {
        nome: "CSS",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra027 = {
        nome: "BANCO DE DADOS",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra028 = {
        nome: "SERVIDOR",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra029 = {
        nome: "API",
        categoria: "PROGRAMAÇÃO & WEB"
    },
    palavra030 = {
        nome: "PYTHON",
        categoria: "PROGRAMAÇÃO & WEB"
    },

    // --- CATEGORIA 4: SISTEMAS E REDES (palavra031 a palavra040) ---
    palavra031 = {
        nome: "WINDOWS",
        categoria: "SISTEMAS E REDES"
    },
    palavra032 = {
        nome: "LINUX",
        categoria: "SISTEMAS E REDES"
    },
    palavra033 = {
        nome: "ANDROID",
        categoria: "SISTEMAS E REDES"
    },
    palavra034 = {
        nome: "ROTEADOR",
        categoria: "SISTEMAS E REDES"
    },
    palavra035 = {
        nome: "ETHERNET",
        categoria: "SISTEMAS E REDES"
    },
    palavra036 = {
        nome: "PROTOCOLO",
        categoria: "SISTEMAS E REDES"
    },
    palavra037 = {
        nome: "NAVEGADOR",
        categoria: "SISTEMAS E REDES"
    },
    palavra038 = {
        nome: "DRIVERS",
        categoria: "SISTEMAS E REDES"
    },
    palavra039 = {
        nome: "IP",
        categoria: "SISTEMAS E REDES"
    },
    palavra040 = {
        nome: "WIFI",
        categoria: "SISTEMAS E REDES"
    },

    // --- CATEGORIA 5: SEGURANÇA E CONCEITOS (palavra041 a palavra050) ---
    palavra041 = {
        nome: "FIREWALL",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra042 = {
        nome: "MALWARE",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra043 = {
        nome: "ANTIVIRUS",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra044 = {
        nome: "PHISHING",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra045 = {
        nome: "CRIPTOGRAFIA",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra046 = {
        nome: "BACKUP",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra047 = {
        nome: "NUVEM",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra048 = {
        nome: "INTERFACE",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra049 = {
        nome: "COMPACTACAO",
        categoria: "SEGURANÇA E CONCEITOS"
    },
    palavra050 = {
        nome: "APLICATIVO",
        categoria: "SEGURANÇA E CONCEITOS"
    }
];
}

function adicionarPalavra(){
    // Use a lógica da Opção B, se implementada, ou pegue o valor direto do input.
    // Usaremos o valor direto para simplificar o exemplo de correção do modal.
    let inputPalavra = document.getElementById("addPalavra");
    let inputCategoria = document.getElementById("addCategoria");
    
    // Converte para maiúsculas
    let addPalavra = inputPalavra.value.toUpperCase();
    let addCategoria = inputCategoria.value.toUpperCase();

    
    if(isNullorWhiteSpace(addPalavra) || isNullorWhiteSpace(addCategoria) || addPalavra.length < 3 || addCategoria.length < 3) {
        // Se a validação FALHAR, apenas mostra o alerta e RETORNA. 
        // O modal continua aberto com o conteúdo inválido para correção.
        abreModal("ATENÇÂO"," Palavra e/ou Categoria inválidos")
        return;
    }
    
    // Se a validação PASSOU, execute a adição:
    let palavra= {
        nome: addPalavra,
        categoria: addCategoria
    }

    // 1. Adiciona a palavra à lista (incluindo a lógica do Desafio de Múltiplas Palavras, se implementada)
    palavras.push(palavra); 
    if(jogoAutomatico == false){
        palavrasPendentes.push(palavra);
    }
    
    // 2. 🟢 LIMPA OS CAMPOS E PREPARA PARA NOVA ENTRADA 🟢
    inputPalavra.value = "";
    inputCategoria.value = "";
    
    // Se você usou a Opção B (palavra oculta), zere a variável de controle:
    // palavraRealDigitada = ""; 
    
    // Retorna o foco para o campo da palavra para facilitar a entrada contínua
    inputPalavra.focus(); 
    
    // 3. ❌ REMOVIDO: A linha "modal.style.display = "none";" foi removida.
    
    // 4. Inicia/Reinicia o jogo com a nova lista de palavras (somente se estiver no modo manual)
    if(jogoAutomatico == false && palavrasPendentes.length > 0){
        // Se esta é a primeira palavra, inicie o jogo.
        if (palavrasPendentes.length === 1) {
             sortearNovaPalavra();
        }
        // Se já houver jogo rodando, apenas mantenha a palavra adicionada na lista.
    }
    
    // Opcional: Avisar o usuário que a palavra foi adicionada.
    console.log(`Palavra "${addPalavra}" adicionada com sucesso. Total no desafio: ${palavrasPendentes.length}`);
}

// JS: Modificar esta função
function sortearNovaPalavra(){
    if(jogoAutomatico == true){
        // MODO AUTOMÁTICO: Lógica normal
        if(palavras.length > 0){
            ListaDinamica = [];
            tentativas = 6;
            jogarNovamente = true;
            carregaImagemForca(); 
            resetaTeclas(); 
            pararPiscar(); // Se você implementou
            
            criarPalavraSecreta(); // Sorteia de 'palavras'
            montarPalavraNaTela();
        }
    } else {
        // MODO MANUAL: Jogo em Desafio de Múltiplas Palavras
        if(palavrasPendentes.length > 0){
            // Sorteia de palavrasPendentes (no modo manual, sorteamos sempre a primeira para simplificar o controle)
            const palavraParaJogar = palavrasPendentes[0];
            
            palavraSecretaSorteada = palavraParaJogar.nome;
            palavraSecretaCategoria = palavraParaJogar.categoria;
            
            // Reset parcial para a nova rodada
            ListaDinamica = [];
            tentativas = 6; // Mantém as tentativas para o novo jogo
            jogarNovamente = true; 
            carregaImagemForca(); 
            resetaTeclas(); 
            pararPiscar(); // Se você implementou

            montarPalavraNaTela();
        } else {
            // Se palavrasPendentes estiver vazia, não há o que sortear.
            // Isso só deve acontecer após a vitória final.
        }
    }
}

function isNullorWhiteSpace(input){
    return !input || !input.trim();
}

// JS: Modificar esta função
function sortear(){
    // Se o jogo está automático, reinicia TUDO (recarrega a página)
    if(jogoAutomatico == true){
        location.reload();
    }
    // Se o jogo está manual, apenas reseta a palavra e o jogo.
    else{
        // 🛑 NOVO: Parar o loop de piscar e resetar a aparência do botão 
        // de controle antes de sortear a nova palavra.
        jogarNovamente = false; 
        document.getElementById("btnReiniciar").style.backgroundColor = '';
        document.getElementById("btnReiniciar").style.scale = 1;
        
        // Reseta o jogo para a próxima palavra
        pararPiscar();
        sortearNovaPalavra();
    }
}

// JS: Localizado em 'js/forca.js'
function resetaTeclas (){
    // Seleciona todos os botões que estão dentro do div .teclas
    let teclas = document.querySelectorAll(".teclas button"); 

    teclas.forEach((x) => {
        x.style.background = ""; // Limpa a cor de fundo (acerto/erro)
        x.style.color = "#0084ff"; // Retorna à cor original do texto (do seu CSS)
        x.disabled = false; // Habilita o botão
    });
}