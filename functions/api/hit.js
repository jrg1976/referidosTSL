const BOTONES = new Set(['header', 'menu', 'hero', 'model3', 'modely', 'cierre', 'barra']);
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|node-fetch|axios|java\//i;

export async function onRequestPost({ request, env }) {
  const ok = new Response(null, { status: 204 });
  try {
    if (!env.DB) return ok;
    const sitio = request.headers.get('sec-fetch-site');
    if (sitio && sitio !== 'same-origin') return ok;
    if (BOT.test(request.headers.get('user-agent') || '')) return ok;
    if (Number(request.headers.get('content-length') || 0) > 200) return ok;

    const cuerpo = await request.json();
    const tipo = cuerpo.t === 'click' ? 'click' : cuerpo.t === 'view' ? 'view' : null;
    const boton = tipo === 'click' ? cuerpo.l : 'home';
    if (!tipo || (tipo === 'click' && !BOTONES.has(boton))) return ok;

    const dia = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date());
    await env.DB.prepare(
      'INSERT INTO stats (day, kind, label, n) VALUES (?1, ?2, ?3, 1) ON CONFLICT(day, kind, label) DO UPDATE SET n = n + 1'
    ).bind(dia, tipo, boton).run();
  } catch (e) {}
  return ok;
}
