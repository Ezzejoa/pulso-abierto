import type { EstadoConsulta } from "../types/crypto";

interface Props {
  estado: EstadoConsulta;
  error?: string;
  reintentar: () => void;
}

export function EstadoOperacion({ estado, error, reintentar }: Props) {
  if (estado === "inicial") {
    return (
      <div className="estado estado--inicial" role="status">
        <span className="estado__simbolo" aria-hidden="true">↗</span>
        <h2>Todo listo para empezar</h2>
        <p>Consultá los precios en dólares de Bitcoin, Ethereum y Solana.</p>
      </div>
    );
  }
  if (estado === "cargando") {
    return (
      <div className="estado" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <h2>Consultando precios...</h2>
        <p>Estamos solicitando información a CoinGecko.</p>
      </div>
    );
  }
  if (estado === "vacio") {
    return (
      <div className="estado" role="status">
        <span className="estado__simbolo" aria-hidden="true">∅</span>
        <h2>No hay datos disponibles</h2>
        <p>La API no devolvió precios válidos para las monedas consultadas.</p>
        <button type="button" className="boton boton--secundario" onClick={reintentar}>Reintentar consulta</button>
      </div>
    );
  }
  if (estado === "error") {
    return (
      <div className="estado estado--error" role="alert">
        <span className="estado__simbolo" aria-hidden="true">!</span>
        <h2>No pudimos obtener los precios</h2>
        <p>{error || "Ocurrió un problema al consultar la información."}</p>
        <button type="button" className="boton boton--secundario" onClick={reintentar}>Volver a intentar</button>
      </div>
    );
  }
  return null;
}
