import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

function FormLogin()  {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setErro("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, senha})
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.mensagem || "Email ou senha inválidos");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify({
                id: data.id,
                nome: data.nome,
                email: data.email
            }));
            window.location.href = "/home";
        } catch (error) {
            console.log("Erro ao logar", error);
            setErro("Erro ao conectar com o servidor");
        }
    }

    return (
        <div className="formLogin" >
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Digite seu email" value={email} onChange={(e)  => setEmail(e.target.value)} />
            <input type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button className="btnEntrar" type="submit">Entrar</button>
            <h2>Cadastre-se aqui</h2>
            <button className="btnCadastro" type="button" onClick={() => navigate("/cadastro")}>Cadastrar</button>
            {erro && <p>{erro}</p>}
        </form>
        </div>
    )

}

export default FormLogin;