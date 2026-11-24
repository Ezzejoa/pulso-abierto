export type CryptoId = "bitcoin" | "ethereum" | "solana";

export interface CryptoInfo {
  id: CryptoId;
  nombre: string;
  simbolo: string;
  descripcion: string;
  color: string;
  sigla: string;
}

export interface CryptoMoneda extends CryptoInfo {
  precioUsd: number;
}

export type SeleccionMoneda = "todas" | CryptoId;

export interface FiltrosConsulta {
  texto: string;
  moneda: SeleccionMoneda;
}

export type EstadoConsulta = "inicial" | "cargando" | "resultado" | "vacio" | "error";
