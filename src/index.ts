import express, { Request, Response, NextFunction } from 'express';
import produtos from './data';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

interface User {
    username: string;
    password: string;
    role: string;
}

const users: User[] = [];

const SECRET_KEY = process.env.SECRET_KEY || 'chavepadrao';

declare global {
    namespace Express {
        interface Request {
            user?: { username: string; role: string };
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { username: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

app.use((req, res, next) => {
    res.setHeader('X-Your-Name', 'Nome');
    next();
});

app.post('/signup', async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = { username, password: hashedPassword, role };
    users.push(newUser);

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

app.get('/produtos', verifyToken, (req: Request, res: Response) => {
    let filteredProdutos = [...produtos];

    // Filtragem por nome
    if (req.query.nome) {
        const nome = req.query.nome as string;
        filteredProdutos = filteredProdutos.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
    }

    // Ordenação por preço (padrão ascendente)
    if (req.query.ordenarPor === 'preco') {
        filteredProdutos.sort((a, b) => a.preco - b.preco);
    }

    // Paginação
    const page = parseInt(req.query.pagina as string, 10) || 1;
    const pageSize = parseInt(req.query.tamanhoPagina as string, 10) || 5;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProdutos = filteredProdutos.slice(startIndex, endIndex);

    res.json(paginatedProdutos);
});

// As rotas abaixo agora requerem autenticação
app.get('/produtos/:id', verifyToken, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const produto = produtos.find(p => p.id === id);

    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.post('/produtos', verifyToken, (req: Request, res: Response) => {
    const novoProduto = req.body;
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.tamanho || !novoProduto.categoria || !novoProduto.descricao || !novoProduto.disponivel) {
        res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
        return;
    }
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

app.put('/produtos/:id', verifyToken, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = produtos.findIndex(p => p.id === id);

    if (index !== -1) {
        const updatedProduto = req.body;
        produtos[index] = { ...produtos[index], ...updatedProduto };
        res.json(produtos[index]);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.delete('/produtos/:id', verifyToken, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = produtos.findIndex(p => p.id === id);

    if (index !== -1) {
        const deletedProduto = produtos.splice(index, 1);
        res.json(deletedProduto[0]);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
