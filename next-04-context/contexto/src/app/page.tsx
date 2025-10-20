'use client';

import { useState, createContext } from "react";
import Usuario from "./Usuario";
import BarraTopo from "./BarraTopo";
import PagamentoMoedas from "./PagamentoMoedas";

interface UsuarioContextType  {
  usuario: Usuario | undefined;
  onLogoff: () => void;
  onLogin: () => void;
};

export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

const App = () => {
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

  const handleLogoff = () => {
    setUsuario(undefined);
  };

  const handleLogin = () => {
    setUsuario({"nome": "João Silva", "email": "joao@email.com"});
  }

  return (
    <UsuarioContext.Provider value={{ usuario, onLogoff: handleLogoff, onLogin: handleLogin }}>
      <BarraTopo />
      <PagamentoMoedas saldoInicial={123.45} />
    </UsuarioContext.Provider>
  );
};

export default App;
