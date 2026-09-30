import express from 'express';
import dados from '../data/cardapio.js';

const router = express.Router();

// Middleware para verificar se o item existe no cardápio
function verificarItemExiste(req, res, next) {
  const { id } = req.params;

  const index = dados.findIndex((item) => item.id == id);

  if (index < 0) {
    return res.status(404).json({ erro: "Item do cardápio não encontrado!" });
  }

  // Anexa o ID e o índice ao objeto 'req' para reuso nas rotas
  req.id = id;
  req.index = index;

  return next();
}

// Rota GET: Listar todos
router.get('/', (req, res) => {
  res.json(dados);
});

// Rota POST: Criar novo
router.post('/', (req, res) => {
  const { id, nome, descricao, img } = req.body;

  // Validação dos campos obrigatórios
  if (!id || !nome || !descricao || !img) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  // Verificar se o ID já existe
  const existeItem = dados.some((item) => item.id == id);
  if (existeItem) {
    return res.status(400).json({ erro: "Cadastro já existente!" });
  }

  const novoItem = {
    id: Number(id),
    nome,
    descricao,
    img
  };

  dados.push(novoItem);

  res.status(201).json(novoItem); // Retorna o item criado em vez de toda a lista
});

// Rota PUT: Atualizar item existente
router.put('/:id', verificarItemExiste, (req, res) => {
  const { nome, descricao, img } = req.body;
  const index = req.index;

  dados[index] = {
    ...dados[index],
    nome: nome !== undefined ? nome : dados[index].nome,
    descricao: descricao !== undefined ? descricao : dados[index].descricao,
    img: img !== undefined ? img : dados[index].img
  };

  res.status(200).json(dados[index]);
});

// Rota DELETE: Remover item
router.delete('/:id', verificarItemExiste, (req, res) => {
  const index = req.index;
  const id = req.id;

  dados.splice(index, 1);

  // Alterado para 200 para conseguir retornar a mensagem de confirmação
  res.status(200).json({ mensagem: `Item com ID ${id} deletado com sucesso!` });
});

export default router;




