(function () {
  "use strict";
  var GA_ID = "G-7YGD11JSX4";
  var COOKIE_NAME = "adalia_consent";
  var isEN = document.documentElement.lang === "en";

  function getCookie(name) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, value) {
    var maxAge = 60 * 60 * 24 * 180; // 180 jours
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=" + maxAge + "; SameSite=Lax; Secure";
  }

  function loadGA() {
    if (window.__adaliaGaLoaded) return;
    window.__adaliaGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function injectStyle() {
    if (document.getElementById("adalia-consent-style")) return;
    var style = document.createElement("style");
    style.id = "adalia-consent-style";
    style.textContent =
      ".adalia-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:520px;margin:0 auto;background:#fff;color:#1c1c1c;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.25);padding:18px 20px;font:15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}" +
      ".adalia-consent p{margin:0 0 14px}" +
      ".adalia-consent a{color:#f4b400;text-decoration:underline}" +
      ".adalia-consent-actions{display:flex;gap:10px;flex-wrap:wrap}" +
      ".adalia-consent-actions button{flex:1;min-width:110px;padding:10px 16px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;border:1px solid #ddd}" +
      ".adalia-consent-accept{background:#f4b400;color:#0c0c0c;border-color:#f4b400}" +
      ".adalia-consent-decline{background:#fff;color:#1c1c1c}" +
      "@media(max-width:480px){.adalia-consent{left:10px;right:10px;bottom:10px;padding:16px}}";
    document.head.appendChild(style);
  }

  function showBanner() {
    injectStyle();
    var div = document.createElement("div");
    div.className = "adalia-consent";
    div.setAttribute("role", "dialog");
    div.setAttribute("aria-label", isEN ? "Cookie consent" : "Consentement aux cookies");
    var text = isEN
      ? "We use cookies only to measure site traffic (Google Analytics). You can accept or decline &mdash; this doesn&#x27;t affect your ability to book a taxi. <a href=\"/mentions-legales/\">Learn more</a>"
      : "Nous utilisons des cookies uniquement pour mesurer l&#x27;audience du site (Google Analytics). Vous pouvez accepter ou refuser &mdash; cela n&#x27;affecte pas votre possibilit&eacute; de r&eacute;server un taxi. <a href=\"/mentions-legales/\">En savoir plus</a>";
    var acceptLabel = isEN ? "Accept" : "Accepter";
    var declineLabel = isEN ? "Decline" : "Refuser";
    div.innerHTML =
      "<p>" + text + "</p>" +
      "<div class=\"adalia-consent-actions\">" +
      "<button type=\"button\" class=\"adalia-consent-decline\">" + declineLabel + "</button>" +
      "<button type=\"button\" class=\"adalia-consent-accept\">" + acceptLabel + "</button>" +
      "</div>";
    document.body.appendChild(div);
    div.querySelector(".adalia-consent-accept").addEventListener("click", function () {
      setCookie(COOKIE_NAME, "granted");
      div.remove();
      loadGA();
    });
    div.querySelector(".adalia-consent-decline").addEventListener("click", function () {
      setCookie(COOKIE_NAME, "denied");
      div.remove();
    });
  }

  function init() {
    var consent = getCookie(COOKIE_NAME);
    if (consent === "granted") {
      loadGA();
    } else if (consent !== "denied") {
      showBanner();
    }

    var manageLink = document.getElementById("adalia-manage-cookies");
    if (manageLink) {
      manageLink.addEventListener("click", function (e) {
        e.preventDefault();
        document.cookie = COOKIE_NAME + "=; path=/; max-age=0; SameSite=Lax; Secure";
        var existing = document.querySelector(".adalia-consent");
        if (existing) existing.remove();
        showBanner();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
