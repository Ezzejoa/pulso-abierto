import { Link } from "react-router";
import type { CryptoMoneda } from "../types/crypto";
import { formatoUSD } from "../utils";

interface Props {
  moneda: CryptoMoneda;
  destacada: boolean;
  alternarDestacada: (id: CryptoMoneda["id"]) => void;
}

export function TarjetaCripto({ moneda, destacada, alternarDestacada }: Props) {
  return (
    <article className="tarjeta">
      <div className="tarjeta__superior">
        <span className={`moneda-icono moneda-icono--${moneda.color}`} aria-hidden="true">{moneda.sigla}</span>
        <button
          className={`boton-favorito ${destacada ? "boton-favorito--activo" : ""}`}
          type="button"
          onClick={() => alternarDestacada(moneda.id)}
          aria-pressed={destacada}
          aria-label={`${destacada ? "Quitar de" : "Agregar a"} destacados: ${moneda.nombre}`}
          title={destacada ? "Quitar de destacados" : "Marcar como destacada"}
        >
          <span aria-hidden="true">{destacada ? "★" : "☆"}</span>
        </button>
      </div>
      <div className="tarjeta__titulos">
        <h3>{moneda.nombre}</h3>
        <span className="etiqueta">{moneda.simbolo}</span>
      </div>
      <p className="tarjeta__label">Precio actual en USD</p>
      <p className="tarjeta__precio">{formatoUSD(moneda.precioUsd)}</p>
      <div className="tarjeta__inferior">
        {destacada ? <span className="destacada-leyenda">★ Destacada</span> : <span>Datos de CoinGecko</span>}
        <Link className="enlace-detalle" to={`/criptomonedas/${moneda.id}`}>
          Ver detalle <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
