/* Service worker van de startpagina: serveert de game (game.html) vanaf het toestel (Cache Storage 'cod4-ported').
   Zo draait de game op een echt https-adres: opnieuw laden (na een update in de game) en offline starten werken. */
self.addEventListener('install',e=>{ self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(u.origin!==location.origin||!/\/game\.html$/.test(u.pathname))return;
  e.respondWith((async()=>{ const c=await caches.open('cod4-ported'); const keys=(await c.keys()).filter(r=>/\/game-[^\/]*$/.test(new URL(r.url).pathname));
    keys.sort((a,b)=>a.url<b.url?-1:1); const k=keys.pop(); const r=k&&await c.match(k);
    if(r)return new Response(r.body,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    return Response.redirect(new URL('./',u).href,302); })()); });
