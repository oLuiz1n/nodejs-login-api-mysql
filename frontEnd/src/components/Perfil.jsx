import FormTrocarSenha from "./FormTrocarSenha";
import FormDeletarUsuario from "./FormDeletarUsuario";
import "../style.css";

function Perfil({ usuario }) {

    if(!usuario) {
        return <p>Nenhum usuario encontrado</p>;
    };

    return (
    <div>
        <div className="mostraDados">
        <p><strong>Nome: </strong> {usuario.nome}</p>
        <p><strong>Email: </strong> {usuario.email}</p>
        </div>
        <FormTrocarSenha />
        <FormDeletarUsuario />
    </div>
    );
};


export default Perfil;