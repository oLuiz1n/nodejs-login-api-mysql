import express from "express";
import pool from "./database.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
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

function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ mensagem: "Token inválido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Token expirado ou inválido" });
    }
}


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

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );
        
        res.status(200).json({ token });

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

app.get('/usuarios/me', autenticarToken, async (req, res) => {
    try {
        const[usuario] = await pool.query('SELECT id, email, nome FROM usuarios WHERE id = ?', [req.userId]);

        if (usuario.length === 0) { 
            return res.status(401).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/usuarios/me/senha', autenticarToken, async (req, res) => {
    try {
        const { senhaAntiga, senhaNova }  = req.body;
        const[usuario] = await pool.query('SELECT senha FROM usuarios WHERE id = ?', [req.userId]);
        
        if(usuario.length === 0) {
            return res.status(401).json({ mensagem: 'Usuario não encontrado'});
        };
        
        const user = usuario[0];

        const senhaCorreta = await bcrypt.compare(senhaAntiga, user.senha);

        if(!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha incorreta'});
        };
        
        const senhaNovaHash = await bcrypt.hash(senhaNova, saltRounds);

        const [resultado] = await pool.query('UPDATE usuarios SET senha = ? WHERE id = ? LIMIT 1', [senhaNovaHash, req.userId]);

        res.json({
            mensagem: 'Senha alterada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/usuarios/me', autenticarToken, async (req, res) => {
    try {

        const { senha } = req.body;
        const [usuario] = await pool.query('SELECT senha FROM usuarios WHERE id = ?', [req.userId]);

        if(usuario.length === 0){
            return res.status(404).json({ mensagem: 'Usuario não encontrado'});
        }

        const user = usuario[0];

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if(!senhaCorreta){
            return res.status(401).json({ mensagem: 'Senha Incorreta' });
        };

        const[resultado] = await pool.query('DELETE FROM usuarios WHERE id = ? LIMIT 1', [req.userId]);

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