/**
 * Cloudflare Pages worker (copied from public/ into out/).
 * Host-based redirects in _redirects are ignored; this folds www → apex
 * the same way paychecklink.com does, and sends slashless pages to the
 * trailing-slash address Google already has in the sitemap.
 */
const APEX = "imageresizelab.com";

const HOSTS_TO_APEX = new Set([
  "www.imageresizelab.com",
  "imageresizelab.pages.dev",
]);

const ASSET_ALIASES = {
  "/opengraph-image": "/og.png",
  "/opengraph-image/": "/og.png",
  "/icon": "/icon.png",
  "/icon/": "/icon.png",
};

const PAGE_ALIASES = {
  "/image-resizer": "/",
  "/image-resizer/": "/",
};

function hasFileExtension(path) {
  const last = path.split("/").pop() || "";
  return /\.[a-zA-Z0-9]{1,8}$/.test(last);
}

function stripHash(url) {
  const copy = new URL(url.href);
  copy.hash = "";
  return copy.href;
}

export function resolveCanonical(input) {
  const incoming = new URL(input);
  const target = new URL(incoming.href);
  target.hash = "";

  const host = incoming.hostname.toLowerCase();
  if (incoming.protocol !== "https:" || HOSTS_TO_APEX.has(host)) {
    target.protocol = "https:";
    target.hostname = APEX;
  }

  let path = target.pathname.replace(/\/{2,}/g, "/");
  if (path === "/index.html") {
    path = "/";
  } else if (path.endsWith("/index.html")) {
    path = path.slice(0, -"index.html".length);
    if (!path.endsWith("/")) path += "/";
  }

  if (Object.prototype.hasOwnProperty.call(ASSET_ALIASES, path)) {
    path = ASSET_ALIASES[path];
    target.search = "";
  } else if (Object.prototype.hasOwnProperty.call(PAGE_ALIASES, path)) {
    path = PAGE_ALIASES[path];
  } else if (!hasFileExtension(path) && !path.endsWith("/")) {
    path += "/";
  }

  target.pathname = path;
  return {
    redirect: target.href !== stripHash(incoming),
    url: target.href,
  };
}

export default {
  async fetch(request, env) {
    try {
      const decision = resolveCanonical(request.url);
      if (decision.redirect) {
        return Response.redirect(decision.url, 301);
      }
    } catch {
      // A bad URL must not become a 5xx. Serve the static file.
    }
    return env.ASSETS.fetch(request);
  },
};
