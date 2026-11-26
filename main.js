/* Dona Sebastiana · links de compra, redes e pequenos comportamentos */
(function () {
  "use strict";

  // ── PREENCHER: link de checkout da Kiwify de cada produto ──
  // O site vende só o caderninho. As ofertas extras ficam por conta do checkout.
  var CHECKOUT = {
    caderninho: "https://pay.kiwify.com.br/kX2Z2YT",
    doces: "",
    churrasco: "",
    molhos: "",
    ceia: "",
    panetones: "",
    combo: ""
  };

  // ── PREENCHER: endereço dos perfis ──
  var REDES = { instagram: "", facebook: "", tiktok: "" };

  // parâmetros de campanha que seguem junto para o checkout
  var PASSAR = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck"];
  var doc = document.documentElement;
  doc.classList.add("js");

  function comOrigem(url) {
    try {
      var u = new URL(url), q = new URLSearchParams(location.search);
      PASSAR.forEach(function (k) { if (q.get(k) && !u.searchParams.has(k)) u.searchParams.set(k, q.get(k)); });
      return u.toString();
    } catch (e) { return url; }
  }

  // botões de compra
  document.querySelectorAll("[data-produto]").forEach(function (a) {
    var id = a.getAttribute("data-produto"), link = CHECKOUT[id];
    if (link) { a.href = comOrigem(link); a.target = "_blank"; a.rel = "noopener"; }
    a.addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "begin_checkout", produto: id, posicao: a.getAttribute("data-pos") || "" });
      if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout", { content_name: id });
    });
  });

  // links das redes
  document.querySelectorAll("[data-rede]").forEach(function (a) {
    var url = REDES[a.getAttribute("data-rede")];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else if (a.parentNode && a.parentNode.tagName === "LI") a.parentNode.hidden = true; // sem endereço, o botão não aparece
  });

  // vídeo da vó: começa sozinho e sem som (o navegador não deixa tocar com som sem um toque).
  // No primeiro toque ele volta pro começo, com som.
  document.querySelectorAll("[data-video]").forEach(function (cx) {
    var v = cx.querySelector("video"), bt = cx.querySelector("[data-tocar]"), comSom = false;
    if (!v) return;
    function evento(nome, fb) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: nome });
      if (typeof window.fbq === "function") window.fbq("trackCustom", fb);
    }
    function ouvir() {
      if (comSom) return; comSom = true;
      v.muted = false; v.loop = false; v.controls = true; v.currentTime = 0;
      v.play();
      if (bt) bt.hidden = true;
      evento("vsl_play", "VSLPlay");
    }
    var economia = navigator.connection && navigator.connection.saveData;
    if (!economia) {
      v.muted = true; v.loop = true; v.controls = false; v.setAttribute("muted", "");
      var p = v.play();
      if (p && p.then) p.then(function () { cx.classList.add("video--mudo"); }).catch(function () { v.controls = true; });
    }
    if (bt) bt.addEventListener("click", ouvir);
    v.addEventListener("volumechange", function () { if (!v.muted && !comSom) ouvir(); });
    v.addEventListener("play", function () { if (!v.muted && !comSom) ouvir(); });
    v.addEventListener("ended", function () { if (comSom) evento("vsl_fim", "VSLFim"); });
  });
  // ano do rodapé
  var ano = document.querySelector("[data-ano]");
  if (ano) ano.textContent = new Date().getFullYear();

  // entrada suave, só no que ainda está abaixo da tela
  var alvo = document.querySelectorAll(".secao h2, .cartao, .praquem li, .fatos, .moldura, .gente li, .duvidas details, .abre__foto");
  var calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calmo && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    alvo.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("rv"); io.observe(el); }
    });
  }
})();
