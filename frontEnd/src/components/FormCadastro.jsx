import { useState } from "react";
import "../style.css";

function FormCadastro() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");

    async function handleCadastro(e) {
        e.preventDefault();
        setErro("");
        try {
            const response =  await fetch(`${import.meta.env.VITE_API_URI}/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await response.json();

            if(!response.ok) {
                setErro(data.mensagem || "Erro ao cadastrar usuario");
                return;
            }
            window.location.href = "/";
        } catch (error) {
            console.log("Erro ao cadastrar", error);
            setErro("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="btnAndInputs">
        <form onSubmit={handleCadastro}>
            <input type="text" placeholder="Digite seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)}/>
            <input type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Digite a senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
            <button className="btnCadastrar" type="submit">Cadastrar</button>
            {erro && <p>{erro}</p>}
        </form>
        </div>
    );
}

export default FormCadastro;