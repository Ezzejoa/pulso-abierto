# Pulso Abierto

Aplicación educativa de Programación Web para consultar en USD los precios de Bitcoin, Ethereum y Solana mediante CoinGecko. Permite filtrar los resultados con un formulario controlado, abrir una página de detalle y conservar monedas favoritas entre vistas y después de recargar.

## Estado de publicación

**Versión final publicada y comprobada el 24 de noviembre de 2026.**

- Repositorio de GitHub: [Ezzejoa/pulso-abierto](https://github.com/Ezzejoa/pulso-abierto).
- Aplicación pública en Vercel: [Pulso Abierto](https://pulso-abierto-gules.vercel.app/).
- Documentación: este `README.md`, dentro de la rama `main`.

El proyecto de Vercel está vinculado con el repositorio de GitHub y utiliza su rama `main` como fuente. La aplicación puede abrirse sin iniciar sesión en Vercel.

## Tecnologías

React 19, TypeScript 5, Vite 7, React Router 7, Zustand 5, Zod 4, Vitest 3 y Testing Library. Las versiones exactas instaladas están registradas en `package-lock.json`.

## Requisitos e instalación

Se recomienda Node.js 22.12 o superior y npm. La preparación se comprobó con Node.js 24.22.3 y npm 11.19.1.

Desde la raíz del proyecto, instalar las dependencias reproducibles con:

```bash
npm ci
```

`npm install` también permite instalarlas, pero puede actualizar el lockfile según las versiones compatibles.

## Comandos disponibles

| Tarea | Comando |
| --- | --- |
| Iniciar desarrollo | `npm run dev` |
| Ejecutar las pruebas automatizadas | `npm run test` |
| Ejecutar pruebas en modo observación | `npm run test:watch` |
| Comprobar tipos de TypeScript | `npm run typecheck` |
| Ejecutar las comprobaciones aisladas heredadas | `npm run test:offline` |
| Generar el build productivo | `npm run build` |
| Servir el build para comprobarlo | `npm run preview` |

El servidor de desarrollo suele abrirse en `http://localhost:5173`; el preview suele usar `http://localhost:4173`. Siempre debe utilizarse la dirección indicada en la terminal. El build genera la carpeta `dist`.

El proyecto no dispone de un script de lint. El build incluye `tsc --noEmit`, con comprobaciones de tipos e importaciones sin uso. El preview es una comprobación local del build y no reemplaza un alojamiento de producción.

## API y variables de entorno

Se conserva el mismo endpoint del proyecto anterior:

```text
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd
```

El acceso HTTP está centralizado en `src/services/coingecko.ts`. El servicio comprueba el estado HTTP, valida el JSON y transforma las cotizaciones al modelo de la aplicación. Los precios mostrados provienen de la respuesta recibida; no hay un reemplazo automático por valores ficticios. Si CoinGecko limita las llamadas (HTTP 429), la interfaz informa el problema y permite reintentar.

Esta versión no utiliza variables de entorno ni claves de API. No hay que configurar variables en Vercel. Si en el futuro el proveedor exige una clave privada, debe incorporarse del lado del servidor y documentarse sin publicarla en el frontend.

## Funcionalidades revisadas y corrección necesaria

La copia recuperada de Pulso Abierto correspondía a la Actividad 2 y guardaba las destacadas en estado local, por lo que se perdían al cambiar de página. Antes del cierre se completó el requisito de persistencia mediante Zustand y su middleware `persist`.

Solo se guardan los identificadores de favoritos bajo la clave `pulso-abierto-favoritos` de `localStorage`. El contador del encabezado permite observar la selección al navegar y recargar. Al regresar al inicio o recargar, se debe presionar «Consultar precios» para solicitar nuevamente las cotizaciones. El almacenamiento no contiene precios ni estados de carga o error.

Se añadieron las pruebas de servicio, formulario, persistencia y recorridos con React Router necesarias para verificar el comportamiento requerido por la Actividad 4.

## Mejora acotada de mantenibilidad

**Problema identificado:** el servicio repetía la comprobación de que un valor recibido era un objeto, no nulo y no un arreglo, tanto al validar el cuerpo principal como al validar cada cotización. También requería conversiones de tipo explícitas.

**Cambio realizado:** se extrajo una única función privada `esRegistro` dentro de `src/services/coingecko.ts` y se reutilizó en ambos puntos. Su predicado de tipo permite a TypeScript reconocer los registros y elimina las conversiones manuales. Se mantienen el endpoint, las monedas admitidas, los mensajes de error y las reglas para aceptar o descartar precios.

**Comprobación de regresiones:** las mismas 19 pruebas automatizadas pasaron antes y después de este cambio y ambos builds se generaron correctamente. Las pruebas del servicio cubren una respuesta válida, formato incorrecto del cuerpo, registros de monedas inválidos, precios inválidos, errores HTTP 429 y 503, fallo de red y propagación de cancelación.

La corrección de favoritos descrita anteriormente completa un recorrido exigido por la consigna; la extracción de `esRegistro` es la única refactorización de mantenibilidad de esta etapa.

## Código y control de versiones

El código fuente está publicado en la rama `main` del repositorio indicado al comienzo. La preparación local conserva el historial de la versión recuperada y las modificaciones de cierre. `node_modules`, `dist`, `coverage`, `.vercel`, archivos de entorno y otros archivos locales están excluidos por `.gitignore`. No deben subirse credenciales ni dependencias instaladas.

El repositorio contiene la raíz del proyecto con su código fuente, pruebas y lockfile. La versión que se utilice para desplegar debe corresponder al commit final de `main`. Para continuar desde otra computadora:

```bash
git clone https://github.com/Ezzejoa/pulso-abierto.git
cd pulso-abierto
npm ci
npm run dev
```

## Publicar en Vercel

1. Confirmar que el repositorio de GitHub contenga la versión final y que el push haya terminado.
2. Importar ese repositorio desde Vercel con la cuenta del estudiante.
3. Elegir el preset **Vite** y la raíz que contiene `package.json`.
4. Utilizar `npm ci` para instalar, `npm run build` para compilar y `dist` como directorio de salida.
5. Desplegar la rama `main` a producción y abrir la URL pública resultante.
6. Completar los recorridos de verificación indicados más abajo y registrar la fecha y el resultado.

`vercel.json` contiene la configuración de Vite y la reescritura a `/index.html` necesaria para abrir o recargar rutas de React Router, por ejemplo `/criptomonedas/bitcoin`.

Documentación oficial de referencia: [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite) y [despliegue de sitios estáticos con Vite](https://vite.dev/guide/static-deploy.html).

## Recorridos para comprobar en preview y producción

- Consultar sin filtros: mostrar Bitcoin, Ethereum y Solana con sus precios en USD.
- Escribir `x`: mostrar la validación de dos caracteres sin consultar. Corregir a `btc`: mostrar Bitcoin. Búsqueda `zz`: informar que no hay coincidencias.
- Combinar el selector de moneda y el texto; comprobar que ambos filtros se apliquen.
- Marcar Bitcoin como favorita, entrar en su detalle, regresar y volver a consultar: debe continuar seleccionada.
- Recargar: comprobar el contador de favoritas y consultar nuevamente para ver la estrella activa.
- Desmarcar y volver a recargar: debe continuar desmarcada.
- Pegar y recargar `/criptomonedas/solana`: debe cargar el detalle sin error 404 del alojamiento.
- Abrir una moneda inexistente y una ruta inexistente: mostrar los mensajes correspondientes.
- Revisar móvil y escritorio, ausencia de desbordamiento horizontal, foco del teclado y errores bloqueantes en Console/Network.
- Si la API falla, observar el mensaje y reintentar cuando vuelva a estar disponible.

## Verificación final

Fecha de verificación: **24 de noviembre de 2026**.

| Comprobación | Resultado |
| --- | --- |
| Instalación reproducible | `npm ci` completado en una copia nueva del código descargado de GitHub. |
| Pruebas automatizadas | `npm run test`: **19 pruebas aprobadas en 4 archivos**, antes y después de la mejora, y en la copia descargada del repositorio. |
| Build productivo | `npm run build` completado con TypeScript y Vite, tanto localmente como en Vercel. Salida: `dist`. |
| Preview | `npm run preview` iniciado y comprobado mediante HTTP 200 en `/` y `/criptomonedas/bitcoin`, con fallback SPA correcto. Los recorridos interactivos completos se comprobaron en la aplicación publicada. |
| Repositorio y publicación del código | Código fuente, lockfile, pruebas, configuración y README publicados en la rama `main` de `Ezzejoa/pulso-abierto`. No se versionaron `node_modules`, `dist` ni archivos de entorno. |
| Despliegue | **Realizado en Vercel, entorno production, estado READY**, a partir del repositorio de GitHub. Instalación: `npm ci`; build: `npm run build`; salida: `dist`; Node.js: `24.x`. |
| Acceso público | [https://pulso-abierto-gules.vercel.app/](https://pulso-abierto-gules.vercel.app/) abre la aplicación sin autenticación. |
| API real | Bitcoin, Ethereum y Solana mostraron cotizaciones reales recibidas de CoinGecko desde el navegador de la versión publicada. |
| Navegación | Apertura del detalle, regreso al listado y recarga directa de `/criptomonedas/bitcoin` comprobados sin error 404. También se abrió el detalle de Ethereum. |
| Favoritos | Marcar Bitcoin, navegar, recargar y regresar conservó la selección. El contador y la estrella reflejaron el estado. También se comprobó desmarcar. |
| Formulario | `x` mostró el error de longitud mínima; al corregir a `btc`, se obtuvo un resultado de Bitcoin. El campo vacío recuperó las tres monedas. |
| Responsividad | Vista angosta de **340 px CSS** y escritorio de **1363 px CSS** comprobados en el navegador. No hubo desbordamiento horizontal; las tarjetas pasaron de una a tres columnas. Se verificó también el detalle en la vista angosta. |
| Consola | No se observaron errores bloqueantes de la aplicación durante los recorridos comprobados. |

La vista angosta se verificó ajustando el zoom del navegador y midiendo el viewport CSS y las dimensiones de los elementos. Al finalizar se restableció el zoom normal.

La versión funcional comprobada corresponde al commit `27716080420924bc25f1f1d60db2d2a64c91ba98`. Las actualizaciones posteriores de esta documentación no modifican las funcionalidades de la aplicación.
