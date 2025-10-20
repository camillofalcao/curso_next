import LoginLogout from "./LoginLogout";
import Usuario from "./Usuario";

const BarraTopo = () => {
    return (
        <header className="bg-black text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold">Minha Aplicação</span>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/configuracoes" className="hover:underline">Configurações</a></li>
          </ul>
        </nav>
      </div>
      <LoginLogout />
    </header>
    );
};

export default BarraTopo;
