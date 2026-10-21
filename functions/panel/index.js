const BOTONES = { header: 'Cabecera', menu: 'Menú móvil', hero: 'Portada', cierre: 'Cierre', barra: 'Barra móvil' };
const DIAS = 30;

const hoyMadrid = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date());
const restarDias = (dia, n) => new Date(new Date(dia + 'T12:00:00Z').getTime() - n * 864e5).toISOString().slice(0, 10);
const fmt = (n) => n.toLocaleString('es-ES');
const pct = (a, b) => (b ? (a / b * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' %' : '–');
const fechaCorta = (d) => d.slice(8) + '/' + d.slice(5, 7);

function pagina(cuerpo) {
  return `<!doctype html>
<html lang="es-ES"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Panel de estadísticas</title><meta name="robots" content="noindex, nofollow">
<style>
:root{--bg:#fff;--surface:#F4F4F4;--ink:#171A20;--text:#393C41;--muted:#5C5E62;--line:#E2E3E3;--views:#B9BCC2;--clicks:#3E6AE1}
@media (prefers-color-scheme:dark){:root{--bg:#171A20;--surface:#222630;--ink:#fff;--text:#D0D1D2;--muted:#A2A3A5;--line:#323744;--views:#5C6270;--clicks:#7C9CF0}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:400 14px/20px "Inter Site",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
@font-face{font-family:"Inter Site";src:url(/fonts/inter-regular.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Inter Site";src:url(/fonts/inter-medium.woff2) format("woff2");font-weight:500;font-display:swap}
main{max-width:960px;margin:0 auto;padding:32px 16px 64px}
h1{margin:0 0 4px;color:var(--ink);font-size:28px;line-height:36px;font-weight:500}
h2{margin:40px 0 12px;color:var(--ink);font-size:18px;line-height:26px;font-weight:500}
.sub{margin:0;color:var(--muted)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:24px}
.kpi{background:var(--surface);border-radius:12px;padding:20px}
.kpi p{margin:0;color:var(--muted)}
.kpi strong{display:block;margin:4px 0 2px;color:var(--ink);font-size:32px;line-height:40px;font-weight:500;font-variant-numeric:tabular-nums}
.leyenda{display:flex;gap:16px;margin:0 0 8px;color:var(--muted)}
.leyenda i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;vertical-align:-1px}
svg{display:block;width:100%;height:auto}
.tabla{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
th,td{padding:10px 12px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}
th:first-child,td:first-child{text-align:left}
th{color:var(--muted);font-weight:500}
tr.hoy td{color:var(--ink);font-weight:500}
.aviso{margin-top:48px;color:var(--muted)}
</style></head><body><main>${cuerpo}</main></body></html>`;
}

function grafica(dias, vistas, clics) {
  const W = 720, H = 200, base = 176, alto = 150;
  const max = Math.max(1, ...dias.map((d) => vistas[d] || 0));
  const paso = W / dias.length, ancho = Math.max(3, paso * 0.34);
  const barras = dias.map((d, i) => {
    const x = i * paso + paso * 0.14;
    const hv = ((vistas[d] || 0) / max) * alto, hc = ((clics[d] || 0) / max) * alto;
    return `<rect x="${x.toFixed(1)}" y="${(base - hv).toFixed(1)}" width="${ancho.toFixed(1)}" height="${hv.toFixed(1)}" rx="1.5" fill="var(--views)"><title>${fechaCorta(d)}: ${vistas[d] || 0} visitas</title></rect>` +
      `<rect x="${(x + ancho + 1).toFixed(1)}" y="${(base - hc).toFixed(1)}" width="${ancho.toFixed(1)}" height="${hc.toFixed(1)}" rx="1.5" fill="var(--clicks)"><title>${fechaCorta(d)}: ${clics[d] || 0} clics</title></rect>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Visitas y clics por día, últimos ${DIAS} días">` +
    `<line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="var(--line)"/>` +
    `<text x="0" y="12" fill="var(--muted)" font-size="11">${fmt(max)}</text>` + barras +
    `<text x="0" y="${H - 4}" fill="var(--muted)" font-size="11">${fechaCorta(dias[0])}</text>` +
    `<text x="${W}" y="${H - 4}" fill="var(--muted)" font-size="11" text-anchor="end">${fechaCorta(dias[dias.length - 1])}</text></svg>`;
}

export function construir(filas, hoy) {
  const dias = Array.from({ length: DIAS }, (_, i) => restarDias(hoy, DIAS - 1 - i));
  const vistas = {}, clics = {}, porBoton = {};
  for (const f of filas) {
    if (f.kind === 'view') vistas[f.day] = (vistas[f.day] || 0) + f.n;
    else { clics[f.day] = (clics[f.day] || 0) + f.n; porBoton[f.label] = (porBoton[f.label] || 0) + f.n; }
  }
  const suma = (obj, n) => dias.slice(-n).reduce((s, d) => s + (obj[d] || 0), 0);
  const kpi = (titulo, n) => `<div class="kpi"><p>${titulo}</p><strong>${fmt(suma(vistas, n))}</strong><p>visitas · ${fmt(suma(clics, n))} clics · ${pct(suma(clics, n), suma(vistas, n))}</p></div>`;
  const totalClics = suma(clics, DIAS);
  const filasDia = [...dias].reverse().map((d) =>
    `<tr${d === hoy ? ' class="hoy"' : ''}><td>${fechaCorta(d)}${d === hoy ? ' (hoy)' : ''}</td><td>${fmt(vistas[d] || 0)}</td><td>${fmt(clics[d] || 0)}</td><td>${pct(clics[d] || 0, vistas[d] || 0)}</td></tr>`).join('');
  const filasBoton = Object.keys(BOTONES).map((k) =>
    `<tr><td>${BOTONES[k]}</td><td>${fmt(porBoton[k] || 0)}</td><td>${pct(porBoton[k] || 0, totalClics)}</td></tr>`).join('');
  return pagina(`
<h1>Estadísticas de referidostesla.com</h1>
<p class="sub">Últimos ${DIAS} días. Los días van por hora de Madrid. Una visita es una carga de la página, no una persona distinta.</p>
<div class="kpis">${kpi('Hoy', 1)}${kpi('Últimos 7 días', 7)}${kpi('Últimos 30 días', DIAS)}</div>
<h2>Por día</h2>
<p class="leyenda"><span><i style="background:var(--views)"></i>Visitas</span><span><i style="background:var(--clicks)"></i>Clics a Tesla</span></p>
${grafica(dias, vistas, clics)}
<h2>Clics por botón (${DIAS} días)</h2>
<div class="tabla"><table><thead><tr><th>Botón</th><th>Clics</th><th>% del total</th></tr></thead><tbody>${filasBoton}</tbody></table></div>
<h2>Detalle diario</h2>
<div class="tabla"><table><thead><tr><th>Día</th><th>Visitas</th><th>Clics</th><th>Clics / visitas</th></tr></thead><tbody>${filasDia}</tbody></table></div>
<p class="aviso">Solo se guardan contadores por día y por botón. No hay cookies, ni direcciones IP, ni datos personales. Se ignoran los bots conocidos y las visitas de automatización.</p>`);
}

export async function onRequestGet({ request, env }) {
  const cabeceras = { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' };
  const clave = env.PANEL_TOKEN;
  const autorizado = clave ? new URL(request.url).searchParams.get('k') === clave : !!request.headers.get('cf-access-jwt-assertion');
  if (!autorizado) {
    return new Response(pagina('<h1>Acceso denegado</h1><p class="sub">Abre el panel desde Cloudflare Access o con la clave en el enlace.</p>'), { status: 403, headers: cabeceras });
  }
  if (!env.DB) {
    return new Response(pagina('<h1>Base de datos sin conectar</h1><p class="sub">Falta enlazar la base de datos D1 con el nombre DB en el proyecto de Pages.</p>'), { status: 503, headers: cabeceras });
  }
  const hoy = hoyMadrid();
  const { results } = await env.DB.prepare('SELECT day, kind, label, n FROM stats WHERE day >= ?1').bind(restarDias(hoy, DIAS - 1)).all();
  return new Response(construir(results || [], hoy), { headers: cabeceras });
}
