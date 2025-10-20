import { useContext } from "react";
import { UsuarioContext } from "./page";

const Logout = () => {
    const { usuario, onLogoff } = useContext(UsuarioContext) ?? {};

    if (!onLogoff) {
        throw new Error("Logout deve ser usado dentro de um UsuarioContext.Provider");
    }

    return (
        <div className="flex items-center gap-4">
            <span>{usuario?.nome}</span>
            <button
                onClick={onLogoff}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded transition"
            >
                Logoff
            </button>
        </div>
    );
};

export default Logout;
