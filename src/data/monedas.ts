import type { CryptoId, CryptoInfo } from "../types/crypto";

/** El universo de monedas es el mismo que en la Actividad 1. */
export const MONEDAS: readonly CryptoInfo[] = [
  {
    id: "bitcoin",
    nombre: "Bitcoin",
    simbolo: "BTC",
    descripcion: "Criptomoneda descentralizada creada para transferir valor entre personas.",
    sigla: "₿",
    color: "bitcoin",
  },
  {
    id: "ethereum",
    nombre: "Ethereum",
    simbolo: "ETH",
    descripcion: "Red blockchain utilizada para contratos inteligentes y aplicaciones descentralizadas.",
    sigla: "Ξ",
    color: "ethereum",
  },
  {
    id: "solana",
    nombre: "Solana",
    simbolo: "SOL",
    descripcion: "Blockchain orientada a aplicaciones y transacciones de alta capacidad.",
    sigla: "◎",
    color: "solana",
  },
];

export function obtenerMonedaPorId(id: string | undefined): CryptoInfo | undefined {
  return MONEDAS.find((moneda) => moneda.id === id);
}

export function esIdAdmitido(id: string | undefined): id is CryptoId {
  return obtenerMonedaPorId(id) !== undefined;
}
