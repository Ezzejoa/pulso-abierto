import type { CryptoMoneda } from "../types/crypto";
import { TarjetaCripto } from "./TarjetaCripto";

interface Props {
  monedas: CryptoMoneda[];
  destacadas: string[];
  alternarDestacada: (id: CryptoMoneda["id"]) => void;
}

export function ListaCripto({ monedas, destacadas, alternarDestacada }: Props) {
  return (
    <section className="lista" aria-label="Resultados de criptomonedas">
      <div className="lista__cabecera">
        <div>
          <p className="sobretitulo">Cotizaciones consultadas</p>
          <h2>Precios disponibles</h2>
        </div>
        <p className="contador" role="status">{monedas.length} {monedas.length === 1 ? "resultado" : "resultados"}</p>
      </div>
      <div className="rejilla-tarjetas">
        {monedas.map((moneda) => (
          <TarjetaCripto
            key={moneda.id}
            moneda={moneda}
            destacada={destacadas.includes(moneda.id)}
            alternarDestacada={alternarDestacada}
          />
        ))}
      </div>
    </section>
  );
}
