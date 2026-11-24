import type { CryptoMoneda, FiltrosConsulta } from "../types/crypto";

/** Devuelve una colección nueva sin alterar los datos originales. */
export function filtrarMonedas(monedas: readonly CryptoMoneda[], filtros: FiltrosConsulta): CryptoMoneda[] {
  const texto = filtros.texto.trim().toLocaleLowerCase("es-AR");
  return monedas.filter((moneda) => {
    const coincideSeleccion = filtros.moneda === "todas" || filtros.moneda === moneda.id;
    const coincideTexto =
      texto.length === 0 ||
      moneda.nombre.toLocaleLowerCase("es-AR").includes(texto) ||
      moneda.simbolo.toLocaleLowerCase("es-AR").includes(texto);
    return coincideSeleccion && coincideTexto;
  });
}
