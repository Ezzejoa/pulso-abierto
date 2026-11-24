export function formatoUSD(precio: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: precio < 1 ? 6 : 2,
  }).format(precio);
}
