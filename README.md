# referidostesla.com

Web estática de una sola página (HTML + CSS + JS en línea). No hay paso de compilación: el directorio raíz es el que se publica.

## Publicar en Netlify
1. app.netlify.com → **Add new site → Import an existing project → GitHub** → repo `jrg1976/referidosTSL`.
2. Rama a desplegar: la que tenga la versión final. `netlify.toml` ya fija el directorio de publicación (`.`) y no hay build command.
3. **Domain management → Add a domain** `referidostesla.com` y añadir también `www`. Marcar la raíz como dominio principal: Netlify redirige `www` → raíz con 301.
4. DNS: nameservers de Netlify, o registro A/ALIAS para la raíz y CNAME `www` hacia el `*.netlify.app`.
5. **HTTPS**: certificado gratuito y *Force HTTPS*.
6. `_headers` (cabeceras de seguridad y caché) lo lee Netlify sin cambios.
7. `README.md`, `netlify.toml` y `fonts/LICENSE.txt` también se publican; no afectan al SEO.

## Al revisar las condiciones (todo a la vez)
1. `index.html`: buscar `20/10/2026` (1 aparición visible en el footer, dentro de `<time datetime="2026-10-20">`) y el texto de la meta description.
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
- Validar en https://validator.schema.org y en la prueba de resultados enriquecidos de Google tras publicar.
- Alta en Google Search Console y Bing Webmaster Tools, y enviar `sitemap.xml`.
