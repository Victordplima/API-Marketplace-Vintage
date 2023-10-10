import express, { Request, Response } from 'express';
import produtos from './data';

const app = express();
const PORT = 3000;

app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('X-Your-Name', 'Nome');
    next();
});



app.get('/produtos', (req: Request, res: Response) => {
    res.json(produtos);
});



app.get('/produtos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});


app.post('/produtos', (req: Request, res: Response) => {
    const novoProduto = req.body;
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.tamanho || !novoProduto.categoria || !novoProduto.descricao || !novoProduto.disponivel) {
        res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
        return;
    }
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});


app.put('/produtos/:id', (req: Request, res: Response) => {
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


app.delete('/produtos/:id', (req: Request, res: Response) => {
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
