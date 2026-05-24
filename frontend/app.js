const API_URL = "http://localhost:3000";

const usuarios = [
  { usuario: "operador", senha: "123", nivel: "basico", permissao: "Operacional" },
  { usuario: "lider", senha: "456", nivel: "operacional", permissao: "Administrativo" },
  { usuario: "admin", senha: "789", nivel: "master", permissao: "Master" }
];

let agentes = [];
let mensagens = [];
let idEditando = null;

const statusApi = document.getElementById("statusApi");
const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");
const formAgente = document.getElementById("formAgente");
const tabelaAgentes = document.getElementById("tabelaAgentes");
const formMensagem = document.getElementById("formMensagem");
const listaMensagens = document.getElementById("listaMensagens");
const btnJson = document.getElementById("btnJson");
const saidaJson = document.getElementById("saidaJson");
const btnSalvar = document.getElementById("btnSalvar");

async function verificarApi() {
  try {
    const resposta = await fetch(`${API_URL}/agentes`);
    agentes = await resposta.json();
    statusApi.textContent = "API conectada";
    statusApi.classList.add("ok");
    renderizarAgentes();
    atualizarMetricas();
  } catch (erro) {
    statusApi.textContent = "API nao conectada";
    statusApi.classList.remove("ok");
  }
}

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  const encontrado = usuarios.find(function (item) {
    return item.usuario === usuario && item.senha === senha;
  });

  if (!encontrado) {
    mensagemLogin.textContent = "Acesso bloqueado. Usuario ou senha invalidos.";
    mensagemLogin.style.color = "#b03a2e";
    return;
  }

  mensagemLogin.textContent = `Acesso liberado. Permissao: ${encontrado.permissao}`;
  mensagemLogin.style.color = "#1e8449";
});

formAgente.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const agente = {
    nome: document.getElementById("nome").value,
    setor: document.getElementById("setor").value,
    nivel: document.getElementById("nivel").value,
    status: document.getElementById("status").value
  };

  if (idEditando) {
    await fetch(`${API_URL}/agentes/${idEditando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agente)
    });
    idEditando = null;
    btnSalvar.textContent = "Cadastrar agente";
  } else {
    await fetch(`${API_URL}/agentes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agente)
    });
  }

  formAgente.reset();
  await carregarAgentes();
});

async function carregarAgentes() {
  const resposta = await fetch(`${API_URL}/agentes`);
  agentes = await resposta.json();
  renderizarAgentes();
  atualizarMetricas();
}

function renderizarAgentes() {
  tabelaAgentes.innerHTML = "";

  agentes.forEach(function (agente) {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${agente.id}</td>
      <td>${agente.nome}</td>
      <td>${agente.setor}</td>
      <td>${agente.nivel}</td>
      <td>${agente.status}</td>
      <td class="acoes">
        <button onclick="editarAgente(${agente.id})">Editar</button>
        <button class="remover" onclick="removerAgente(${agente.id})">Remover</button>
      </td>
    `;

    tabelaAgentes.appendChild(linha);
  });
}

function editarAgente(id) {
  const agente = agentes.find(function (item) {
    return item.id === id;
  });

  if (!agente) {
    return;
  }

  document.getElementById("nome").value = agente.nome;
  document.getElementById("setor").value = agente.setor;
  document.getElementById("nivel").value = agente.nivel;
  document.getElementById("status").value = agente.status;

  idEditando = id;
  btnSalvar.textContent = "Atualizar agente";
}

async function removerAgente(id) {
  await fetch(`${API_URL}/agentes/${id}`, {
    method: "DELETE"
  });

  await carregarAgentes();
}

formMensagem.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const mensagem = {
    remetente: document.getElementById("remetente").value,
    destinatario: document.getElementById("destinatario").value,
    prioridade: document.getElementById("prioridade").value,
    status: document.getElementById("statusMensagem").value,
    texto: document.getElementById("textoMensagem").value
  };

  mensagens.push(mensagem);
  formMensagem.reset();
  renderizarMensagens();
  atualizarMetricas();
});

function renderizarMensagens() {
  listaMensagens.innerHTML = "";

  mensagens.forEach(function (mensagem) {
    const item = document.createElement("div");
    item.className = `item-mensagem ${mensagem.prioridade}`;
    item.innerHTML = `
      <strong>${mensagem.remetente} para ${mensagem.destinatario}</strong>
      <p>${mensagem.texto}</p>
      <small>Prioridade: ${mensagem.prioridade} | Status: ${mensagem.status}</small>
    `;
    listaMensagens.appendChild(item);
  });
}

function atualizarMetricas() {
  const total = agentes.length;
  const ativos = agentes.filter(function (agente) {
    return agente.status === "ativo";
  }).length;
  const criticas = mensagens.filter(function (mensagem) {
    return mensagem.prioridade === "critica";
  }).length;

  document.getElementById("totalAgentes").textContent = total;
  document.getElementById("ativos").textContent = ativos;
  document.getElementById("criticas").textContent = criticas;
}

btnJson.addEventListener("click", function () {
  const relatorio = {
    geradoEm: new Date().toLocaleString("pt-BR"),
    agentes,
    mensagens,
    estatisticas: {
      totalAgentes: agentes.length,
      agentesAtivos: agentes.filter((agente) => agente.status === "ativo").length,
      mensagensCriticas: mensagens.filter((mensagem) => mensagem.prioridade === "critica").length
    }
  };

  saidaJson.textContent = JSON.stringify(relatorio, null, 2);
});

verificarApi();
