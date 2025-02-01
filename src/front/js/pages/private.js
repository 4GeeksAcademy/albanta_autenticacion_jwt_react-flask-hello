import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate("/login"); // Si no hay token, redirige al login
        }
    }, [store.token, navigate]);

    return (
        <div className="container">
            <h2>Bienvenido a la página privada</h2>
            <p>Solo puedes ver esto si estás autenticado.</p>
        </div>
    );
};
