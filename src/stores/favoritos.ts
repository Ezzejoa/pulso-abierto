import { create } from "zustand";
import { persist } from "zustand/middleware";
import { esIdAdmitido } from "../data/monedas";
import type { CryptoId } from "../types/crypto";

interface FavoritosState {
  favoritos: CryptoId[];
  alternarFavorito: (id: CryptoId) => void;
}

export const useFavoritosStore = create<FavoritosState>()(
  persist(
    (set) => ({
      favoritos: [],
      alternarFavorito: (id) => set((estado) => ({
        favoritos: estado.favoritos.includes(id)
          ? estado.favoritos.filter((favorito) => favorito !== id)
          : [...estado.favoritos, id],
      })),
    }),
    {
      name: "pulso-abierto-favoritos",
      version: 1,
      partialize: (estado) => ({ favoritos: estado.favoritos }),
      merge: (guardado, actual) => {
        const datos = guardado as { favoritos?: unknown } | null;
        const favoritos = Array.isArray(datos?.favoritos)
          ? datos.favoritos.filter((id): id is CryptoId => typeof id === "string" && esIdAdmitido(id))
          : [];
        return { ...actual, favoritos: [...new Set(favoritos)] };
      },
    },
  ),
);
