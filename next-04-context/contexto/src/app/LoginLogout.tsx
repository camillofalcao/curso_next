import { useContext } from "react";
import { UsuarioContext } from "./page";
import Login from "./Login";
import Logout from "./Logout";

const LoginLogout = () => {
    const usuario = useContext(UsuarioContext)?.usuario;

    return (
        <div className="flex items-center gap-4">
            {usuario ? (
                <Logout />
            ) : (
                <Login />
            )}
        </div>
    );
};

export default LoginLogout;
