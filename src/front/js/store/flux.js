const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: sessionStorage.getItem("token") || null, 
            user: null 
        },
        actions: {
       
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

            
            login: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    if (!response.ok) throw new Error("Credenciales incorrectas");

                    const data = await response.json();
                    sessionStorage.setItem("token", data.token); 
                    setStore({ token: data.token });

                    console.log("Usuario autenticado:", data);
                    return true;
                } catch (error) {
                    console.error("Error en login:", error);
                    return false;
                }
            },

          
            logout: () => {
                sessionStorage.removeItem("token"); 
                setStore({ token: null, user: null });
                console.log("Sesión cerrada");
            },

            
            isAuthenticated: () => {
                return !!getStore().token; 
            }
        }
    };
};

export default getState;
