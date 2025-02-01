const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: sessionStorage.getItem("token") || null, // 🔹 Guardamos el token en el estado global
            user: null // 🔹 Aquí guardaremos los datos del usuario autenticado
        },
        actions: {
            // 🔹 REGISTRAR USUARIO (SIGNUP)
            signup: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });
                    if (!response.ok) throw new Error("Error al registrar usuario");

                    const data = await response.json();
                    console.log("Usuario registrado:", data);
                    return true;
                } catch (error) {
                    console.error("Error en signup:", error);
                    return false;
                }
            },

            // 🔹 INICIAR SESIÓN (LOGIN)
            login: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    if (!response.ok) throw new Error("Credenciales incorrectas");

                    const data = await response.json();
                    sessionStorage.setItem("token", data.token); // 🔹 Guardamos el token
                    setStore({ token: data.token });

                    console.log("Usuario autenticado:", data);
                    return true;
                } catch (error) {
                    console.error("Error en login:", error);
                    return false;
                }
            },

            // 🔹 CERRAR SESIÓN (LOGOUT)
            logout: () => {
                sessionStorage.removeItem("token"); // 🔹 Eliminamos el token
                setStore({ token: null, user: null });
                console.log("Sesión cerrada");
            },

            // 🔹 VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
            isAuthenticated: () => {
                return !!getStore().token; // 🔹 Si hay token, el usuario está autenticado
            }
        }
    };
};

export default getState;
