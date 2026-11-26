/* Dona Sebastiana · links de compra, vídeo e pequenos comportamentos.
   Este arquivo é a fonte: _bastidores\montar.cjs cola o conteúdo dele no fim do index.html. */
(function () {
  "use strict";

  // Link de checkout da Kiwify. O site vende só o caderninho; as ofertas extras ficam por conta do checkout.
  var CHECKOUT = { caderninho: "https://pay.kiwify.com.br/kX2Z2YT" };

  // Endereço dos perfis. Enquanto estiver vazio, o botão daquela rede não aparece.
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

  // roda depois que a página terminou de carregar (ou em no máximo 4 s, se a rede estiver lenta)
  function depois(fn) {
    var feito = false;
    function ir() { if (feito) return; feito = true; fn(); }
    if (document.readyState === "complete") ir();
    else { window.addEventListener("load", ir); setTimeout(ir, 4000); }
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
    else if (a.parentNode && a.parentNode.tagName === "LI") a.parentNode.hidden = true;
  });
  document.querySelectorAll(".redes").forEach(function (ul) { if (!ul.querySelector("li:not([hidden])")) ul.hidden = true; });

  // Vídeo da vó.
  // Por baixo fica o vídeo completo, que só começa a ser baixado quando a pessoa aperta.
  // Por cima roda uma prévia curta, leve e sem som (o navegador não deixa tocar com som sem um toque).
  // No toque, o vídeo completo começa do início, com som, e a prévia sai da frente.
  document.querySelectorAll("[data-video]").forEach(function (cx) {
    var filme = cx.querySelector("[data-filme]"), previa = cx.querySelector("[data-previa]"), bt = cx.querySelector("[data-tocar]");
    if (!filme) return;
    var comSom = false, solto = false;

    function evento(nome, fb) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: nome });
      if (typeof window.fbq === "function") window.fbq("trackCustom", fb);
    }

    // tira a prévia e o botão da frente: dali em diante valem os controles do próprio vídeo
    function soltar() {
      if (solto) return; solto = true;
      if (previa) {
        try { previa.pause(); previa.removeAttribute("src"); previa.load(); } catch (e) {}
        previa.hidden = true;
      }
      if (bt) bt.hidden = true;
      cx.classList.remove("video--mudo");
      cx.classList.remove("video--espera");
      filme.controls = true;
    }

    function ouvir() {
      if (comSom) return; comSom = true;
      cx.classList.add("video--espera");
      filme.muted = false;
      var p;
      try { p = filme.play(); } catch (e) { soltar(); }
      if (p && p.catch) p.catch(function () { soltar(); });
      setTimeout(soltar, 8000); // rede muito lenta: depois de 8 s mostra o vídeo com os controles dele
      evento("vsl_play", "VSLPlay");
    }

    filme.addEventListener("playing", soltar);
    filme.addEventListener("ended", function () { if (comSom) evento("vsl_fim", "VSLFim"); });
    if (bt) bt.addEventListener("click", ouvir);

    // a prévia só começa depois que a capa do vídeo já apareceu, para não atrasar o topo da página
    var economia = navigator.connection && navigator.connection.saveData;
    function iniciarPrevia() {
      if (comSom || solto || !previa || economia) return;
      var p;
      try {
        previa.muted = true; previa.defaultMuted = true; previa.setAttribute("muted", "");
        previa.src = previa.getAttribute("data-previa");
        p = previa.play();
      } catch (e) { return; }
      // se o navegador bloquear, fica só a capa com o botão grande de play
      if (p && p.then) p.then(function () { if (!comSom) cx.classList.add("video--mudo"); }).catch(function () {});
    }
    (function () {
      var feito = false;
      function ir() {
        if (feito) return; feito = true;
        var quadro = window.requestAnimationFrame || function (f) { setTimeout(f, 16); };
        quadro(function () { setTimeout(iniciarPrevia, 0); });
      }
      var capa = filme.getAttribute("poster");
      if (capa) { var im = new Image(); im.onload = ir; im.onerror = ir; im.src = capa; }
      window.addEventListener("load", ir);
      setTimeout(ir, 3500);
    })();
  });

  // ano do rodapé
  var ano = document.querySelector("[data-ano]");
  if (ano) ano.textContent = new Date().getFullYear();

  // Entrada suave do que está abaixo da tela. O próprio IntersectionObserver diz onde cada bloco está,
  // sem obrigar o navegador a recalcular o layout.
  var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calmo && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      var alt = window.innerHeight;
      es.forEach(function (e) {
        var el = e.target;
        if (e.isIntersecting) {
          if (el.classList.contains("rv")) el.classList.add("is-in");
          io.unobserve(el);
        } else if (!el.classList.contains("rv") && e.boundingClientRect.top >= alt) {
          el.classList.add("rv");
        }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".secao h2, .cartao, .praquem li, .fatos, .moldura, .gente li, .duvidas details, .abre__foto").forEach(function (el) { io.observe(el); });
  }

  // letra de mão (Caveat): só depois que a página abriu, porque ela só aparece mais abaixo
  depois(function () {
    try {
      if (!("FontFace" in window) || !document.fonts) return;
      var f = new FontFace("Caveat", "url(fonts/caveat-pt.woff2) format('woff2')", { weight: "600", style: "normal" });
      f.load().then(function (pronta) { document.fonts.add(pronta); }).catch(function () {});
    } catch (e) {}
  });
})();
