import { useState } from "react";
import "../style.css";

function FormTrocarSenha() {
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [senhaAntiga, setSenhaAntiga] = useState("");
    const [senhaNova, setSenhaNova] = useState("");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function handleTrocarSenha(e) {
        e.preventDefault();
        setErro("");
        setMensagem("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URI}/usuarios/me/senha`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    senhaAntiga,
                    senhaNova
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.mensagem || "Erro ao trocar senha");
                return;
            }

            setMensagem(data.mensagem || "Senha alterada com sucesso");
            setSenhaAntiga("");
            setSenhaNova("");
        } catch (error) {
            console.log("Erro ao trocar senha:", error);
            setErro("Erro ao conectar com o servidor");
        }
    }

    return (
        <div className="btnsAndInputs">
            {!mostrarConfirmacao ? (
                <button className="btnTrocarSenha" type="button" onClick={() => setMostrarConfirmacao(true)}>Trocar senha</button>
            ) : (
                <form onSubmit={handleTrocarSenha}>
                    <input
                        type="password"
                        placeholder="Digite sua senha antiga"
                        value={senhaAntiga}
                        onChange={(e) => setSenhaAntiga(e.target.value)}
                    />
    
                    <input
                        type="password"
                        placeholder="Digite sua nova senha"
                        value={senhaNova}
                        onChange={(e) => setSenhaNova(e.target.value)}
                    />
    
                    <button button className="btnConfirmarTroca" type="submit">Confirmar troca</button>
                    <button button className="btnCancelar" type="button" onClick={() => {setMostrarConfirmacao(false); setSenhaAntiga(""); setSenhaNova(""); setErro("");}}>Cancelar</button>
    
                    {mensagem && <p>{mensagem}</p>}
                    {erro && <p>{erro}</p>}
                    </form>
                )}
        </div>
        
    );
}

export default FormTrocarSenha;