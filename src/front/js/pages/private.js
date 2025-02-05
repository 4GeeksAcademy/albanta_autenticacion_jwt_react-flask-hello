import React, { useContext, useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [autenticado,setAutenticado] = useState(false)

    useEffect(() => {
        if (!store.token) {
            navigate("/login"); 
        }else{
            fetch(`${process.env.BACKEND_URL}/api/private`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (!response.ok) {
                    navigate("/login")
                }else{
                    setAutenticado(true)
                }
            })
        }
    }, [store.token, navigate]);

    return (
        <>
        {autenticado &&
        <div className="container">
            <h2>Bienvenido a la página privada</h2>
            <p>Solo puedes ver esto si estás autenticado.</p>
        </div>

        }
        </>
    );
};
