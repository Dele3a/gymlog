const CACHE="gymlog-cache-v18";
const FILES=["./","./index.html","./app.js","./gym-exercises.js","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png"];

self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Cache each asset independently. A single optional icon failure must not
  // prevent the new worker from installing and replacing an older broken cache.
  await Promise.all(FILES.map(async path=>{
   try{
    const response=await fetch(path,{cache:"reload"});
    if(response.ok)await cache.put(path,response);
   }catch(error){console.warn("GYMLOG cache skipped:",path,error)}
  }));
  await self.skipWaiting();
 })());
});

self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith("gymlog-cache-")&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});

self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 // Never intercept RepDB/CDN requests. Let the browser handle their CORS,
 // response status and timeout without a service-worker HTML fallback.
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  try{
   const response=await fetch(request);
   if(response.ok){
    const cache=await caches.open(CACHE);
    cache.put(request,response.clone()).catch(()=>{});
   }
   return response;
  }catch(error){
   if(request.mode==="navigate"){
    const fallback=await caches.match("./index.html");
    if(fallback)return fallback;
   }
   throw error;
  }
 })());
});
