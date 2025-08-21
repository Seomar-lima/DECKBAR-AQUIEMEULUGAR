const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulação de banco de dados (em memória)
let clients = [
  { id: 1, nome: 'João Silva', cpf: '12345678900', pontos: 7, visits: 7 },
  { id: 2, nome: 'Maria Santos', cpf: '98765432100', pontos: 5, visits: 5 }
];

let visits = [
  { id: 1, clientId: 1, orderNumber: '123', amount: 50.00, createdAt: '2023-08-12' },
  { id: 2, clientId: 1, orderNumber: '120', amount: 35.50, createdAt: '2023-08-05' },
  { id: 3, clientId: 2, orderNumber: '118', amount: 42.00, createdAt: '2023-07-28' }
];

// Rotas da API

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Verificar CPF do cliente
app.post('/api/client/check-cpf', (req, res) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF é obrigatório' });
  }

  const client = clients.find(c => c.cpf === cpf);

  if (!client) {
    return res.status(404).json({ error: 'Cliente não encontrado' });
  }

  res.json({ client });
});

// Registrar novo cliente
app.post('/api/client/register', (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
  }

  const existingClient = clients.find(c => c.cpf === cpf);

  if (existingClient) {
    return res.status(400).json({ error: 'CPF já cadastrado' });
  }

  const newClient = {
    id: clients.length + 1,
    nome,
    cpf,
    pontos: 0,
    visits: 0
  };

  clients.push(newClient);

  res.status(201).json({ client: newClient });
});

// Obter histórico de visitas do cliente
app.get('/api/client/:cpf/history', (req, res) => {
  const { cpf } = req.params;

  const client = clients.find(c => c.cpf === cpf);

  if (!client) {
    return res.status(404).json({ error: 'Cliente não encontrado' });
  }

  const clientVisits = visits.filter(v => v.clientId === client.id);

  res.json({ visits: clientVisits });
});

// Registrar nova visita (leitura de QR Code)
app.post('/api/client/redeem', (req, res) => {
  const { cpf, token } = req.body;

  // Aqui você validaria o token do QR Code (não implementado neste exemplo)
  // Por enquanto, vamos simular a adição de pontos

  const client = clients.find(c => c.cpf === cpf);

  if (!client) {
    return res.status(404).json({ error: 'Cliente não encontrado' });
  }

  // Adiciona ponto e visita
  client.pontos += 1;
  client.visits += 1;

  // Cria uma nova visita
  const newVisit = {
    id: visits.length + 1,
    clientId: client.id,
    orderNumber: `#${Math.floor(100 + Math.random() * 900)}`,
    amount: 0, // Você pode ajustar conforme o QR Code
    createdAt: new Date().toISOString().split('T')[0]
  };

  visits.push(newVisit);

  res.json({ pontos: client.pontos, visit: newVisit });
});

// Rotas administrativas (protegidas por autenticação em um cenário real)

// Listar todos os clientes
app.get('/api/admin/clients', (req, res) => {
  res.json({ clients });
});

// Listar todas as visitas
app.get('/api/admin/visits', (req, res) => {
  const visitsWithClientInfo = visits.map(visit => {
    const client = clients.find(c => c.id === visit.clientId);
    return {
      ...visit,
      clientName: client.nome,
      clientCpf: client.cpf
    };
  });

  res.json({ visits: visitsWithClientInfo });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
