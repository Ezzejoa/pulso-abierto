import { Link, Route, Routes } from "react-router";
import { InicioPage } from "./pages/InicioPage";
import { DetallePage } from "./pages/DetallePage";
import { NoEncontradoPage } from "./pages/NoEncontradoPage";
import { useFavoritosStore } from "./stores/favoritos";

function App() {
  const cantidadFavoritos = useFavoritosStore((estado) => estado.favoritos.length);
  return (
    <div className="app-shell">
      <a className="saltar-contenido" href="#contenido">Saltar al contenido principal</a>
      <header className="cabecera">
        <div className="contenedor cabecera__interior">
          <Link to="/" className="marca" aria-label="Pulso Abierto, volver al inicio">
            <span className="marca__icono" aria-hidden="true">⌁</span>
            <span>Pulso <strong>Abierto</strong></span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link to="/" className="nav-enlace">Consulta de precios</Link>
            <span className="favoritos-resumen" aria-live="polite">
              ★ {cantidadFavoritos} {cantidadFavoritos === 1 ? "favorita" : "favoritas"}
            </span>
          </nav>
        </div>
      </header>

      <main className="contenedor principal" id="contenido">
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/criptomonedas/:id" element={<DetallePage />} />
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </main>

      <footer className="pie">
        <div className="contenedor pie__interior">
          <span>© 2026 Pulso Abierto</span>
          <span>Información de precios proporcionada por CoinGecko · Solo fines educativos</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
