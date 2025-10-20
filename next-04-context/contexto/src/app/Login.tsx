import React, { useContext } from "react";
import { UsuarioContext } from "./page";

const Login = () => {
    const contexto = useContext(UsuarioContext);

    if (!contexto) {
        throw new Error("Login deve ser usado dentro de um UsuarioContext.Provider");
    }
    const { onLogin } = contexto;

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onLogin}
                className="bg-gray-200 hover:bg-white text-black px-3 py-1 rounded transition"
            >
                Login
            </button>
        </div>
    );
};

export default Login;
