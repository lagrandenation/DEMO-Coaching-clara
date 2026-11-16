// Sillage. — démo Alto Studio
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');

  // Nav : fond plein après quelques pixels de scroll
  function onScroll() {
    header.classList.toggle('solid', window.scrollY > 24);
  }
  if (header) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menu mobile
  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!header.classList.contains('nav-open'));
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  // Apparition au scroll
  var revs = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (x) {
        if (x.isIntersecting) {
          x.target.classList.add('vis');
          obs.unobserve(x.target);
        }
      });
    }, { threshold: 0.1 });
    revs.forEach(function (el) { obs.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('vis'); });
  }

  // Témoignages : duplique les cartes pour une boucle sans couture
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  // FAQ : une seule réponse ouverte par liste
  document.querySelectorAll('.faq').forEach(function (list) {
    var buttons = list.querySelectorAll('.faq-q');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        buttons.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  });

  // Formulaire de démonstration : rien n'est envoyé
  var form = document.querySelector('#rdv-form');
  if (form) {
    var ok = form.querySelector('.form-ok');

    // Présélection du programme depuis ?programme=…
    var wanted = new URLSearchParams(window.location.search).get('programme');
    if (wanted && form.elements.programme.querySelector('option[value="' + wanted.replace(/[^a-z-]/g, '') + '"]')) {
      form.elements.programme.value = wanted;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var prenom = (form.elements.prenom.value || '').trim();
      ok.textContent = 'Merci' + (prenom ? ' ' + prenom : '') +
        ' ! Votre demande est bien notée. (Site de démonstration : aucun message n\'est réellement envoyé.)';
      ok.classList.add('show');
      form.reset();
      ok.focus();
    });
  }
})();
