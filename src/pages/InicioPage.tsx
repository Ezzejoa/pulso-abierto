import { useEffect, useMemo, useRef, useState } from "react";
import { FormularioConsulta } from "../components/FormularioConsulta";
import { EstadoOperacion } from "../components/EstadoOperacion";
import { ListaCripto } from "../components/ListaCripto";
import { consultarPrecios } from "../services/coingecko";
import { filtrarMonedas } from "../utils/filtrarMonedas";
import { useFavoritosStore } from "../stores/favoritos";
import type { CryptoMoneda, EstadoConsulta, FiltrosConsulta } from "../types/crypto";

const FILTROS_INICIALES: FiltrosConsulta = { texto: "", moneda: "todas" };

export function InicioPage() {
  const [estado, setEstado] = useState<EstadoConsulta>("inicial");
  const [monedas, setMonedas] = useState<CryptoMoneda[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosConsulta>(FILTROS_INICIALES);
  const destacadas = useFavoritosStore((estado) => estado.favoritos);
  const alternarDestacada = useFavoritosStore((estado) => estado.alternarFavorito);
  const [mensajeError, setMensajeError] = useState("");
  const numeroSolicitud = useRef(0);

  // Las solicitudes más antiguas se descartan para evitar resultados desactualizados.
  useEffect(() => () => { numeroSolicitud.current += 1; }, []);

  async function realizarConsulta() {
    const solicitudActual = ++numeroSolicitud.current;
    setEstado("cargando");
    setMensajeError("");
    try {
      const resultado = await consultarPrecios();
      if (solicitudActual !== numeroSolicitud.current) return;
      setMonedas(resultado);
      setEstado(resultado.length > 0 ? "resultado" : "vacio");
    } catch (error: unknown) {
      if (solicitudActual !== numeroSolicitud.current) return;
      setMonedas([]);
      setMensajeError(error instanceof Error ? error.message : "Error desconocido al consultar la API.");
      setEstado("error");
    }
  }

  function buscar(filtros: FiltrosConsulta) {
    setFiltrosAplicados(filtros);
    void realizarConsulta();
  }

  // Tanto el filtrado como el contador son datos DERIVADOS, no estados duplicados.
  const visibles = useMemo(() => filtrarMonedas(monedas, filtrosAplicados), [monedas, filtrosAplicados]);

  return (
    <>
      <section className="hero" aria-labelledby="titulo-principal">
        <div className="hero__contenido">
          <p className="hero__etiqueta"><span className="punto-vivo" /> Tu radar del mercado cripto</p>
          <h1 id="titulo-principal">El mercado cripto, <span>sin complicaciones.</span></h1>
          <p className="hero__subtitulo">
            Seguimos el precio de Bitcoin, Ethereum y Solana en dólares estadounidenses.
            Consultá, filtrá y explorá cada moneda en un solo lugar.
          </p>
          <div className="hero__cifras" aria-label="Características de la aplicación">
            <span><strong>03</strong> criptomonedas</span>
            <span><strong>USD</strong> cotización</span>
            <span><strong>API</strong> CoinGecko</span>
          </div>
        </div>
        <div className="hero__grafico" aria-hidden="true">
          <span className="grafico__etiqueta">PULSO / MERCADO</span>
          <svg viewBox="0 0 380 230" role="img" focusable="false">
            <defs>
              <linearGradient id="relleno" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#70dfd1" stopOpacity=".33" />
                <stop offset="1" stopColor="#70dfd1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 196 H380 M0 137 H380 M0 78 H380 M52 0 V230 M147 0 V230 M242 0 V230 M337 0 V230" stroke="#ffffff" strokeOpacity=".09" fill="none"/>
            <path d="M0 183L42 174L73 187L111 145L155 160L183 116L223 132L260 77L294 93L337 38L380 49V230H0Z" fill="url(#relleno)"/>
            <path d="M0 183L42 174L73 187L111 145L155 160L183 116L223 132L260 77L294 93L337 38L380 49" fill="none" stroke="#79e8d3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="337" cy="38" r="7" fill="#79e8d3"/>
            <circle cx="337" cy="38" r="15" fill="#79e8d3" fillOpacity=".13"/>
          </svg>
          <span className="grafico__pie">Valores reales disponibles al consultar</span>
        </div>
      </section>

      <section className="panel-consulta" aria-labelledby="titulo-consulta">
        <div className="panel-consulta__intro">
          <div>
            <p className="sobretitulo">01 / Explorador</p>
            <h2 id="titulo-consulta">Encontrá tu criptomoneda</h2>
          </div>
          <p>Elegí una moneda, escribí una búsqueda o dejá los campos como están para ver las tres.</p>
        </div>
        <FormularioConsulta alConsultar={buscar} cargando={estado === "cargando"} />
      </section>

      <div className="contenido-resultados" aria-live="polite" aria-relevant="additions text">
        {estado === "resultado" ? (
          visibles.length > 0 ? (
            <ListaCripto monedas={visibles} destacadas={destacadas} alternarDestacada={alternarDestacada} />
          ) : (
            <div className="estado" role="status">
              <span className="estado__simbolo" aria-hidden="true">⌕</span>
              <h2>No hay coincidencias</h2>
              <p>La API respondió, pero ningún resultado coincide con tus filtros. Probá otro nombre o selección.</p>
            </div>
          )
        ) : (
          <EstadoOperacion
            estado={estado}
            error={mensajeError}
            reintentar={() => { void realizarConsulta(); }}
          />
        )}
      </div>
      <p className="nota-datos">
        Los precios provienen de una API pública, pueden cambiar y no constituyen asesoramiento financiero.
      </p>
    </>
  );
}
