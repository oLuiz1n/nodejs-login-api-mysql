import FormTrocarSenha from "./FormTrocarSenha";
import FormDeletarUsuario from "./FormDeletarUsuario";

function Perfil({ usuario }) {

    if(!usuario) {
        return <p>Nenhum usuario encontrado</p>;
    };

    return (
    <div>
        <p><strong>Nome: </strong> {usuario.nome}</p>
        <p><strong>Email: </strong> {usuario.email}</p>
        <FormTrocarSenha />
        <FormDeletarUsuario />
    </div>
    );
};


export default Perfil;