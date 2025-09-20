import 'kleur/colors';
import { l as decodeKey } from './chunks/astro/server_BbGzQJLV.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DBUFf7yW.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/sithu/Downloads/HyperWalletCollector%202/","cacheDir":"file:///Users/sithu/Downloads/HyperWalletCollector%202/node_modules/.astro/","outDir":"file:///Users/sithu/Downloads/HyperWalletCollector%202/dist/","srcDir":"file:///Users/sithu/Downloads/HyperWalletCollector%202/src/","publicDir":"file:///Users/sithu/Downloads/HyperWalletCollector%202/public/","buildClientDir":"file:///Users/sithu/Downloads/HyperWalletCollector%202/dist/client/","buildServerDir":"file:///Users/sithu/Downloads/HyperWalletCollector%202/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"@import\"https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap\";body{background-color:#1a2a6c;color:#fff;min-height:100vh;font-family:\"Press Start 2P\",system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}*:focus{outline:2px solid #60a5fa;outline-offset:2px}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#1f2937}::-webkit-scrollbar-thumb{background:#4f46e5;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#4338ca}\nbody{background-color:#0f172a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;margin:0;padding:20px}.container[data-astro-cid-2zp6q64z]{max-width:1200px;margin:0 auto}.header[data-astro-cid-2zp6q64z]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #334155}.title[data-astro-cid-2zp6q64z]{font-size:2rem;margin:0}.stats[data-astro-cid-2zp6q64z]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-bottom:30px}.stat-card[data-astro-cid-2zp6q64z]{background:#1e293b;padding:20px;border-radius:8px;border:1px solid #334155}.stat-title[data-astro-cid-2zp6q64z]{font-size:.9rem;color:#94a3b8;margin:0 0 10px}.stat-value[data-astro-cid-2zp6q64z]{font-size:1.8rem;font-weight:700;margin:0;color:#60a5fa}.card[data-astro-cid-2zp6q64z]{background:#1e293b;border-radius:8px;padding:25px;margin-bottom:30px;border:1px solid #334155}.card-title[data-astro-cid-2zp6q64z]{font-size:1.5rem;margin-top:0;margin-bottom:20px;color:#e2e8f0}.form-group[data-astro-cid-2zp6q64z]{margin-bottom:20px}.form-label[data-astro-cid-2zp6q64z]{display:block;margin-bottom:8px;font-weight:500}.form-input[data-astro-cid-2zp6q64z]{width:100%;padding:12px;background:#334155;border:1px solid #475569;border-radius:4px;color:#fff;font-size:1rem}.btn[data-astro-cid-2zp6q64z]{background:#3b82f6;color:#fff;border:none;padding:12px 24px;border-radius:4px;cursor:pointer;font-size:1rem;font-weight:500;margin-right:10px}.btn[data-astro-cid-2zp6q64z]:hover{background:#2563eb}.btn[data-astro-cid-2zp6q64z].secondary{background:#64748b}.btn[data-astro-cid-2zp6q64z].secondary:hover{background:#475569}.wallet-table[data-astro-cid-2zp6q64z]{width:100%;border-collapse:collapse;margin-top:20px}.wallet-table[data-astro-cid-2zp6q64z] th[data-astro-cid-2zp6q64z]{text-align:left;padding:12px;background:#334155;border-bottom:2px solid #475569}.wallet-table[data-astro-cid-2zp6q64z] td[data-astro-cid-2zp6q64z]{padding:12px;border-bottom:1px solid #334155}.wallet-table[data-astro-cid-2zp6q64z] tr[data-astro-cid-2zp6q64z]:hover{background:#334155}.message[data-astro-cid-2zp6q64z]{padding:15px;border-radius:4px;margin:20px 0;display:none}.message[data-astro-cid-2zp6q64z].error{background:#fee2e2;color:#991b1b;border:1px solid #fecaca}.message[data-astro-cid-2zp6q64z].success{background:#dcfce7;color:#166534;border:1px solid #bbf7d0}.hidden[data-astro-cid-2zp6q64z]{display:none}.wallet-list-container[data-astro-cid-2zp6q64z]{max-height:500px;overflow-y:auto}\n"}],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/wallets","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/wallets\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"wallets","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/wallets.js","pathname":"/api/admin/wallets","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/wallets","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/wallets\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"wallets","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/wallets.js","pathname":"/api/wallets","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"@import\"https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap\";body{background-color:#1a2a6c;color:#fff;min-height:100vh;font-family:\"Press Start 2P\",system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}*:focus{outline:2px solid #60a5fa;outline-offset:2px}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#1f2937}::-webkit-scrollbar-thumb{background:#4f46e5;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#4338ca}\n"},{"type":"external","src":"/_astro/index.BYgj1_A8.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/sithu/Downloads/HyperWalletCollector 2/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["/Users/sithu/Downloads/HyperWalletCollector 2/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin/wallets@_@js":"pages/api/admin/wallets.astro.mjs","\u0000@astro-page:src/pages/api/wallets@_@js":"pages/api/wallets.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CfNsIzTf.mjs","/Users/sithu/Downloads/HyperWalletCollector 2/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CWl_EzWr.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.BYgj1_A8.css","/favicon.ico","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"TSHFn/h1X1ks+RTL9NtTH04tMLbm2H2sHvoC8crXBP4="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
