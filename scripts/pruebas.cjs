/* Pruebas aisladas de reglas y servicio HTTP, sin acceso real a internet.
   Ejecutar después de npm install: npm run test:offline */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const raiz = path.join(__dirname, "..");
let archivosAnalizados = 0;
let rutasLocalesRevisadas = 0;

function verificarSintaxis(carpeta) {
  for (const item of fs.readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = path.join(carpeta, item.name);
    if (item.isDirectory()) verificarSintaxis(ruta);
    else if (/\.(ts|tsx)$/.test(item.name)) {
      const contenido = fs.readFileSync(ruta, "utf8");
      const source = ts.createSourceFile(ruta, contenido, ts.ScriptTarget.Latest, true, ruta.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      assert.equal(source.parseDiagnostics.length, 0, `Errores de sintaxis en ${ruta}`);
      for (const nodo of source.statements) {
        if (!ts.isImportDeclaration(nodo) || !ts.isStringLiteral(nodo.moduleSpecifier)) continue;
        const modulo = nodo.moduleSpecifier.text;
        if (!modulo.startsWith(".")) continue;
        const base = path.resolve(path.dirname(ruta), modulo);
        assert.ok([base, `${base}.ts`, `${base}.tsx`, `${base}.js`, path.join(base, "index.ts")].some(fs.existsSync), `Falta el archivo importado: ${modulo} en ${ruta}`);
        rutasLocalesRevisadas += 1;
      }
      archivosAnalizados += 1;
    }
  }
}

function crearCargador(fetchSimulado) {
  const cache = new Map();
  function cargar(ruta) {
    const nombre = ruta.endsWith(".ts") ? ruta : `${ruta}.ts`;
    if (cache.has(nombre)) return cache.get(nombre).exports;
    const fuente = fs.readFileSync(nombre, "utf8");
    const salida = ts.transpileModule(fuente, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
    const modulo = { exports: {} };
    cache.set(nombre, modulo);
    const importar = (nombreModulo) => {
      if (!nombreModulo.startsWith(".")) throw Error(`Importación externa no admitida en esta prueba: ${nombreModulo}`);
      return cargar(path.resolve(path.dirname(nombre), nombreModulo));
    };
    const ejecutar = vm.runInNewContext(`(function(require,module,exports){\n${salida}\n})`, { fetch: fetchSimulado, AbortController, console });
    ejecutar(importar, modulo, modulo.exports);
    return modulo.exports;
  }
  return (ruta) => cargar(path.join(raiz, ruta));
}

async function correr() {
  verificarSintaxis(path.join(raiz, "src"));
  const config = path.join(raiz, "vite.config.ts");
  const fuenteConfig = ts.createSourceFile(config, fs.readFileSync(config, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(fuenteConfig.parseDiagnostics.length, 0, "Error de sintaxis en vite.config.ts");
  archivosAnalizados += 1;
  console.log(`✓ Sintaxis TypeScript/TSX: ${archivosAnalizados} archivos; ${rutasLocalesRevisadas} importaciones locales verificadas`);

  const respuestaValida = { bitcoin: { usd: 91000 }, ethereum: { usd: 3100 }, solana: { usd: 175 } };
  const importar = crearCargador(async () => ({ ok: true, json: async () => respuestaValida }));
  const { consultarPrecios } = importar("src/services/coingecko.ts");
  const { filtrarMonedas } = importar("src/utils/filtrarMonedas.ts");
  const { obtenerMonedaPorId } = importar("src/data/monedas.ts");

  const monedas = await consultarPrecios();
  assert.equal(monedas.length, 3);
  assert.equal(monedas.map((moneda) => moneda.id).join(","), "bitcoin,ethereum,solana");
  assert.equal(monedas[0].precioUsd, 91000);
  assert.equal(obtenerMonedaPorId("solana").simbolo, "SOL");
  assert.equal(obtenerMonedaPorId("inventada"), undefined);
  console.log("✓ API simulada: respuesta válida y catálogo de tres monedas");

  assert.equal(filtrarMonedas(monedas, { texto: "  btc  ", moneda: "todas" }).length, 1);
  assert.equal(filtrarMonedas(monedas, { texto: "", moneda: "ethereum" })[0].id, "ethereum");
  assert.equal(filtrarMonedas(monedas, { texto: "zz", moneda: "todas" }).length, 0);
  assert.equal(monedas.length, 3, "El filtro no debe mutar el arreglo original");
  console.log("✓ Filtrado por texto, selección y ausencia de coincidencias");

  const conParcial = crearCargador(async () => ({ ok: true, json: async () => ({ bitcoin: { usd: 5 }, ethereum: { usd: -3 }, solana: { usd: "17" } }) }));
  assert.equal((await conParcial("src/services/coingecko.ts").consultarPrecios()).length, 1);
  console.log("✓ Datos incompletos o de tipo incorrecto se descartan");

  const conRateLimit = crearCargador(async () => ({ ok: false, status: 429 }));
  await assert.rejects(conRateLimit("src/services/coingecko.ts").consultarPrecios(), /demasiadas solicitudes/);
  const conError = crearCargador(async () => ({ ok: false, status: 503 }));
  await assert.rejects(conError("src/services/coingecko.ts").consultarPrecios(), /503/);
  const conJSONInvalido = crearCargador(async () => ({ ok: true, json: async () => [] }));
  await assert.rejects(conJSONInvalido("src/services/coingecko.ts").consultarPrecios(), /formato inesperado/);
  console.log("✓ Errores HTTP 429, 503 y respuesta JSON inválida");

  console.log("Pruebas aisladas finalizadas correctamente. No sustituyen npm run build ni las pruebas manuales en navegador.");
}

correr().catch((error) => { console.error(error); process.exitCode = 1; });
