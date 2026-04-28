
const express = require('express');
const { produtos } = require('./database');
const {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarStatusPedido,
  deletarPedido,
  STATUS_VALIDOS
} = require('./pedidoService');

const app = express();
app.use(express.json());

app.post('/pedidos', (req, res) => {
  const { nomeCliente, produtoIds } = req.body;

  const resultado = criarPedido(nomeCliente, produtoIds);

  if (!resultado.sucesso) {
    return res.status(400).json({
      sucesso: false,
      erro: resultado.erro
    });
  }

  res.status(201).json({
    sucesso: true,
    mensagem: "Pedido criado com sucesso",
    pedido: resultado.pedido
  });
});

app.get('/pedidos', (req, res) => {
  const todosOsPedidos = listarPedidos();
  res.json({
    sucesso: true,
    total: todosOsPedidos.length,
    pedidos: todosOsPedidos
  });
});

app.get('/pedidos/:id', (req, res) => {
  const pedido = obterPedido(parseInt(req.params.id));

  if (!pedido) {
    return res.status(404).json({
      sucesso: false,
      erro: "Pedido não encontrado"
    });
  }

  res.json({
    sucesso: true,
    pedido: pedido
  });
});

app.patch('/pedidos/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { novoStatus } = req.body;

  if (!novoStatus) {
    return res.status(400).json({
      sucesso: false,
      erro: "Campo 'novoStatus' é obrigatório",
      statusValidos: STATUS_VALIDOS
    });
  }

  const resultado = atualizarStatusPedido(id, novoStatus);

  if (!resultado.sucesso) {
    return res.status(400).json({
      sucesso: false,
      erro: resultado.erro,
      statusAtual: resultado.statusAtual,
      statusValidos: STATUS_VALIDOS
    });
  }

  res.json({
    sucesso: true,
    mensagem: `Status do pedido #${id} atualizado com sucesso`,
    transicao: {
      statusAnterior: resultado.pedidoAnterior.status,
      statusNovo: resultado.pedido.status
    },
    pedido: resultado.pedido
  });
});

app.delete('/pedidos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const resultado = deletarPedido(id);

  if (!resultado.sucesso) {
 
    const statusCode = resultado.erro.includes('não encontrado') ? 404 : 400;

    return res.status(statusCode).json({
      sucesso: false,
      erro: resultado.erro,
      statusAtual: resultado.statusAtual,
      motivo: resultado.motivo
    });
  }

  res.json({
    sucesso: true,
    mensagem: resultado.mensagem,
    pedidoDeletado: resultado.pedidoDeletado
  });
});

app.get('/cardapio', (req, res) => {
  res.json({
    sucesso: true,
    total: produtos.length,
    produtos: produtos
  });
});

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.path
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🍔 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Acesse http://localhost:${PORT}/cardapio para ver o cardápio`);
});