const APP_VERSION="1.0.0";

const urls_to_cache=[
    "/",
    "/index.html",
    "/bundle.js"
];

class AppInstallSupport{
    static onInstall=(e)=>{
        e.waitUntil(caches.open(APP_VERSION).then((cache)=>{
            return cache.addAll(urls_to_cache);
        }))
          //@ts-ignore
          self.skipWaiting();
    }

    static onActivate=(e)=>{
        e.waitUntil(
            caches.keys().then((cacheNames)=>{
                return Promise.all(cacheNames.map((cacheName)=>{
                    if(cacheName!==APP_VERSION){
                        return caches.delete(cacheName);
                    }
                }));
            })
        )
    }

    static onFetch=(e)=>{
        e.respondWith(
            caches.match(e.request).then((res)=>{
                if(res){
                    return res;
                }
                return fetch(e.request);
            })
        );
    }

    static run(){
        self.addEventListener("install",AppInstallSupport.onInstall);
        self.addEventListener("activate", AppInstallSupport.onActivate);
        self.addEventListener("fetch",AppInstallSupport.onFetch)
    }
}

AppInstallSupport.run();