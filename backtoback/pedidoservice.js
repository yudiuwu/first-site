
const { produtos, pedidos } = require('./database');

function buscarProduto(produtoId) {
  return produtos.find(p => p.id === produtoId);
}


function calcularTotalPedido(produtoIds) {

  if (!Array.isArray(produtoIds) || produtoIds.length === 0) {
    return {
      valido: false,
      total: 0,
      itens: [],
      mensagem: "Pedido deve conter pelo menos um produto"
    };
  }

  let total = 0;
  const itens = [];

  for (const produtoId of produtoIds) {

    if (!Number.isInteger(produtoId) || produtoId < 1) {
      return {
        valido: false,
        total: 0,
        itens: [],
        mensagem: `ID de produto inválido: ${produtoId}`
      };
    }

    const produto = buscarProduto(produtoId);

    if (!produto) {
      return {
        valido: false,
        total: 0,
        itens: [],
        mensagem: `Produto com ID ${produtoId} não existe no cardápio`
      };
    }

    const itemExistente = itens.find(item => item.produtoId === produtoId);

    if (itemExistente) {
      itemExistente.quantidade += 1;
      itemExistente.subtotal = itemExistente.quantidade * produto.preco;
    } else {
      itens.push({
        produtoId: produto.id,
        nomeProduto: produto.nome,
        preco: produto.preco,
        quantidade: 1,
        subtotal: produto.preco
      });
    }

    total += produto.preco;
  }

  return {
    valido: true,
    total: Number(total.toFixed(2)),
    itens: itens,
    mensagem: "OK"
  };
}

function criarPedido(nomeCliente, produtoIds) {

  if (!nomeCliente || typeof nomeCliente !== 'string' || nomeCliente.trim() === '') {
    return {
      sucesso: false,
      erro: "Nome do cliente é obrigatório"
    };
  }


  const calculo = calcularTotalPedido(produtoIds);

  if (!calculo.valido) {
    return {
      sucesso: false,
      erro: calculo.mensagem
    };
  }

  const novoPedido = {
    id: pedidos.length + 1,
    nomeCliente: nomeCliente.trim(),
    itens: calculo.itens,
    total: calculo.total,
    status: "Pendente",
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString()
  };

  pedidos.push(novoPedido);

  return {
    sucesso: true,
    pedido: novoPedido
  };
}

function listarPedidos() {
  return pedidos;
}

function obterPedido(id) {
  return pedidos.find(p => p.id === id);
}

function obterIndicePedido(id) {
  return pedidos.findIndex(p => p.id === id);
}

const STATUS_VALIDOS = ["Pendente", "Em Preparo", "Pronto", "Entregue"];


function atualizarStatusPedido(id, novoStatus) {
  
  if (!Number.isInteger(id) || id < 1) {
    return {
      sucesso: false,
      erro: "ID do pedido inválido"
    };
  }


  if (!novoStatus || !STATUS_VALIDOS.includes(novoStatus)) {
    return {
      sucesso: false,
      erro: `Status inválido. Status válidos são: ${STATUS_VALIDOS.join(", ")}`
    };
  }

  const pedido = obterPedido(id);

  if (!pedido) {
    return {
      sucesso: false,
      erro: "Pedido não encontrado"
    };
  }

  if (pedido.status === "Entregue") {
    return {
      sucesso: false,
      erro: `Pedido já foi entregue. Não é permitido alterar status de pedidos finalizados.`,
      statusAtual: pedido.status
    };
  }

 
  const ordemStatus = STATUS_VALIDOS.indexOf(pedido.status);
  const ordemNovoStatus = STATUS_VALIDOS.indexOf(novoStatus);

  if (ordemNovoStatus < ordemStatus) {
    return {
      sucesso: false,
      erro: `Transição inválida: não é possível voltar de "${pedido.status}" para "${novoStatus}". A progressão é: ${STATUS_VALIDOS.join(" → ")}`
    };
  }


  if (pedido.status === novoStatus) {
    return {
      sucesso: false,
      erro: `O pedido já possui o status "${novoStatus}"`
    };
  }

  const pedidoAnterior = { ...pedido };
  pedido.status = novoStatus;
  pedido.dataAtualizacao = new Date().toISOString();

  return {
    sucesso: true,
    pedido: pedido,
    pedidoAnterior: pedidoAnterior
  };
}

function deletarPedido(id) {

  if (!Number.isInteger(id) || id < 1) {
    return {
      sucesso: false,
      erro: "ID do pedido inválido"
    };
  }

  // Buscar o pedido
  const pedido = obterPedido(id);

  if (!pedido) {
    return {
      sucesso: false,
      erro: "Pedido não encontrado"
    };
  }

  if (pedido.status === "Em Preparo") {
    return {
      sucesso: false,
      erro: "Não é permitido cancelar pedidos que já começaram o preparo. Pedido está 'Em Preparo'.",
      statusAtual: pedido.status,
      motivo: "Prevenção de desperdício de ingredientes"
    };
  }

  if (pedido.status === "Entregue") {
    return {
      sucesso: false,
      erro: "Não é permitido cancelar pedidos já entregues.",
      statusAtual: pedido.status
    };
  }

  // Encontrar o índice do pedido no array
  const indice = obterIndicePedido(id);

  if (indice === -1) {
    return {
      sucesso: false,
      erro: "Erro ao encontrar o pedido para deleção"
    };
  }

  // Remover o pedido do array
  const pedidoDeletado = pedidos.splice(indice, 1)[0];

  return {
    sucesso: true,
    pedidoDeletado: pedidoDeletado,
    mensagem: `Pedido #${id} cancelado com sucesso`
  };
}

module.exports = {
  buscarProduto,
  calcularTotalPedido,
  criarPedido,
  listarPedidos,
  obterPedido,
  obterIndicePedido,
  atualizarStatusPedido,
  deletarPedido,
  STATUS_VALIDOS
};