import express from "express";
import pool from "./database.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const saltRounds = Number(process.env.SALT);

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
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        const[resultado] = await pool.query('INSERT INTO usuarios (nome, email, senha) values (?, ?, ?)', [nome, email, senhaHash]);

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
            return res.status(401).json({mensagem: 'Usuario não encontrado'})
        }

        const user = usuario[0];

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if(!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha incorreta' });
        };
        
        res.json({mensagem: "Usuario logado com sucesso"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const[usuario] = await pool.query('SELECT id, email, nome FROM usuarios');

        if(usuario.length === 0){
            return res.status(401).json({ mensagem: 'Usuario não encontrado' })
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
            return res.status(401).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { senhaAntiga, senhaNova }  = req.body;
        const senhaNovaHash = await bcrypt.hash(senhaNova, saltRounds);
        const { id }  = req.params;
        const[usuario] = await pool.query('SELECT senha FROM usuarios WHERE id = ?', [id]);
        
        if(usuario.length === 0) {
            return res.status(401).json({ mensagem: 'Usuario não encontrado'});
        };
        
        const user = usuario[0];

        const senhaCorreta = await bcrypt.compare(senhaAntiga, user.senha);

        if(!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha incorreta'});
        };

        const [resultado] = await pool.query('UPDATE usuarios SET senha = ? WHERE id = ? LIMIT 1', [senhaNovaHash, id]);

        res.json({
            mensagem: 'Senha alterada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {

        const { senha } = req.body;
        const { id } = req.params;
        const [usuario] = await pool.query('SELECT senha FROM usuarios WHERE id = ?', [id]);

        if(usuario.length === 0){
            return res.status(404).json({ mensagem: 'Usuario não encontrado'});
        }

        const user = usuario[0];

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if(!senhaCorreta){
            return res.status(401).json({ mensagem: 'Senha Incorreta' });
        };

        const[resultado] = await pool.query('DELETE FROM usuarios WHERE id = ? LIMIT 1', [id]);

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