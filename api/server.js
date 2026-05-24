const http = require("http");
const { URL } = require("url");

let proximoId = 4;

let agentes = [
  { id: 1, nome: "Ana Souza", setor: "Seguranca", nivel: "master", status: "ativo" },
  { id: 2, nome: "Carlos Lima", setor: "Infraestrutura", nivel: "operacional", status: "ativo" },
  { id: 3, nome: "Mariana Alves", setor: "Inteligencia", nivel: "administrativo", status: "em analise" }
];

function enviar(res, status, dados) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(dados));
}

function lerCorpo(req) {
  return new Promise((resolve, reject) => {
    let corpo = "";

    req.on("data", (parte) => {
      corpo += parte;
    });

    req.on("end", () => {
      try {
        resolve(corpo ? JSON.parse(corpo) : {});
      } catch (erro) {
        reject(erro);
      }
    });
  });
}

function buscarId(pathname) {
  const partes = pathname.split("/");
  return Number(partes[2]);
}

async function roteador(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === "OPTIONS") {
    return enviar(res, 200, { mensagem: "ok" });
  }

  if (req.method === "GET" && pathname === "/") {
    return enviar(res, 200, {
      sistema: "API Central da Anhanguera Solutions",
      rotas: ["/agentes", "/agentes/:id", "/externa"]
    });
  }

  if (req.method === "GET" && pathname === "/agentes") {
    return enviar(res, 200, agentes);
  }

  if (req.method === "GET" && pathname.startsWith("/agentes/")) {
    const id = buscarId(pathname);
    const agente = agentes.find((item) => item.id === id);

    if (!agente) {
      return enviar(res, 404, { erro: "Agente nao encontrado" });
    }

    return enviar(res, 200, agente);
  }

  if (req.method === "POST" && pathname === "/agentes") {
    const dados = await lerCorpo(req);

    const novoAgente = {
      id: proximoId++,
      nome: dados.nome,
      setor: dados.setor,
      nivel: dados.nivel,
      status: dados.status || "ativo"
    };

    agentes.push(novoAgente);
    return enviar(res, 201, novoAgente);
  }

  if (req.method === "PUT" && pathname.startsWith("/agentes/")) {
    const id = buscarId(pathname);
    const dados = await lerCorpo(req);
    const indice = agentes.findIndex((item) => item.id === id);

    if (indice === -1) {
      return enviar(res, 404, { erro: "Agente nao encontrado" });
    }

    agentes[indice] = {
      ...agentes[indice],
      nome: dados.nome,
      setor: dados.setor,
      nivel: dados.nivel,
      status: dados.status
    };

    return enviar(res, 200, agentes[indice]);
  }

  if (req.method === "DELETE" && pathname.startsWith("/agentes/")) {
    const id = buscarId(pathname);
    const existe = agentes.some((item) => item.id === id);

    if (!existe) {
      return enviar(res, 404, { erro: "Agente nao encontrado" });
    }

    agentes = agentes.filter((item) => item.id !== id);
    return enviar(res, 200, { mensagem: "Agente removido com sucesso" });
  }

  if (req.method === "GET" && pathname === "/externa") {
    return enviar(res, 200, {
      origem: "API publica simulada",
      status: "conexao externa restaurada",
      data: new Date().toISOString()
    });
  }

  return enviar(res, 404, { erro: "Rota nao encontrada" });
}

const servidor = http.createServer((req, res) => {
  roteador(req, res).catch(() => {
    enviar(res, 500, { erro: "Erro interno do servidor" });
  });
});

servidor.listen(3000, () => {
  console.log("API Central da Anhanguera Solutions");
  console.log("Servidor rodando em http://localhost:3000");
});
