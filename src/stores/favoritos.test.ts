import { beforeEach, describe, expect, it } from "vitest";
import { useFavoritosStore } from "./favoritos";

beforeEach(() => {
  localStorage.clear();
  useFavoritosStore.setState({ favoritos: [] });
});

describe("Favoritos persistentes", () => {
  it("marca y desmarca una moneda sin duplicarla", () => {
    useFavoritosStore.getState().alternarFavorito("bitcoin");
    expect(useFavoritosStore.getState().favoritos).toEqual(["bitcoin"]);
    useFavoritosStore.getState().alternarFavorito("bitcoin");
    expect(useFavoritosStore.getState().favoritos).toEqual([]);
  });

  it("recupera los favoritos guardados después de rehidratar el store", async () => {
    useFavoritosStore.getState().alternarFavorito("ethereum");
    const guardado = localStorage.getItem("pulso-abierto-favoritos");
    useFavoritosStore.setState({ favoritos: [] });
    localStorage.setItem("pulso-abierto-favoritos", guardado!);
    await useFavoritosStore.persist.rehydrate();
    expect(useFavoritosStore.getState().favoritos).toEqual(["ethereum"]);
    expect(Object.keys(JSON.parse(guardado!).state)).toEqual(["favoritos"]);
  });

  it("ignora identificadores desconocidos y duplicados en el almacenamiento", async () => {
    localStorage.setItem("pulso-abierto-favoritos", JSON.stringify({
      state: { favoritos: ["solana", "solana", "inventada", 7] }, version: 1,
    }));
    await useFavoritosStore.persist.rehydrate();
    expect(useFavoritosStore.getState().favoritos).toEqual(["solana"]);
  });
});
