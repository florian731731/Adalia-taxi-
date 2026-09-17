const REDIRECTS = {
  "/services/maintenance/": "/taxi-gares-aeroports/",
  "/services/transport-international/": "/taxi-moutiers-aeroport-de-geneve/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = REDIRECTS[url.pathname];
    if (target) {
      return Response.redirect(new URL(target, url.origin).toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
