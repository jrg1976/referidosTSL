# referidostesla.com

Web estática de una sola página (HTML + CSS + JS en línea). No hay paso de compilación: el directorio raíz es el que se publica.

## Alojamiento: Cloudflare Pages
- Proyecto `referidostesla` conectado a este repo; rama de producción `claude/sleepy-thompson-vrsjm3`. Cada commit en esa rama se publica solo.
- Framework preset *None*, sin build command, directorio de salida en la raíz.
- Dominio `referidostesla.com` con DNS en Cloudflare (nameservers de Cloudflare; el registrador es Spaceship). `www` redirige con 301 a la raíz (Redirect Rule) y HTTPS está forzado.
- `_headers` define las cabeceras de seguridad y de caché. `404.html` hace que las rutas inexistentes devuelvan 404.
- No activar Web Analytics, Rocket Loader ni ofuscación de correo: modificarían el HTML.
- La app de Cloudflare en GitHub solo tiene acceso a este repo.
- `README.md` y `fonts/LICENSE.txt` también se publican; no afectan al SEO.

## Estadísticas propias (sin cookies)
- `functions/api/hit.js` (POST `/api/hit`): suma 1 al contador del día en una base D1 (tabla `stats`: día de Madrid, tipo `view`/`click`, botón). Ignora bots, peticiones de otro origen y botones desconocidos. No guarda IP ni identificadores.
- `functions/panel/index.js` (GET `/panel`): panel con visitas y clics de los últimos 30 días. Solo responde si la petición viene de Cloudflare Access (cabecera `Cf-Access-Jwt-Assertion`).
- `_routes.json` limita las funciones a `/api/*` y `/panel*`; el resto de la web sigue siendo estático.
- En `index.html` cada botón hacia `ts.la` lleva `data-t` (`header`, `menu`, `hero`, `model3`, `modely`, `cierre`, `barra`). El script del final envía la visita y los clics con `sendBeacon`.
- Puesta en marcha (Cloudflare): crear una base D1 y ejecutar
  `CREATE TABLE IF NOT EXISTS stats (day TEXT NOT NULL, kind TEXT NOT NULL, label TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, kind, label));`
  Enlazarla al proyecto de Pages (Settings > Bindings > D1, variable `DB`, en producción) y proteger `referidostesla.com/panel*` con una aplicación de Cloudflare Access (política: tu correo, código por correo).
- Alternativa a Access: crear el secreto `PANEL_TOKEN` en el proyecto de Pages; entonces el panel solo se abre con `/panel/?k=<valor>` (la cabecera de Access deja de contar).
- Sin la base D1 enlazada, `/api/hit` no hace nada y la web funciona igual.

## Al revisar las condiciones (todo a la vez)
1. `index.html`: buscar `20/10/2026` (1 aparición visible en el footer, dentro de `<time datetime="2026-10-20">`).
2. `index.html` JSON-LD: `dateModified` y la fecha de la `description` del WebPage.
3. `sitemap.xml`: `<lastmod>`.
4. `llms.txt`: fecha de comprobación.
5. Si cambia el texto de una FAQ, cambiarlo igual en el `<details>` y en el JSON-LD (deben ser idénticos).
6. Si se llega a 10 recomendaciones en el año, añadir un aviso visible en el hero.

## Pendiente
- **Fotos provisionales de tesla.com (© Tesla, Inc.), solo para la demo. Sustituir antes de publicar:**
  - `img/hero-model3-rojo-*.webp` (hero) y `img/cierre-modely-plata-*.webp` (cierre): press kit de Tesla. `img/model3-*.webp` y `img/modely-*.webp` (Modelos): tesla.com.
  - `img/corazon-446.webp` (robot, «Quién recomienda»): cambiar por la foto propia del propietario haciendo un corazón delante de su Model 3, proporción 4:5, con alt «Propietario haciendo un corazón con las manos delante de su Tesla Model 3».
  - Si la licencia de las fotos definitivas exige crédito, añadirlo en el footer.
