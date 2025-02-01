import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/login"); // Redirigir tras logout
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">React Boilerplate</span>
                </Link>
                <div className="ml-auto">
                    {!store.token ? (
                        <>
                            <Link to="/signup">
                                <button className="btn btn-secondary me-2">Signup</button>
                            </Link>
                            <Link to="/login">
                                <button className="btn btn-primary">Login</button>
                            </Link>
                        </>
                    ) : (
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
