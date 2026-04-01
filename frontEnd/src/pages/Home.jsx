import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Perfil from "../components/Perfil.jsx";


function Home() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function buscarPerfil() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URI}/usuarios/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    localStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                setUsuario(data);
            } catch (error) {
                console.log("Erro ao buscar perfil:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        }

        buscarPerfil();
    }, [navigate]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Seu Perfil</h1>
            <Perfil usuario={usuario} />
        </div>
    );
}

export default Home;