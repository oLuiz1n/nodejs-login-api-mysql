import { useState } from "react";

function FormDeletarUsuario() {
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function handleDeletar(e) {
        e.preventDefault();
        setErro("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URI}/usuarios/me`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ senha })
            });

            const data = await response.json();

            if(!response.ok) {
                setErro(data.mensagem || "Erro ao deletar usuario");
                return;
            }

            localStorage.removeItem("token");
            window.location.href = "/"
        } catch (error) {
            console.log("Erro ao deletar usuario:", error);
            setErro("Erro ao conectar com o servidor");
        }
    }

    return (
        <div>
            {!mostrarConfirmacao ? (
                <button type="button" onClick={() => setMostrarConfirmacao(true)}>Deletar usuario</button>
            ) : (
                <form onSubmit={handleDeletar}>
                    <input  type="password" placeholder="Confirme sua senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>

                    <button type="submit">Confirmar exclusão</button>
                    <button type="button" onClick={() => {setMostrarConfirmacao(false); setSenha(""); setErro("");}}>Cancelar</button>

                    {erro && <p>{erro}</p>}
                </form>
            )}
        </div>
    )
}

export default FormDeletarUsuario;