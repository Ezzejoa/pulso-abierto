import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { obtenerMonedaPorId } from "../data/monedas";
import { consultarPrecios } from "../services/coingecko";
import type { CryptoMoneda } from "../types/crypto";
import { formatoUSD } from "../utils";

export function DetallePage() {
  const { id } = useParams<{ id: string }>();
  const info = obtenerMonedaPorId(id);
  const [moneda, setMoneda] = useState<CryptoMoneda | null>(null);
  const [estado, setEstado] = useState<"cargando" | "resultado" | "vacio" | "error">("cargando");
  const [error, setError] = useState("");
  const [reintentos, setReintentos] = useState(0);

  useEffect(() => {
    if (!obtenerMonedaPorId(id)) return;
    const controlador = new AbortController();
    setEstado("cargando");
    setMoneda(null);

    async function cargar() {
      try {
        const monedas = await consultarPrecios(controlador.signal);
        if (controlador.signal.aborted) return;
        const encontrada = monedas.find((item) => item.id === id) ?? null;
        setMoneda(encontrada);
        setEstado(encontrada ? "resultado" : "vacio");
      } catch (problema: unknown) {
        if (controlador.signal.aborted) return;
        setError(problema instanceof Error ? problema.message : "No se pudo consultar la cotización.");
        setEstado("error");
      }
    }

    void cargar();
    return () => controlador.abort();
  }, [id, reintentos]);

  // Validación de URL: no se puede mostrar un identificador ajeno a las 3 monedas permitidas.
  if (!info) {
    return (
      <section className="pagina-estatica" role="status">
        <p className="sobretitulo">Detalle no disponible</p>
        <h1>Esta criptomoneda no existe en Pulso Abierto.</h1>
        <p>El identificador indicado en la dirección no corresponde a Bitcoin, Ethereum o Solana.</p>
        <Link className="boton boton--principal" to="/">Volver a la consulta</Link>
      </section>
    );
  }

  return (
    <section className="detalle" aria-labelledby="titulo-detalle">
      <Link to="/" className="enlace-volver">← Volver a los resultados</Link>
      <div className="detalle__cabecera">
        <div className={`moneda-icono moneda-icono--${info.color} moneda-icono--grande`} aria-hidden="true">{info.sigla}</div>
        <div>
          <p className="sobretitulo">02 / Información de la moneda</p>
          <h1 id="titulo-detalle">{info.nombre} <span className="etiqueta">{info.simbolo}</span></h1>
          <p className="detalle__descripcion">{info.descripcion}</p>
        </div>
      </div>
      {estado === "cargando" && (
        <div className="estado" role="status"><span className="spinner" aria-hidden="true" /><h2>Cargando detalle...</h2><p>Consultando el último precio disponible.</p></div>
      )}
      {estado === "resultado" && moneda && (
        <div className="detalle__panel">
          <p className="tarjeta__label">Cotización de {moneda.nombre} en dólares</p>
          <p className="detalle__precio">{formatoUSD(moneda.precioUsd)}</p>
          <div className="detalle__datos">
            <div><span>Identificador</span><strong>{moneda.id}</strong></div>
            <div><span>Símbolo</span><strong>{moneda.simbolo}</strong></div>
            <div><span>Moneda de referencia</span><strong>USD</strong></div>
            <div><span>Fuente de los datos</span><strong>CoinGecko</strong></div>
          </div>
        </div>
      )}
      {estado === "vacio" && (
        <div className="estado" role="status"><h2>Sin datos disponibles</h2><p>Esta moneda existe, pero la API no devolvió su cotización.</p><button type="button" className="boton boton--secundario" onClick={() => setReintentos((prev) => prev + 1)}>Reintentar</button></div>
      )}
      {estado === "error" && (
        <div className="estado estado--error" role="alert"><h2>No se pudo cargar el detalle</h2><p>{error}</p><button type="button" className="boton boton--secundario" onClick={() => setReintentos((prev) => prev + 1)}>Reintentar</button></div>
      )}
      <p className="nota-datos">Este detalle se consulta directamente desde la URL, incluso después de actualizar la página.</p>
    </section>
  );
}
