import express from "express";
import pool from "./database.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('Conectado ao Banco de Dados');
    } catch (error) {
        console.log('Erro ao conectar ao Banco de Dados', error);
    }
}

connectDB();


app.post('/usuarios', async (req, res) => {
    try {

        const { nome, email, senha } = req.body;
        const[resultado] = await pool.query('INSERT INTO usuarios (nome, email, senha) values (?, ?, ?)', [nome, email, senha]);

        res.json({
            mensagem: 'Usuario criado com sucesso',
            id: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const[usuario] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if(usuario.length === 0){
            return res.json({mensagem: 'Usuario não encontrado'})
        }

        const user = usuario[0];

        if (senha !== user.senha) {
            return res.json({ mensagem: 'Senha incorreta' });
        }
        
        res.json({mensagem: "Usuario logado com sucesso"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const[usuario] = await pool.query('SELECT id, email, nome FROM usuarios');

        if(usuario.length === 0){
            return res.json({ mensagem: 'Usuario não encontrado' })
        }
        
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const[usuario] = await pool.query('SELECT id, email, nome FROM usuarios WHERE id = ?', [id]);

        if (usuario.length === 0) { 
            return res.json({ mensagem: 'Usuário não encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { senha }  = req.body;
        const { id }  = req.params;
        const[resultado] = await pool.query('UPDATE usuarios SET senha = ? WHERE id = ? LIMIT 1', [senha, id]);

        if (resultado.affectedRows === 0) {
            return res.json({
                mensagem: 'Usuario não encontrado'
            });
        };

        res.json({
            mensagem: 'Senha alterada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { nome } = req.params;
        const { id } = req.params;
        const[resultado] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.json({
                mensagem: 'Usuario não encontrado'
            });
        };

        res.json({
            mensagem: 'Usuario excluido com sucesso',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    try {
        console.log(`O servidor esta conectado`);
    } catch (error) {
        console.log('Não foi possivel conectar', error);
    }
});